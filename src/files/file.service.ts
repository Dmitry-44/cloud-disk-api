import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { File } from './schemas/file.schema';

@Injectable()
export class FileService {
  constructor(
    @Inject('FILE_MODEL')
    private fileModel: Model<File>,
  ) {}

}