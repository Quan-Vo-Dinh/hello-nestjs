import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common'
import { CreatePostBodyDto } from './dto/create-post.dto'
import { UpdatePostBodyDto } from './dto/update-post.dto'
import { PrismaService } from 'src/shared/services/prisma.service'
import { isRecordNotFoundError, isUniqueConstraintError } from 'src/shared/helpers'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPosts(userId: number) {
    try {
      return await this.prismaService.post.findMany({
        where: { authorId: userId },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch {
      throw new InternalServerErrorException('Failed to retrieve posts')
    }
  }

  async createPost(userId: number, body: CreatePostBodyDto) {
    try {
      return await this.prismaService.post.create({
        data: {
          title: body.title,
          content: body.content,
          authorId: Number(userId),
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ForbiddenException('Post with this title already exists')
      }
      throw new InternalServerErrorException('Failed to create post')
    }
  }

  async getPost(postId: number) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: { id: postId },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException(`Post with ID ${postId} not found`)
      }
      throw new InternalServerErrorException('Failed to retrieve post')
    }
  }

  async findAll() {
    try {
      return await this.prismaService.post.findMany({
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch {
      throw new InternalServerErrorException('Failed to retrieve all posts')
    }
  }

  async updatePost({ postId, userId, body }: { postId: number; userId: number; body: UpdatePostBodyDto }) {
    try {
      return await this.prismaService.post.update({
        where: {
          id: postId,
          authorId: userId, // Chỉ cho phép cập nhật post của chính user đó
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        // Kiểm tra xem post có tồn tại không
        const postExists = await this.prismaService.post.findUnique({
          where: { id: postId },
          select: { id: true, authorId: true },
        })

        if (!postExists) {
          throw new NotFoundException(`Post with ID ${postId} not found`)
        }

        if (postExists.authorId !== userId) {
          throw new ForbiddenException('You can only update your own posts')
        }
      }

      throw error
    }
  }

  async deletePost({ postId, userId }: { postId: number; userId: number }) {
    try {
      return await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId, // Chỉ cho phép xóa post của chính user đó
        },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        // Kiểm tra xem post có tồn tại không
        const postExists = await this.prismaService.post.findUnique({
          where: { id: postId },
          select: { id: true, authorId: true },
        })

        if (!postExists) {
          throw new NotFoundException(`Post with ID ${postId} not found`)
        }

        if (postExists.authorId !== userId) {
          throw new ForbiddenException('You can only delete your own posts')
        }
      }

      throw new InternalServerErrorException('Failed to delete post')
    }
  }
}
