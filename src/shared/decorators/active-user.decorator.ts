import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from '../types/jwt.type'
import { REQUEST_USER_KEY } from '../constants/auth.constant'

export const ActiveUser = createParamDecorator((field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: TokenPayload | undefined = request[REQUEST_USER_KEY]
  console.log('type of user id:', typeof user?.userId)
  console.log('type of request user id:', typeof request[REQUEST_USER_KEY]?.userId)
  if (!user) return null
  return field ? user[field] : user
})
