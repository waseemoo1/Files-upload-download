import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto) {
    const isUsernameUnique = await this.usersService.isUsernameUnique(signupDto.username);
    if (!isUsernameUnique) {
      throw new BadRequestException("username already in use.");
    }

    let user = this.usersRepo.create(signupDto);

    user = await this.usersRepo.save(user);

    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  async signin({ username, password }: SigninDto) {
    const user = await this.usersRepo.findOneBy({ username });
    if (!user) {
      throw new NotFoundException("Incorrect username or password.");
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException("Incorrect username or password.")
    }

    const token = this.generateToken(user.id);

    return {
      user,
      token
    };

  }

  generateToken(userId: number) {
    return this.jwtService.sign({
      id: userId
    })
  }
}
