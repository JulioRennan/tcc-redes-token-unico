import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/user/data/user.entity';
import * as jwt from 'jsonwebtoken';
import config from '../../../config';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export function generateAccessToken(payload: UserEntity) {
  const payloadSerializable = instanceToPlain(payload, {
    excludeExtraneousValues: true,
  });

  return jwt.sign(payloadSerializable, config.secret, {
    expiresIn: '1h',
    noTimestamp: false,
  });
}

export function verifyJwt(token: string): UserEntity {
  try {
    const result = jwt.verify(token, config.secret);
    return plainToInstance(UserEntity, result, {
      excludeExtraneousValues: true,
    });
  } catch (error) {
    console.log(error);
    throw new UnauthorizedException();
  }
}
export function generateRefreshToken(payload: UserEntity) {
  return jwt.sign(
    instanceToPlain(payload, { excludeExtraneousValues: true }),
    config.refreshTokenSecret,
  );
}

export function verifyRefreshJwt(token: string): UserEntity {
  try {
    const result = jwt.verify(token, config.refreshTokenSecret);
    return plainToInstance(UserEntity, result, {
      excludeExtraneousValues: true,
    });
  } catch (error) {
    throw new UnauthorizedException();
  }
}

export function generateTokens(user: UserEntity) {
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user);
  return {
    access_token,
    refresh_token,
  };
}
