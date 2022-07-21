import { Model } from 'mongoose';
import { Injectable, Inject, Req, Res } from '@nestjs/common';
import { File, FileDocument } from './schemas/file.schema';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async createDir(file: File) {
    const filePath = `${this.configService.get('filePath')}/${file.user}/${file.path}`
    return new Promise((res, rej) => {
      try {
        console.log('filePath', filePath)
        if(!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
          return res({message:'file was created'})
        } else {
          return rej({message: 'file already exist'})
        }
      } catch(e) {
        return rej({message: 'file error'})
      }
    }) 
  }

  async getFiles(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('user', req.user)
      console.log('parent', req.query.parent || req.user)
      const files = await this.fileModel.find({user: req.user, parent: req.query.parent || req.user}).exec()
      console.log('files', files)
      return res.status(200).json({message:'ok', data: files})
    } catch (err) {
      return res.status(500).json({message:'files db error'})
    }
  }

}