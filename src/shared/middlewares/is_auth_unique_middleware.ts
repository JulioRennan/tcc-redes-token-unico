import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { AES, enc } from 'crypto-js';
import { UserRepository } from 'src/user/data/user.repository';
import { verifyJwt } from '../utils/jwt';

@Injectable()
export class IsAuthUniqueMiddleware implements NestMiddleware {
  constructor(private userRepository: UserRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(' ').length > 1) {
      const [_, token] = authorization.split(' ');
      try {
        const valuesJWT = token.split('.');
        const criptoKey = 'CHAVE DE 256 BITS DA DESCRIPTOGRAFAR';
        const base64Encripted = valuesJWT.pop();
        const tokenTimeStamp = AES.decrypt(
          atob(base64Encripted),
          criptoKey,
        ).toString(enc.Utf8);
        const access_token = valuesJWT.join('.');
        const user = verifyJwt(access_token);
        const isFinded = await this.userRepository.checkIfTokenWasUsed(
          user.id,
          Number.parseInt(tokenTimeStamp),
        );
        if (isFinded) {
          throw new UnauthorizedException();
        } else {
          req.user = user;
          return next();
        }
      } catch (e) {}
    }
    throw new UnauthorizedException();
  }
}
