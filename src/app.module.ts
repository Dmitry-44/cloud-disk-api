import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './files/file.module';


@Module({
  imports: [
	  	AuthModule,
		ConfigModule.forRoot(), 
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
			  uri: configService.get<string>('MONGODB_URI'),
			}),
			inject: [ConfigService],
		  }),
		ConfigModule,
        JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('BEARER_KEY'),
			}),
			inject: [ConfigService],
		}),
		UserModule,
		FileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(AuthMiddleware)
		.exclude(
			{ path: '/users/registration', method: RequestMethod.POST },
			{ path: '/users/auth', method: RequestMethod.GET },
			{ path: '/users/login', method: RequestMethod.POST },
		)
		.forRoutes('/')
	}
}
