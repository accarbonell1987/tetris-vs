import { useQuery } from '@tanstack/react-query';
import { fetchRandomAvatars } from '../../services/api/servicesAvatars';

const useFetchAvatars = () => {
  const { data, error, isPending, isLoading } = useQuery({
    queryKey: ['fetchRandomAvatars'],
    queryFn: async () => await fetchRandomAvatars({ ammount: 4 })
  });

  return { data, error, isLoading, isPending };
};

export default useFetchAvatars;
