import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) { }

  async findOne(id: number) {
    const user = this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user with given id not found');

    return user;
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { username } });
    return user ? false : true;
  }

  async generateFolderName(user: User): Promise<User> {
    const timestamp = Date.now();
    const folderName = `${user.username}_${timestamp}_${user.id}`;
    user.folderName = folderName;
    return this.usersRepo.save(user);
  }


}
