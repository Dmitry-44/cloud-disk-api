import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [],
  providers: [FileService],
})
export class FileModule {}