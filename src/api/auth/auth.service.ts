import { BaseService } from '../base/service';
import { E_USER_ENTITY_KEYS, TApiUser, TUser } from '../user/types';
import Api from '../base/api';

export type TAuthLoginMutationVariables = {
  [E_USER_ENTITY_KEYS.USERNAME]: TApiUser[E_USER_ENTITY_KEYS.USERNAME];
  [E_USER_ENTITY_KEYS.PASSWORD]: TUser[E_USER_ENTITY_KEYS.PASSWORD];
};

export type TAuthRegisterMutationVariables = TAuthLoginMutationVariables & {
  [E_USER_ENTITY_KEYS.EMAIL]: TApiUser[E_USER_ENTITY_KEYS.EMAIL];
};

export type TAuthLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export class AuthService extends BaseService {
  protected static readonly endpoint = '/auth';

  public static async signIn(
    usernameOrEmail: TApiUser[E_USER_ENTITY_KEYS.USERNAME],
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthLoginMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-in`, {
      [E_USER_ENTITY_KEYS.USERNAME]: usernameOrEmail,
      [E_USER_ENTITY_KEYS.PASSWORD]: password,
    });
  }

  public static async signUp(
    email: TApiUser[E_USER_ENTITY_KEYS.EMAIL],
    username: TApiUser[E_USER_ENTITY_KEYS.USERNAME],
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthRegisterMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-up`, {
      [E_USER_ENTITY_KEYS.EMAIL]: email,
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.PASSWORD]: password,
    });
  }
}
