import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useLocalStorage(
    E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    null,
  );

  return {
    accessToken,
  };
};
