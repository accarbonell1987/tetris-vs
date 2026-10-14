import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { io as ioClient } from 'socket.io-client';
import { httpServer } from '../../src/server.js';

// ponytail: websocket only; with the default polling→websocket upgrade an event is lost now and then
// (about 1 run in 15 timed out), investigate the upgrade path if real clients ever show it.
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

describe('Online match flow', () => {
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

  // Unique ids per test so late disconnects from a previous test never touch this one.
  const join = async name => {
    playerCount += 1;
    const player = { id: `${name}-${playerCount}`, name, image: `${name}.png` };
    const socket = ioClient(serverURL, CLIENT_OPTIONS);
    sockets.push(socket);
    await waitFor(socket, 'connect');
    const joined = waitFor(socket, 'lobby-update', players =>
      players.some(entry => entry.id === player.id)
    );
    socket.emit('lobby-join', { player });
    await joined;
    return { socket, player };
  };

  const startMatch = async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const received = waitFor(bob.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    await received;
    const starts = Promise.all([
      waitFor(alice.socket, 'match-start'),
      waitFor(bob.socket, 'match-start')
    ]);
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    const [start, startForBob] = await starts;
    return { alice, bob, start, startForBob };
  };

  test('joining sets the player idle in lobby-update', async () => {
    const alice = await join('alice');
    const update = waitFor(alice.socket, 'lobby-update', players =>
      players.some(entry => entry.id === alice.player.id)
    );
    alice.socket.emit('lobby-join', { player: alice.player });
    const players = await update;
    expect(players.find(entry => entry.id === alice.player.id)).toEqual({
      ...alice.player,
      status: 'idle'
    });
  });

  test('a second socket joining for a playing player keeps them playing', async () => {
    const { alice } = await startMatch();
    const secondTab = ioClient(serverURL, CLIENT_OPTIONS);
    sockets.push(secondTab);
    await waitFor(secondTab, 'connect');
    const update = waitFor(secondTab, 'lobby-update', players =>
      players.some(entry => entry.id === alice.player.id)
    );
    secondTab.emit('lobby-join', { player: alice.player });
    const players = await update;
    expect(players.find(entry => entry.id === alice.player.id).status).toBe('playing');
  });

  test('challenge-send delivers challenge-received to the target only', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const carol = await join('carol');
    const received = waitFor(bob.socket, 'challenge-received');
    const carolSilent = expectSilence(carol.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    expect(await received).toEqual({ from: alice.player });
    await carolSilent;
  });

  test('invalid challenges answer challenge-error to the challenger', async () => {
    const alice = await join('alice');
    const cases = [
      [alice.player.id, 'No puedes desafiarte a ti mismo'],
      ['nobody', 'Jugador no encontrado']
    ];
    for (const [to, message] of cases) {
      const error = waitFor(alice.socket, 'challenge-error');
      alice.socket.emit('challenge-send', { to });
      expect(await error).toEqual({ message });
    }
  });

  test('a playing target or a playing challenger cannot be challenged', async () => {
    const { alice } = await startMatch();
    const carol = await join('carol');
    const carolError = waitFor(carol.socket, 'challenge-error');
    carol.socket.emit('challenge-send', { to: alice.player.id });
    expect(await carolError).toEqual({ message: 'El jugador está ocupado' });
    const aliceError = waitFor(alice.socket, 'challenge-error');
    alice.socket.emit('challenge-send', { to: carol.player.id });
    expect(await aliceError).toEqual({ message: 'Debes estar libre en el lobby para desafiar' });
  });

  test('decline tells the challenger and consumes the challenge', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const received = waitFor(bob.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    await received;
    const declined = waitFor(alice.socket, 'challenge-declined');
    bob.socket.emit('challenge-decline', { from: alice.player.id });
    expect(await declined).toEqual({ by: { id: bob.player.id, name: bob.player.name } });
    const error = waitFor(bob.socket, 'challenge-error');
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    expect(await error).toEqual({ message: expect.any(String) });
  });

  test('accepting without a pending challenge answers challenge-error to the acceptor', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const error = waitFor(bob.socket, 'challenge-error');
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    expect(await error).toEqual({ message: 'El desafío ya no está disponible' });
  });

  test('a new invite tells the replaced challenger and drops their challenge', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const carol = await join('carol');
    const first = waitFor(bob.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    await first;
    const replaced = waitFor(alice.socket, 'challenge-error');
    const second = waitFor(bob.socket, 'challenge-received');
    const carolSilent = expectSilence(carol.socket, 'challenge-error');
    carol.socket.emit('challenge-send', { to: bob.player.id });
    expect(await second).toEqual({ from: carol.player });
    expect(await replaced).toEqual({ message: `${bob.player.name} recibió otro desafío` });
    await carolSilent;
    const error = waitFor(bob.socket, 'challenge-error');
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    expect(await error).toEqual({ message: 'El desafío ya no está disponible' });
  });

  test('accept sends the same match-start to both and marks them playing', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const received = waitFor(bob.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    await received;
    const bothPlaying = waitFor(
      alice.socket,
      'lobby-update',
      players => players.filter(entry => entry.status === 'playing').length === 2
    );
    const starts = Promise.all([
      waitFor(alice.socket, 'match-start'),
      waitFor(bob.socket, 'match-start')
    ]);
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    const [start, startForBob] = await starts;
    expect(startForBob).toEqual(start);
    expect(start).toEqual({
      matchId: expect.any(String),
      players: [alice.player, bob.player],
      round: 1,
      seed: expect.any(Number),
      wins: { [alice.player.id]: 0, [bob.player.id]: 0 },
      countdownMs: 3000
    });
    const players = await bothPlaying;
    expect(players.map(entry => entry.id).sort()).toEqual([alice.player.id, bob.player.id].sort());
  });

  test('garbage is relayed only to the opponent and only when valid for the current round', async () => {
    const { alice, bob, start } = await startMatch();
    const { matchId } = start;
    const bobGarbage = waitFor(bob.socket, 'match-garbage');
    const aliceSilent = expectSilence(alice.socket, 'match-garbage');
    alice.socket.emit('match-garbage', { matchId, round: 2, lines: 1 });
    alice.socket.emit('match-garbage', { matchId: 'other', round: 1, lines: 1 });
    alice.socket.emit('match-garbage', { matchId, round: 1, lines: 0 });
    alice.socket.emit('match-garbage', { matchId, round: 1, lines: 21 });
    alice.socket.emit('match-garbage', { matchId, round: 1, lines: 1.5 });
    alice.socket.emit('match-garbage', { matchId, round: 1, lines: 4 });
    expect(await bobGarbage).toEqual({ round: 1, lines: 4 });
    await aliceSilent;

    const roundStart = waitFor(bob.socket, 'round-start');
    bob.socket.emit('match-topout', { matchId, round: 1 });
    await roundStart;
    const nextGarbage = waitFor(bob.socket, 'match-garbage');
    alice.socket.emit('match-garbage', { matchId, round: 1, lines: 3 });
    alice.socket.emit('match-garbage', { matchId, round: 2, lines: 2 });
    expect(await nextGarbage).toEqual({ round: 2, lines: 2 });
  });

  test('boards are relayed to the opponent only when well formed', async () => {
    const { alice, bob, start } = await startMatch();
    const { matchId } = start;
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 0, 0]
    ];
    const relayed = waitFor(alice.socket, 'match-board');
    const bobSilent = expectSilence(bob.socket, 'match-board');
    bob.socket.emit('match-board', { matchId, round: 1, board: 'nope' });
    bob.socket.emit('match-board', { matchId, round: 1, board: [[9]] });
    bob.socket.emit('match-board', {
      matchId,
      round: 1,
      board: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    });
    bob.socket.emit('match-board', {
      matchId,
      round: 1,
      board: Array.from({ length: 23 }, () => [])
    });
    bob.socket.emit('match-board', { matchId, round: 2, board });
    bob.socket.emit('match-board', { matchId, round: 1, board });
    expect(await relayed).toEqual({ round: 1, board });
    await bobSilent;
  });

  test('top-outs end rounds and the second win ends the match by KO', async () => {
    const { alice, bob, start } = await startMatch();
    const { matchId } = start;
    const a = alice.player.id;
    const b = bob.player.id;

    const roundEnd = waitFor(bob.socket, 'round-end');
    const roundStart = waitFor(bob.socket, 'round-start');
    alice.socket.emit('match-topout', { matchId, round: 1 });
    bob.socket.emit('match-topout', { matchId, round: 1 });
    expect(await roundEnd).toEqual({ round: 1, winner: b, wins: { [a]: 0, [b]: 1 } });
    const second = await roundStart;
    expect(second).toEqual({
      round: 2,
      seed: expect.any(Number),
      wins: { [a]: 0, [b]: 1 },
      countdownMs: 3000
    });
    expect(second.seed).not.toBe(start.seed);

    // Alice may still be receiving round 2's start: wait for round 3 explicitly.
    const thirdStart = waitFor(alice.socket, 'round-start', payload => payload.round === 3);
    bob.socket.emit('match-topout', { matchId, round: 2 });
    expect(await thirdStart).toEqual({
      round: 3,
      seed: expect.any(Number),
      wins: { [a]: 1, [b]: 1 },
      countdownMs: 3000
    });

    const finalRound = waitFor(alice.socket, 'round-end');
    const ends = Promise.all([
      waitFor(alice.socket, 'match-end'),
      waitFor(bob.socket, 'match-end')
    ]);
    const bothIdle = waitFor(
      alice.socket,
      'lobby-update',
      players =>
        players.filter(entry => [a, b].includes(entry.id) && entry.status === 'idle').length === 2
    );
    alice.socket.emit('match-topout', { matchId, round: 3 });
    expect(await finalRound).toEqual({ round: 3, winner: b, wins: { [a]: 1, [b]: 2 } });
    const [end, endForBob] = await ends;
    expect(end).toEqual({ winner: b, wins: { [a]: 1, [b]: 2 }, reason: 'ko' });
    expect(endForBob).toEqual(end);
    await bothIdle;

    const silent = expectSilence(alice.socket, 'match-garbage');
    bob.socket.emit('match-garbage', { matchId, round: 3, lines: 2 });
    await silent;
  });

  test('match-leave forfeits the match to the opponent', async () => {
    const { alice, bob, start } = await startMatch();
    const ends = Promise.all([
      waitFor(alice.socket, 'match-end'),
      waitFor(bob.socket, 'match-end')
    ]);
    const bothIdle = waitFor(
      bob.socket,
      'lobby-update',
      players => players.filter(entry => entry.status === 'idle').length === 2
    );
    alice.socket.emit('match-leave', { matchId: start.matchId });
    const [end, endForBob] = await ends;
    expect(end).toEqual({ winner: bob.player.id, wins: start.wins, reason: 'forfeit' });
    expect(endForBob).toEqual(end);
    await bothIdle;
  });

  test('disconnecting mid-match forfeits and removes the player from the lobby', async () => {
    const { alice, bob, start } = await startMatch();
    const end = waitFor(bob.socket, 'match-end');
    const update = waitFor(
      bob.socket,
      'lobby-update',
      players => !players.some(entry => entry.id === alice.player.id)
    );
    alice.socket.disconnect();
    expect(await end).toEqual({ winner: bob.player.id, wins: start.wins, reason: 'forfeit' });
    const players = await update;
    expect(players.find(entry => entry.id === bob.player.id).status).toBe('idle');
  });

  test('disconnecting drops the pending challenge', async () => {
    const alice = await join('alice');
    const bob = await join('bob');
    const received = waitFor(bob.socket, 'challenge-received');
    alice.socket.emit('challenge-send', { to: bob.player.id });
    await received;
    const gone = waitFor(
      bob.socket,
      'lobby-update',
      players => !players.some(entry => entry.id === alice.player.id)
    );
    alice.socket.disconnect();
    await gone;
    // Alice comes back idle: only a dropped challenge makes the accept fail now.
    const rejoined = ioClient(serverURL, CLIENT_OPTIONS);
    sockets.push(rejoined);
    await waitFor(rejoined, 'connect');
    const back = waitFor(bob.socket, 'lobby-update', players =>
      players.some(entry => entry.id === alice.player.id)
    );
    rejoined.emit('lobby-join', { player: alice.player });
    await back;
    const error = waitFor(bob.socket, 'challenge-error');
    bob.socket.emit('challenge-accept', { from: alice.player.id });
    expect(await error).toEqual({ message: expect.any(String) });
  });
});
