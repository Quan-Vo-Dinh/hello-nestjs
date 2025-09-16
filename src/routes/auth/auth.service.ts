import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDto, LoginResDto, RegisterResDto } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async register(RegisterBodyDto: any) {
    try {
      const hashedPassword = await this.hashingService.hash(RegisterBodyDto.password)
      const user = await this.prismaService.user.create({
        data: {
          email: RegisterBodyDto.email,
          name: RegisterBodyDto.name,
          password: hashedPassword,
        },
      })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('User with this email already exists')
      }
      throw error
    }
  }

  async login(loginBodyDto: LoginBodyDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginBodyDto.email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = await this.hashingService.compare(loginBodyDto.password, user.password)

    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        field: 'password',
        error: 'Invalid password',
      })
    }
    return this.generateTokens({ userId: user.id.toString() })
  }

  async generateTokens(payload: { userId: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: parseInt(payload.userId),
        expiresAt: new Date(decodedRefreshToken.exp * 1000), // Convert exp to milliseconds
      },
    })

    return { accessToken, refreshToken }
  }
}
