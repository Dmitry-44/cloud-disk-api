import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule, 
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('BEARER_KEY'),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {
	constructor(private configService: ConfigService) {}
}