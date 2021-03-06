import { Model, Connection } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@Inject(ConfigService) private readonly configService: ConfigService,
		private jwtService: JwtService
		) {}

	async createUser(dto: CreateUserDto): Promise<any> {
		try {
			const candidate = await this.userModel.findOne({ email: dto.email }).exec();
			if(candidate) {
				return {
					statusCode: 401,
					message: [`User with email ${dto.email} already exist`]
				}
			} else {
				const saltOrRounds = 8;
				const hashPassword = await bcrypt.hash(dto.password, saltOrRounds);
				const createdUser = new this.userModel({email: dto.email, password: hashPassword});
				return createdUser.save();
			}
		} catch(err) {
			throw new Error(`Database error: ${err}`)
		}
	}

	async login(dto: CreateUserDto): Promise<any> {
		try {
			const user = await this.userModel.findOne({ email: dto.email }).exec();
			if(!user) {
				return {
					statusCode: 404,
					message: [`User not found`]
				}
			} else {
				const isPassValid = bcrypt.compareSync(dto.password,user.password)
				if(!isPassValid) {
					return {
						statusCode: 400,
						message: [`Invalid password`]
					}
				} 
				const token = this.jwtService.sign({id: user.id})
				return {
					token,
					user: {
						id: user.id,
						email: user.email,
						diskSpace: user.diskSpace,
						usedSpace: user.usedSpace,
						avatar: user.avatar
					}
				}
			}
		} catch(err) {
			throw new Error(`Server error: ${err}`)
		}
	}

	async auth(req: Request, res: Response, Authorization: string): Promise<any> {

        try {
            const token = Authorization
            if(!token) {
				res.status(401).json({message:'ok', data: 'Auth error'})
            }
			const decoded = this.jwtService.verify(token, this.configService.get('BEARER_KEY'))
			const user = await this.userModel.findOne({ _id: decoded.id }).exec();
			let result = {
				message: 'ok',
				user: {
					id: user.id,
					email: user.email,
					diskSpace: user.diskSpace,
					usedSpace: user.usedSpace,
					avatar: user.avatar
				}
			}
			res.status(200).json(result)
            
        } catch(err) {
			res.json({message: 'ok', data: err})
        }
	}

}