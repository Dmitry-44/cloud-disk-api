import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './users/user.module';


@Module({
  imports: [
		ConfigModule.forRoot(), 
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
			  uri: configService.get<string>('MONGODB_URI'),
			}),
			inject: [ConfigService],
		  }),
		UserModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
