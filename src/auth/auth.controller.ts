import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('auth')
@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiCreatedResponse({ type: AuthDto })
  @Post('/signup')
  create(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOkResponse({ type: AuthDto })
  @Post('/signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

}
