import { UserModule } from './../users/user.module';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { UserService } from "src/users/user.service";


@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('BEARER_KEY'),
			}),
			inject: [ConfigService],
		}),
    ],
    controllers: [],
    providers: [AuthMiddleware],
})
export class AuthModule {
    constructor(private configService: ConfigService) {}
}