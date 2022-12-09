import { HttpException, HttpStatus } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { firestore } from 'firebase-admin';
import { CreateUserDTO } from '../dtos/create_user.dto';
import { UserEntity } from './user.entity';
import { differenceInSeconds } from 'date-fns';
export class UserRepository {
  private db = firestore();

  async createUser(dto: CreateUserDTO): Promise<UserEntity> {
    const userDocRef = this.db.collection('user').doc();
    const userPlained = {
      id: userDocRef.id,
      ...instanceToPlain(dto),
    };
    await userDocRef.set(userPlained);
    return plainToInstance(UserEntity, userPlained);
  }

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    const result = await this.db
      .collection('user')
      .where('email', '==', email)
      .get();
    if (result.docs.length) {
      return plainToInstance(UserEntity, result.docs[0].data(), {
        excludeExtraneousValues: true,
      });
    }
  }
  async findUserById(userId: string): Promise<UserEntity | undefined> {
    const result = await this.db.collection('user').doc(userId).get();
    return result.data() as UserEntity | undefined;
  }
  async checkIfTokenWasUsed(userId: string, currentTimestamp: number) {
    if (currentTimestamp > Date.now()) return false;

    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    const timeStamps = user.array_timestamps ?? [];

    const isFinded =
      timeStamps.find((value) => value == currentTimestamp) != undefined;
    if (!isFinded) {
      timeStamps.push(currentTimestamp);
      const timeStampToUpdate = timeStamps.filter(
        (value) => differenceInSeconds(Date.now(), value) < 80,
      );
      this.db
        .collection('user')
        .doc(userId)
        .update({ array_timestamps: timeStampToUpdate });
    }
    return isFinded;
  }
}
