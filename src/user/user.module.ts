import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './data/user.repository';
import { NestModule } from '@nestjs/common';
import { IsAuthMiddleware } from 'src/shared/middlewares/is_auth_middleware';
import { IsAuthUniqueMiddleware } from 'src/shared/middlewares/is_auth_unique_middleware';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthMiddleware)
      .forRoutes({ path: 'user/action', method: RequestMethod.POST });

    consumer.apply(IsAuthUniqueMiddleware).forRoutes({
      path: 'user/action-new-protocol',
      method: RequestMethod.POST,
    });
  }
}
