import {User} from './user';

export type UserInfo = {
  idToken: string | null;
  scopes?: string[];
  serverAuthCode: string | null;
  user: User;
};
