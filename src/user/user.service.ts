import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create_user.dto';
import { UserRepository } from './data/user.repository';
import { generateTokens } from 'src/shared/utils/jwt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async createUser(dto: CreateUserDTO) {
    const userFinded = await this.userRepository.findUserByEmail(dto.email);
    if (userFinded) {
      throw new HttpException(
        'esse email ja foi utilizado',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.createUser(dto);

    return generateTokens(user);
  }
}
