import { Controller, Post, Body, HttpCode, Req, Res, Headers, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('/registration')
	@HttpCode(201)
	CreateUser(@Body() dto: CreateUserDto) {
		return this.userService.createUser(dto)
	}

	@Post('/login')
	@HttpCode(200)
	Login(@Body() dto: CreateUserDto) {
		return this.userService.login(dto)
	}

	@Get('/auth')
	@HttpCode(200)
	Auth(@Req() req: Request, @Res() res: Response, @Headers('Authorization') Authorization: string) {
		return this.userService.auth(req, res, Authorization)
	}
  
}