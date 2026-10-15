import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ChallengeModal from '../views/Lobby/components/ChallengeModal';
import { useGlobalStorage } from '../store';
import { SocketService } from '../services/socketService';
import { StorageService } from '../services/localStorageService';

/**
 * Root of every route: keeps the socket connected and handles lobby and challenge messages,
 * so an invite reaches the player on any screen and an accepted one opens /match.
 * While a match is on, every route leads back to /match; a finished one is dropped once the player leaves it.
 */
const AppShell = () => {
  const { player, socket, match, setPlayers, setMatch, finishMatch, clearMatch, setNotice } = useGlobalStorage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [challenger, setChallenger] = useState(null);

  // After a page refresh the session comes from localStorage but the socket is gone: reconnect.
  useEffect(() => {
    if (socket) return;
    const user = player?.loggedIn ? player : StorageService.getItem('tetris')?.user;
    if (!user?.loggedIn) return;
    SocketService.createSocketService();
    SocketService.login({ id: user.id, name: user.name, image: user.image });
  }, [socket, player]);

  useEffect(() => {
    if (!socket) return;

    const handlers = {
      'lobby-update': setPlayers,
      'challenge-received': ({ from }) => setChallenger(from),
      'challenge-declined': ({ by }) => setNotice(`${by.name} rechazó tu desafío`),
      'challenge-error': ({ message }) => setNotice(message),
      'challenge-cancelled': ({ from }) => setChallenger(current => (current?.id === from ? null : current)),
      'match-start': started => {
        setChallenger(null);
        setNotice(null);
        setMatch(started);
        navigate('/match');
      },
      // After a reconnect, reload or in a new tab. The match still on screen (network drop) answers
      // match-rejoin with its board; any other client lost its board and rejoins without it (S3).
      'match-active': active => {
        setChallenger(null);
        setNotice(null);
        const current = useGlobalStorage.getState().match;
        const onScreen = current?.matchId === active.matchId;
        // A second match-active (lobby-join is sent twice on load) must not drop a rejoin still pending.
        setMatch(onScreen ? { ...active, ...(current.rejoin && { rejoin: true }) } : { ...active, rejoin: true });
        navigate('/match');
      },
      'match-end': finishMatch
    };
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [socket, setPlayers, setMatch, finishMatch, setNotice, navigate]);

  useEffect(() => {
    if (match?.over && pathname !== '/match') clearMatch();
  }, [match, pathname, clearMatch]);

  const answer = accepted => {
    socket?.emit(accepted ? 'challenge-accept' : 'challenge-decline', { from: challenger.id });
    setChallenger(null);
  };

  return (
    <>
      {match && !match.over && pathname !== '/match' ? <Navigate to="/match" replace /> : <Outlet />}
      <ChallengeModal challenger={challenger} onAccept={() => answer(true)} onDecline={() => answer(false)} />
    </>
  );
};

export default AppShell;
