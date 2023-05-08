import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert, AfterLoad } from 'typeorm'
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'folder_name', nullable: true })
  folderName: string;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(this.password, salt, 32)) as Buffer;
      this.password = `${salt}.${hash.toString('hex')}`;
    }
  }

}