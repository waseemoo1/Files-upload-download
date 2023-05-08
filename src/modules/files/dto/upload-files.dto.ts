import { ApiProperty } from "@nestjs/swagger";
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class UploadFilesDto {

  @ApiProperty({
    name: 'files[]',
    description: 'Array of files',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  @IsFiles()
  @MaxFileSize(1024 * 1024 * 5, { each: true })
  @HasMimeType([
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/jpeg',
    'image/png'
  ],
    { each: true })
  files: MemoryStoredFile[];
}