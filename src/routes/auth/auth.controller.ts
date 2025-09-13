import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDto): Promise<any> {
    console.log(body)
    return 'register'
    // return await this.authService.register(body)
  }
}
