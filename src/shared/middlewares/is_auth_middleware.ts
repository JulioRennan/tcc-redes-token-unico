import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from 'src/user/data/user.entity';
import { UserRepository } from 'src/user/data/user.repository';
import { verifyJwt } from '../utils/jwt';

@Injectable()
export class IsAuthMiddleware implements NestMiddleware {
  constructor(private userRepository: UserRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(' ').length > 1) {
      const [_, token] = authorization.split(' ');
      try {
        const result = verifyJwt(token);
        req.user = await this.userRepository.findUserById(result.id);
        return next();
      } catch (e) {}
    }
    throw new UnauthorizedException();
  }
}
