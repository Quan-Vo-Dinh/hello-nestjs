import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto, RegisterResDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDto })
  @Post('register')
  register(@Body() body: RegisterBodyDto): Promise<any> {
    console.log(body)
    return this.authService.register(body)
  }
}
