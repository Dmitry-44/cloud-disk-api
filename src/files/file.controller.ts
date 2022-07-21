import { InjectModel } from '@nestjs/mongoose';
import { Body, Controller, Get, Inject, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { FileService } from "./file.service";
import { File, FileDocument } from "./schemas/file.schema";
import { Model } from 'mongoose';
import { createFileDto } from 'src/types/file.types';



@Controller('files')
export class FileController {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private fileService: FileService,
        ){}

    @Post()
    async createDir(@Req() req: Request, @Res() res: Response, @Body() dto: createFileDto){
        const name = dto.name
        const type = dto.type
        const parent = dto.parent || req.user
        const user = new this.userModel({_id: req.user});
        const file = new this.fileModel({name, type, parent})
        file.user=user
        const parentFile = await this.fileModel.findOne({_id: parent})
        if(!parentFile) {
            file.path=name
            await this.fileService.createDir(file)
        } else {
            file.path = `${parentFile.path}/${file.name}`
            await this.fileService.createDir(file)
            parentFile.childs.push(file._id)
            await parentFile.save()
        }
        await file.save()
        res.status(201).json({message:'ok', data: file})
    }

    @Get()
    async getFiles(@Req() req: Request, @Res() res: Response){
        return this.fileService.getFiles(req,res)
    }

}