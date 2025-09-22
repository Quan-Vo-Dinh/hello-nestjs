import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { UpdatePostBodyDto, UpdatePostDto } from './dto/update-post.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { GetPostDto } from './dto/get-post.dto'
import { CreatePostBodyDto, CreatePostDto } from './dto/create-post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer])
  @Post()
  async create(@Body() body: CreatePostBodyDto, @ActiveUser('userId') userId: number) {
    const result = await this.postsService.createPost(userId, body)
    return new CreatePostDto(result)
  }

  @Auth([AuthType.Bearer])
  @Get()
  async getPosts(@ActiveUser('userId') userId: number) {
    const result = await this.postsService.getPosts(userId)
    return result.map((post) => new GetPostDto(post))
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.postsService.getPost(+id)
    return new GetPostDto(result)
  }

  @Auth([AuthType.Bearer])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    const serviceResult = await this.postsService.updatePost({
      postId: +id,
      userId: userId,
      body: updatePostDto,
    })
    return new UpdatePostDto(serviceResult)
  }

  @Auth([AuthType.Bearer])
  @Delete(':id')
  async remove(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    await this.postsService.deletePost({
      postId: +id,
      userId: userId,
    })
    return { message: 'Post deleted successfully' }
  }
}
