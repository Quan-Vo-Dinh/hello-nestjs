import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async register(registerDto: any): Promise<any> {
    try {
      const hashedPassword = await this.hashingService.hash(registerDto.password)
      const user = await this.prismaService.user.create({
        data: {
          ...registerDto,
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
}
