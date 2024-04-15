import { useGlobalStorage } from '../store';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { player } = useGlobalStorage();

  if (player?.rememberMe) return <Navigate to="/" />;

  return player?.loggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
