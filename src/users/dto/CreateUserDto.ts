import {
    IsEmail,
    Min,
    Max,
    Length
  } from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    readonly email: string;

    @Length(6,32)
    readonly password: string;
}