import { Exclude, Expose } from 'class-transformer'
import { IsEmail, isEmail, IsString, isString } from 'class-validator'

export class LoginBodyDto {
  @IsEmail() @IsString() email: string
  @IsString() password: string
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString() name: string
  @IsString() confirmPassword: string
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
