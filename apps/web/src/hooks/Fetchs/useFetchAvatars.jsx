import { useQuery } from '@tanstack/react-query';
import { fetchRandomAvatars } from '../../services/api/servicesAvatars';

const amountAvatarsToLoad = 8;

const useFetchAvatars = () => {
  const { data, error, isPending, isLoading } = useQuery({
    queryKey: ['fetchRandomAvatars'],
    queryFn: async () => await fetchRandomAvatars(amountAvatarsToLoad)
  });

  return { data, error, isLoading, isPending };
};

export default useFetchAvatars;
