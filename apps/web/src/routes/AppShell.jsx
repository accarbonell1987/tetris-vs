import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChallengeModal from '../views/Lobby/components/ChallengeModal';
import { useGlobalStorage } from '../store';
import { SocketService } from '../services/socketService';
import { StorageService } from '../services/localStorageService';

/**
 * Root of every route: keeps the socket connected and handles lobby and challenge messages,
 * so an invite reaches the player on any screen and an accepted one opens /match.
 */
const AppShell = () => {
  const { player, socket, setPlayers, setMatch, setNotice } = useGlobalStorage();
  const navigate = useNavigate();
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
      'match-start': match => {
        setChallenger(null);
        setNotice(null);
        setMatch(match);
        navigate('/match');
      }
    };
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [socket, setPlayers, setMatch, setNotice, navigate]);

  const answer = accepted => {
    socket?.emit(accepted ? 'challenge-accept' : 'challenge-decline', { from: challenger.id });
    setChallenger(null);
  };

  return (
    <>
      <Outlet />
      <ChallengeModal challenger={challenger} onAccept={() => answer(true)} onDecline={() => answer(false)} />
    </>
  );
};

export default AppShell;
