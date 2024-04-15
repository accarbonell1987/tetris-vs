import { StorageService } from '../services/localStorageService';
import { useGlobalStorage } from '../store';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const storageValue = StorageService.getItem('tetris');

  const { player } = useGlobalStorage();

  const { user } = storageValue;

  if (player?.rememberMe) return <Navigate to="/" />;

  return player?.loggedIn || user.loggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
