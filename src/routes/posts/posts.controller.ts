import { REQUEST_USER_KEY } from './../../shared/constants/auth.constant'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { PostsService } from './posts.service'
import { UpdatePostDto } from './dto/update-post.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuardType } from 'src/shared/constants/auth.constant'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import type { Request } from 'express'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer])
  @Post()
  create(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.create(userId, body)
  }

  // @UseGuards(AccessTokenGuard, APIKeyGuard)
  @Auth([AuthType.Bearer, AuthType.ApiKey], { conditions: ConditionGuardType.OR })
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.postsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
