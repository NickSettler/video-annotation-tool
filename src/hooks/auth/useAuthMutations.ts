import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  AuthService,
  TAuthLoginMutationVariables,
  TAuthLoginResponse,
  TAuthRegisterMutationVariables,
} from '../../api/auth/auth.service';
import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import toast from 'react-hot-toast';
import { TApiError } from '../../api/base/types';

export type TUseAuthMutations = {
  loginMutation: UseMutationResult<
    TAuthLoginResponse,
    TApiError,
    TAuthLoginMutationVariables
  >;
  registerMutation: UseMutationResult<
    TAuthLoginResponse,
    TApiError,
    TAuthRegisterMutationVariables
  >;
};

export const useAuthMutations = (): TUseAuthMutations => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    null,
  );

  const loginMutation = useMutation<
    TAuthLoginResponse,
    TApiError,
    TAuthLoginMutationVariables
  >({
    mutationFn: async ({ username, password }: TAuthLoginMutationVariables) =>
      AuthService.signIn(username, password),
    onSuccess: async ({ accessToken: responseAccessToken }) => {
      setAccessToken(responseAccessToken);
    },
    onError: async () => {
      toast.error('Failed to login');
    },
  });

  const registerMutation = useMutation<
    TAuthLoginResponse,
    TApiError,
    TAuthRegisterMutationVariables
  >({
    mutationFn: async ({
      email,
      username,
      password,
    }: TAuthRegisterMutationVariables) =>
      AuthService.signUp(email, username, password),
    onSuccess: async ({ accessToken: responseAccessToken }) => {
      setAccessToken(responseAccessToken);
    },
    onError: async () => {
      toast.error('Failed to register');
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};
