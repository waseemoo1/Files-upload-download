import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Serialize(UserDto)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    summary: 'Current user',
    description: 'Get the current login user',
  })
  @ApiOkResponse({ type: UserDto })
  @Get('whoami')
  whoAmI(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.id);
  }
}
