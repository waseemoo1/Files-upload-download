import { Controller, Get, Post, Body, Param, UseGuards, Response } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { UploadFilesDto } from './dto/upload-files.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Response as ExpressResponse } from "express";
import { basename } from 'path';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  create(@Body() uploadFilesDto: UploadFilesDto, @CurrentUser() user: JwtPayload) {
    return this.filesService.uploadFiles(uploadFilesDto, user.id);
  }

  @ApiOperation({
    summary: 'List all user files',
    description: 'list all files with their sizes (in bytes).',
  })
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.filesService.listAll(user.id);
  }


  @ApiOperation({
    summary: 'Download user file as zip file'
  })
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces(
    'application/zip'
  )
  @Get('/download')
  async downloadUserFolder(
    @Response() res: ExpressResponse,
    @CurrentUser() user: JwtPayload
  ) {
    const stream = await this.filesService.generateZipFileStream(user.id);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=user-files.zip');

    stream.pipe(res);
  }

  @ApiOperation({
    summary: 'Download single file'
  })
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/jpeg',
    'image/png'
  )
  @Get('/download/:fileName')
  async download(
    @Param('fileName') fileName: string,
    @Response() res: ExpressResponse,
    @CurrentUser() user: JwtPayload
  ) {
    const filePath = await this.filesService.getFile(fileName, user.id);
    const attachmentName = basename(filePath);

    res.download(filePath, attachmentName);
  }
}
