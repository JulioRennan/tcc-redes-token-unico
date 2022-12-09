import { UserEntity } from 'src/user/data/user.entity';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity;
    }
  }
}
