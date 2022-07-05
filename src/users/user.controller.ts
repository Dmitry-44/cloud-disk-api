import { Controller, Post, Body, HttpCode } from '@nestjs/common';
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
  
}