import { Next, UploadedFile } from '@nestjs/common';
import { Model } from 'mongoose';
import { Injectable, Inject, Req, Res } from '@nestjs/common';
import { File, FileDocument } from './schemas/file.schema';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import multer from 'multer';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async createDir(file: File) {
    const filePath = `${this.configService.get('filePath')}/${file.user}/${file.path}`
    return new Promise((res, rej) => {
      try {
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

  async getFiles(req: Request, res: Response) {
    try {
      const files = await this.fileModel.find({user: req.user, parent: req.query.parent || req.user}).exec()
      return res.status(200).json({message:'ok', data: files})
    } catch (err) {
      return res.status(500).json({message:'files db error'})
    }
  }

  async uploadFile(req: Request, res: Response, file: Express.Multer.File): Promise<any> {
    try {
      const {parent} = req.body
      const [user] = await this.userModel.find({_id: req.user}).exec();
      const [parentFolder] = await this.fileModel.find({user: user._id, _id: parent})
      if (user.usedSpace + file.size > user.diskSpace) {
        res.status(400).json({message: 'There no space on the disk'})
      }
      let path=''
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
      if(parent) {
        path = `${this.configService.get('filePath')}/${user._id}/${parentFolder.path}/${file.originalname}`
      } else {
        path = `${this.configService.get('filePath')}/${user._id}/${file.originalname}`
      }
      
      if (fs.existsSync(path)) {
        res.status(400).json({message: 'File already exist'})
      }
      fs.writeFileSync(path, file.buffer, 'utf8')

      const fileType = file.originalname.split('.').pop()
      const dbFile = new this.fileModel({
        name: file.originalname,
        type: fileType,
        size: file.size,
        path: parentFolder?.path,
        parent: parentFolder?._id,
        user: user._id
      })
      const savedfile = await dbFile.save()
      user.usedSpace = user.usedSpace + file.size
      parentFolder.size = parentFolder.size + file.size
      const savedParentFolder = await parentFolder.save()
      const savedUser = await user.save()
      await Promise.all([savedfile,savedParentFolder,savedUser]).catch((err) => {
        res.status(400).json({message: 'ok', data: err})
      })
      res.status(201).json(savedfile)
    } catch(err) {
      res.json({message: 'ok', data: err})
    }
  }

  async download(req: Request, res: Response) {
    try {
      const [file] = await this.fileModel.find({_id: req.query.id}).exec();
      if(!file){
        res.status(404).json({message: 'error', data:{message:'file not found'}})
      }
      const filePath = `${this.configService.get('filePath')}/${req.user}/${file.path}/${file.name}`
      console.log('filePath', filePath)
      if(fs.existsSync(filePath)) {
        return res.download(filePath, file.name)
      }
      res.status(400).json({message: 'error', data:{message:'download error'}})
    } catch (err) {
      res.json({message: 'error', data: err})
    }
  }

  async delete(req: Request, res: Response, id: number) {
    try {
      const [file] = await this.fileModel.find({_id:id, user: req.user}).exec()
      if(!file){
        res.status(404).json({message:'error', data:{message:'file not found'}})
      }
      const path = `${this.configService.get('filePath')}/${req.user}/${file.path}`
      if (file.type === 'dir') {
        fs.rmdirSync(path)
      } else {
          fs.unlinkSync(path)
      }
      const deletedFileId = await this.fileModel.deleteOne({_id: file._id})
      console.log('deletedFileId', deletedFileId)
      res.status(200).json({message: 'ok', data: {id:file._id}})
    } catch (err) {

    }
  }

}