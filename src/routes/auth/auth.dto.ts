import { Exclude, Expose } from 'class-transformer'
import { IsEmail, isEmail, IsString, isString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDto {
  @IsEmail() @IsString() email: string
  @IsString() @Length(6, 20) password: string
}

export class LoginResDto {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDto>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString() name: string
  @IsString() @Match('password') confirmPassword: string
}

export class RegisterResDto {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  @Exclude() password: string

  // @Expose() get emailName(): string {
  //   return `${this.name} <${this.email}>`
  // }

  constructor(partial: Partial<RegisterResDto>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDto {
  @IsString() refreshToken: string
}

export class RefreshTokenResDto extends LoginResDto {}
