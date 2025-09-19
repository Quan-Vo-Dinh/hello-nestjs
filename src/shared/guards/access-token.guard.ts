import { TokenService } from './../services/token.service'
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly TokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra xem route có được đánh dấu là public không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const accessToken = request.headers['authorization']?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException()
    }
    try {
      const decodedAccessToken = await this.TokenService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodedAccessToken
      return true
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
