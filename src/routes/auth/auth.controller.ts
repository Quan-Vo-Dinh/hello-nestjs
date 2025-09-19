import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDto,
  LoginResDto,
  RefreshTokenBodyDto,
  RefreshTokenResDto,
  RegisterBodyDto,
  RegisterResDto,
} from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDto })
  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    const result = await this.authService.register(body)
    return new RegisterResDto(result)
  }

  @SerializeOptions({ type: LoginResDto })
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    const result = await this.authService.login(body)
    return new LoginResDto(result)
  }

  @SerializeOptions({ type: RefreshTokenResDto })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDto) {
    const result = await this.authService.refreshToken(body.refreshToken)
    return new RefreshTokenResDto(result)
  }
}
