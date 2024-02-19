import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useLocalStorage(
    E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    null,
  );

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem(E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(E_LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(E_LOCAL_STORAGE_KEYS.SETTINGS);
  };

  return {
    accessToken,
    logout,
  };
};
