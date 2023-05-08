import { Expose, Type } from "class-transformer";
import { UserDto } from '../../modules/users/dto/user.dto';

export class AuthDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  token: string;
}