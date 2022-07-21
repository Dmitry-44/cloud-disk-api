import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from 'src/files/file.module';
import { File, FileSchema } from 'src/files/schemas/file.schema';

@Module({
	imports: [
		ConfigModule, 
		FileModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('BEARER_KEY'),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [UserController],
	providers: [
		UserService,
	],
	exports: [UserService]
})
export class UserModule {
	constructor(private configService: ConfigService) {}
}