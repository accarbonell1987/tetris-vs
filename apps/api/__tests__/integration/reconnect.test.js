import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { io as ioClient } from 'socket.io-client';
import { httpServer } from '../../src/server.js';

// Read by the server when a grace starts: keep the tests far from the 15 s default.
const GRACE_MS = 300;
process.env.RECONNECT_GRACE_MS = String(GRACE_MS);

const CLIENT_OPTIONS = { forceNew: true, transports: ['websocket'] };

const waitFor = (socket, event, predicate = () => true) =>
  new Promise(resolve => {
    const handler = payload => {
      if (!predicate(payload)) return;
      socket.off(event, handler);
      resolve(payload);
    };
    socket.on(event, handler);
  });

const expectSilence = (socket, event, milliseconds = 150) =>
  new Promise((resolve, reject) => {
    const handler = payload => reject(new Error(`unexpected ${event}: ${JSON.stringify(payload)}`));
    socket.on(event, handler);
    setTimeout(() => {
      socket.off(event, handler);
      resolve();
    }, milliseconds);
  });

describe('Match reconnection', () => {
  let serverURL;
  let sockets = [];
  let playerCount = 0;

  beforeAll(async () => {
    await new Promise(resolve => httpServer.listen(0, 'localhost', resolve));
    serverURL = `http://localhost:${httpServer.address().port}`;
  });

  afterAll(() => {
    httpServer.close();
  });

  afterEach(() => {
    sockets.forEach(socket => socket.disconnect());
    sockets = [];
  });

  const connect = async () => {
    const socket = ioClient(serverURL, CLIENT_OPTIONS);
    sockets.push(socket);
    await waitFor(socket, 'connect');
    return socket;
  };

  // A new socket (reconnect, reload or new tab) joins the lobby as `player`.
  const joinAs = async player => {
    const socket = await connect();
    const joined = waitFor(socket, 'lobby-update', players => players.some(entry => entry.id === player.id));
    socket.emit('lobby-join', { player });
    await joined;
    return socket;
  };

  const join = async name => {
    playerCount += 1;
    const player = { id: `${name}-${playerCount}`, name, image: `${name}.png` };
    return { socket: await joinAs(player), player };
  };

  const challenge = async (from, to) => {
    const received = waitFor(to.socket, 'challenge-received', message => message.from.id === from.player.id);
    from.socket.emit('challenge-send', { to: to.player.id });
    await received;
  };

  const startMatch = async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    await challenge(alice, bob);
    const starts = Promise.all([waitFor(alice.socket, 'match-start'), waitFor(bob.socket, 'match-start')]);
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    const [start] = await starts;
    return { alice, bob, start };
  };

  // Alice's only socket drops: Bob is told the grace started.
  const dropAlice = async ({ alice, bob }) => {
    const graceStarted = waitFor(bob.socket, 'opponent-disconnected');
    alice.socket.disconnect();
    return graceStarted;
  };

  test('a dropped player gets a grace period, and rejoining with its game resumes the round for both', async () => {
    const { alice, bob, start } = await startMatch();
    expect(await dropAlice({ alice, bob })).toEqual({ graceMs: GRACE_MS });

    const socket = await connect();
    const active = waitFor(socket, 'match-active');
    socket.emit('lobby-join', { player: alice.player });
    expect(await active).toEqual({
      matchId: start.matchId,
      players: start.players,
      round: 1,
      seed: start.seed,
      wins: start.wins,
      countdownMs: 3000
    });

    const resumes = Promise.all([waitFor(socket, 'match-resume'), waitFor(bob.socket, 'match-resume')]);
    socket.emit('match-rejoin', { matchId: start.matchId, round: 1, hasGame: true });
    const [resume, resumeForBob] = await resumes;
    expect(resume).toEqual({ round: 1, wins: start.wins, countdownMs: 3000 });
    expect(resumeForBob).toEqual(resume);

    // The grace timer is cleared and the rejoined socket is back in the match room.
    const noEnd = expectSilence(bob.socket, 'match-end', GRACE_MS + 200);
    const garbage = waitFor(socket, 'match-garbage');
    bob.socket.emit('match-garbage', { matchId: start.matchId, round: 1, lines: 2 });
    expect(await garbage).toEqual({ round: 1, lines: 2 });
    await noEnd;
  });

  test('rejoining without a game (reload) or for another round loses the current round', async () => {
    const { alice, bob, start } = await startMatch();
    const a = alice.player.id;
    const b = bob.player.id;
    await dropAlice({ alice, bob });

    const socket = await joinAs(alice.player);
    const roundEnd = waitFor(bob.socket, 'round-end');
    const roundStart = waitFor(socket, 'round-start');
    socket.emit('match-rejoin', { matchId: start.matchId, round: 1, hasGame: false });
    expect(await roundEnd).toEqual({ round: 1, winner: b, wins: { [a]: 0, [b]: 1 } });
    expect(await roundStart).toEqual({ round: 2, seed: expect.any(Number), wins: { [a]: 0, [b]: 1 }, countdownMs: 3000 });

    // A round mismatch counts as a lost round too: the second loss ends the match.
    const ends = Promise.all([waitFor(socket, 'match-end'), waitFor(bob.socket, 'match-end')]);
    socket.emit('match-rejoin', { matchId: start.matchId, round: 1, hasGame: true });
    const [end, endForBob] = await ends;
    expect(end).toEqual({ winner: b, wins: { [a]: 0, [b]: 2 }, reason: 'ko' });
    expect(endForBob).toEqual(end);
  });

  test('when the grace runs out the opponent wins by disconnect and is idle again', async () => {
    const { alice, bob, start } = await startMatch();
    const end = waitFor(bob.socket, 'match-end');
    const idle = waitFor(bob.socket, 'lobby-update', players =>
      players.some(entry => entry.id === bob.player.id && entry.status === 'idle')
    );
    await dropAlice({ alice, bob });
    expect(await end).toEqual({ winner: bob.player.id, wins: start.wins, reason: 'disconnect' });
    const players = await idle;
    expect(players.some(entry => entry.id === alice.player.id)).toBe(false);

    // Alice comes back after the match ended: no match-active, she is idle.
    const socket = await connect();
    const noActive = expectSilence(socket, 'match-active');
    const back = waitFor(socket, 'lobby-update', list => list.some(entry => entry.id === alice.player.id));
    socket.emit('lobby-join', { player: alice.player });
    expect((await back).find(entry => entry.id === alice.player.id).status).toBe('idle');
    await noActive;
  });

  test('closing one of two connected tabs does not start the grace (S5)', async () => {
    const alice = await join('alice');
    const secondTab = await joinAs(alice.player);
    const bob = await join('bob');
    await challenge(alice, bob);
    const starts = Promise.all([waitFor(secondTab, 'match-start'), waitFor(bob.socket, 'match-start')]);
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    const [start] = await starts;

    const noGrace = expectSilence(bob.socket, 'opponent-disconnected', GRACE_MS + 200);
    const noEnd = expectSilence(bob.socket, 'match-end', GRACE_MS + 200);
    alice.socket.disconnect();
    await Promise.all([noGrace, noEnd]);

    const garbage = waitFor(bob.socket, 'match-garbage');
    secondTab.emit('match-garbage', { matchId: start.matchId, round: 1, lines: 1 });
    expect(await garbage).toEqual({ round: 1, lines: 1 });
  });

  test('match-rejoin is ignored for unknown matches and players outside the match', async () => {
    const { alice, bob, start } = await startMatch();
    const carol = await join('carol');
    const silent = [alice.socket, bob.socket, carol.socket].flatMap(socket =>
      ['match-resume', 'round-end', 'match-end'].map(event => expectSilence(socket, event))
    );
    carol.socket.emit('match-rejoin', { matchId: start.matchId, round: 1, hasGame: false });
    alice.socket.emit('match-rejoin', { matchId: 'other', round: 1, hasGame: false });
    alice.socket.emit('match-rejoin');
    await Promise.all(silent);
  });

  describe('challenge-cancelled (S6)', () => {
    test('re-challenging someone else cancels the old invite', async () => {
      const alice = await join('alice');
      const bob = await join('bob');
      const carol = await join('carol');
      await challenge(alice, bob);
      const cancelled = waitFor(bob.socket, 'challenge-cancelled');
      await challenge(alice, carol);
      expect(await cancelled).toEqual({ from: alice.player.id });
    });

    test('re-challenging the same player does not cancel the invite', async () => {
      const alice = await join('alice');
      const bob = await join('bob');
      await challenge(alice, bob);
      const silent = expectSilence(bob.socket, 'challenge-cancelled');
      await challenge(alice, bob);
      await silent;
    });

    test('starting another match cancels the challenger’s open invite', async () => {
      const alice = await join('alice');
      const bob = await join('bob');
      const carol = await join('carol');
      await challenge(alice, bob);
      await challenge(carol, alice);
      const cancelled = waitFor(bob.socket, 'challenge-cancelled');
      alice.socket.emit('challenge-accept', { from: carol.player.id });
      expect(await cancelled).toEqual({ from: alice.player.id });
    });

    test('the challenger disconnecting cancels the invite', async () => {
      const alice = await join('alice');
      const bob = await join('bob');
      await challenge(alice, bob);
      const cancelled = waitFor(bob.socket, 'challenge-cancelled');
      alice.socket.disconnect();
      expect(await cancelled).toEqual({ from: alice.player.id });
    });
  });
});
