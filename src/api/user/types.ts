export enum E_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum E_ROLE_ENTITY_KEYS {
  NAME = 'name',
}

export type TUserRole = {
  [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE;
};

export enum E_USER_ENTITY_KEYS {
  ID = 'id',
  EMAIL = 'email',
  USERNAME = 'username',
  PASSWORD = 'password',
  ROLES = 'roles',
}

export type TApiUser = {
  [E_USER_ENTITY_KEYS.ID]: string;
  [E_USER_ENTITY_KEYS.EMAIL]: string;
  [E_USER_ENTITY_KEYS.USERNAME]: string;
};

export type TUser = TApiUser & {
  [E_USER_ENTITY_KEYS.PASSWORD]: string;
};

export type TApiUserWithRoles = TApiUser & {
  [E_USER_ENTITY_KEYS.ROLES]: Array<TUserRole>;
};
