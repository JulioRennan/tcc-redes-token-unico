import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create_user.dto';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    const data = await this.userService.createUser(dto);
    return { message: 'Usuário criado com sucesso!', data };
  }

  @Post('action')
  async makeAction(@Req() req: Request) {
    return { message: `Usuário ${req.user.email} fez uma ação` };
  }

  @Post('action-new-protocol')
  async makeActionWithNewProtocol(@Req() req: Request) {
    return { message: `Usuário ${req.user?.email} fez uma ação` };
  }
}
