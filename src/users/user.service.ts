import { Model, Connection } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectConnection() private connection: Connection
		) {}

	async createUser(dto: CreateUserDto): Promise<any> {
		try {
			const candidate = await this.userModel.findOne({ email: dto.email }).exec();
			if(candidate) {
				throw new Error(`User with email ${dto.email} already exist`)
			} else {
				const saltOrRounds = 10;
				const hashPassword = await bcrypt.hash(dto.password, saltOrRounds);
				console.log('hashPassword', hashPassword)
				const createdUser = new this.userModel({email: dto.email, password: hashPassword});
				return createdUser.save();
			}
		} catch(err) {
			throw new Error(`Database error: ${err}`)
		}
	}

}