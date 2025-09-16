import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, LoginResDto, RegisterBodyDto, RegisterResDto } from './auth.dto'

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
}
