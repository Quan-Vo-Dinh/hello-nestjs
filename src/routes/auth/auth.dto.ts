import { IsEmail, isEmail, IsString, isString } from 'class-validator'

export class LoginBodyDto {
  @IsEmail() @IsString() email: string
  @IsString() password: string
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString() name: string
  @IsString() confirmPassword: string
}
