import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody } from '@nextui-org/react';
import PlayerCard from './components/PlayerCard';
import { CustomLayout } from '../../components';
import { useGlobalStorage } from '../../store';

const Lobby = () => {
  // Socket messages (lobby list, invites, match-start) are handled app-wide by AppShell.
  const { player, players, socket, notice, setNotice } = useGlobalStorage();
  const navigate = useNavigate();

  const challenge = target => {
    socket?.emit('challenge-send', { to: target.id });
    setNotice(`Desafío enviado a ${target.name}`);
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
    </CustomLayout>
  );
};

export default Lobby;
