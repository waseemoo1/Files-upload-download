import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule { }
