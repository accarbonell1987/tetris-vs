import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody } from '@nextui-org/react';
import PlayerCard from './components/PlayerCard';
import ChallengeModal from './components/ChallengeModal';
import { CustomLayout } from '../../components';
import { useGlobalStorage } from '../../store';
import { SocketService } from '../../services/socketService';
import { StorageService } from '../../services/localStorageService';

const Lobby = () => {
  const { player, players, socket, setPlayers, setMatch } = useGlobalStorage();
  const navigate = useNavigate();
  const [challenger, setChallenger] = useState(null);
  const [notice, setNotice] = useState(null);

  // After a page refresh the session comes from localStorage but the socket is gone: reconnect.
  useEffect(() => {
    if (socket) return;
    const user = player?.loggedIn ? player : StorageService.getItem('tetris')?.user;
    if (!user) return;
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
        setMatch(match);
        navigate('/match');
      }
    };
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [socket, setPlayers, setMatch, navigate]);

  const challenge = target => {
    socket?.emit('challenge-send', { to: target.id });
    setNotice(`Desafío enviado a ${target.name}`);
  };

  const answer = accepted => {
    socket?.emit(accepted ? 'challenge-accept' : 'challenge-decline', { from: challenger.id });
    setChallenger(null);
  };

  return (
    <CustomLayout>
      <Card
        className="flex w-full max-w-[600px] max-h-[70%] min-w-[180px]"
        variant="bordered"
        style={{ border: '1px solid #f0f0f0' }}>
        <CardHeader className="flex justify-between">
          <h1> Lobby</h1>
          <Button color="warning" variant="flat" size="sm" onPress={() => navigate('/game')}>
            Partida local
          </Button>
        </CardHeader>
        <CardBody className="overflow-auto scrollbar-hide max-h-screen">
          {notice && (
            <p className="text-small text-warning mb-3" role="status">
              {notice}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {players.map((lobbyPlayer, index) => (
              <PlayerCard
                key={`PlayerCard-${lobbyPlayer.id || index}`}
                name={lobbyPlayer.name}
                avatar={lobbyPlayer.image}
                status={lobbyPlayer.status}
                isSelf={lobbyPlayer.id === player?.id}
                onChallenge={() => challenge(lobbyPlayer)}
              />
            ))}
          </div>
        </CardBody>
      </Card>
      <ChallengeModal challenger={challenger} onAccept={() => answer(true)} onDecline={() => answer(false)} />
    </CustomLayout>
  );
};

export default Lobby;
