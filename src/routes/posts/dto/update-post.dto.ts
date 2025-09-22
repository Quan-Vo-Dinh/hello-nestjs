import { PartialType } from '@nestjs/mapped-types'
import { CreatePostBodyDto, CreatePostDto } from './create-post.dto'

export class UpdatePostBodyDto extends PartialType(CreatePostBodyDto) {}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  constructor(partial: Partial<UpdatePostDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
