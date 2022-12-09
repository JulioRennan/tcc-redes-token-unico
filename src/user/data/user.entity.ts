import { Expose } from 'class-transformer';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  array_timestamps: number[] | undefined;
}
