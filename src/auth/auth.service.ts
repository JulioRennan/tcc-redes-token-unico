import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  generateAccessToken,
  generateTokens,
  verifyRefreshJwt,
} from 'src/shared/utils/jwt';
import { UserRepository } from 'src/user/data/user.repository';
import { SignInDTO } from './dtos/sign_in.dto';
import { AES } from 'crypto-js';
@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async signIn(dto: SignInDTO) {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }
    if (dto.password != dto.password) {
      throw new HttpException('Credenciais incorretas', HttpStatus.BAD_REQUEST);
    }
    return { ...generateTokens(user), user };
  }
  async generateNewAccessToken(refreshToken: string) {
    const user = verifyRefreshJwt(refreshToken);
    const access_token = generateAccessToken(user);
    console.log(access_token);
    return {
      access_token,
    };
  }

  async generateNewAccessTokenNewProcol(access_token: string) {
    const now = Date.now();
    const criptoKey = 'BATATINHA QUANDO NASCE';
    const result = AES.encrypt(now.toString(), criptoKey).toString();
    return {
      valor_original: now,
      token: `${access_token}.${btoa(result)}`,
    };
  }
}
