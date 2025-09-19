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

    // Use transaction to ensure atomic operation
    await this.prismaService.$transaction(async (prisma) => {
      // Delete any existing refresh tokens for this user to prevent accumulation
      await prisma.refreshToken.deleteMany({
        where: { userId: parseInt(payload.userId) },
      })

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: parseInt(payload.userId),
          expiresAt: new Date(decodedRefreshToken.exp * 1000),
        },
      })
    })

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      const storedToken = await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      })

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired')
      }

      // Generate new tokens
      const newTokens = await this.generateTokens({ userId: userId.toString() })

      // Delete old refresh token after successfully creating new ones
      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      })

      return newTokens
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
