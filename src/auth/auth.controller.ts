import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenDTO } from './dtos/access_token.dto';
import { AccessTokenNewProtocolDTO } from './dtos/access_token_new_protocol.dto';
import { SignInDTO } from './dtos/sign_in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-in')
  async signIn(@Body() dto: SignInDTO) {
    return this.authService.signIn(dto);
  }
  @Post('access-token')
  async generateNewAccessToken(@Body() { refresh_token }: AccessTokenDTO) {
    return this.authService.generateNewAccessToken(refresh_token);
  }

  @Post('access-token-new-protocol')
  async generateNewAccessTokenNewProcol(
    @Body() { access_token }: AccessTokenNewProtocolDTO,
  ) {
    return this.authService.generateNewAccessTokenNewProcol(access_token);
  }
}
