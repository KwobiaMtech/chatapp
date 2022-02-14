import { IUser } from './iuser';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
