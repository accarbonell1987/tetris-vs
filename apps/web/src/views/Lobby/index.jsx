import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody } from '@nextui-org/react';
import PlayerCard from './components/PlayerCard';
import { CustomLayout } from '../../components';
import { useGlobalStorage } from '../../store';
import { SocketService } from '../../services/socketService';
import { StorageService } from '../../services/localStorageService';

const Lobby = () => {
  const { player, players, socket, setPlayers } = useGlobalStorage();
  const navigate = useNavigate();

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

    const handleLobbyUpdate = (players) => {
      setPlayers(players);
    };

    socket.on('lobby-update', handleLobbyUpdate);

    return () => {
      socket.off('lobby-update', handleLobbyUpdate);
    };
  }, [socket, setPlayers]);

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
          <div className="flex flex-col gap-3">
            {players.map((player, index) => (
              <PlayerCard key={`PlayerCard-${player.id || index}`} name={player.name} avatar={player.image} />
            ))}
          </div>
        </CardBody>
      </Card>
    </CustomLayout>
  );
};

export default Lobby;
