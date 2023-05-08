import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UploadFilesDto } from './dto/upload-files.dto';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UsersService } from '../users/users.service';
import { existsSync } from 'fs';
import JSZip from 'jszip';

@Injectable()
export class FilesService {
  constructor(private readonly usersService: UsersService) { }

  async uploadFiles(uploadFilesDto: UploadFilesDto, userId: number) {
    let user = await this.usersService.findOne(userId);

    if (!user.folderName) {
      user = await this.usersService.generateFolderName(user);
    }

    return Promise.all(uploadFilesDto.files.map(async file => {
      const timestamp = Date.now();
      const nameWithoutExt = path.parse(file.originalName).name;
      const fileName = `${nameWithoutExt}_${timestamp}.${file.extension}`;
      await this.uploadFile(file, user.folderName, fileName);
      return fileName;
    }));

  }

  async uploadFile(file: MemoryStoredFile, folderName: string, fileName: string): Promise<string> {
    const dest = path.join("./UPLOADS", folderName);
    await fs.mkdir(dest, { recursive: true });

    const filePath = path.join(dest, fileName);
    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }

  async generateZipFileStream(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user.folderName) {
      throw new BadRequestException('no folder specified for this user.');
    }

    const dest = path.join("./UPLOADS", user.folderName);

    const zip = new JSZip();

    const files = await fs.readdir(dest);

    for (const file of files) {
      const filePath = path.join(dest, file);
      const fileData = await fs.readFile(filePath);
      zip.file(file, fileData);
    }
    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
  }

  async getFile(fileName: string, userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user.folderName) {
      throw new NotFoundException('file not found');
    }

    const filePath = path.join("./UPLOADS", user.folderName, fileName);

    const isExists = existsSync(filePath);
    if (!isExists) {
      throw new NotFoundException('file not found');
    }

    return filePath;
  }




  async listAll(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user.folderName) {
      return [];
    }

    const dest = path.join("./UPLOADS", user.folderName);
    const files = await fs.readdir(dest);

    const result: { name: string, size: number }[] = [];

    for (const file of files) {
      const filePath = path.join(dest, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        result.push({ name: file, size: stats.size });
      }
    }

    return result;
  }
}
