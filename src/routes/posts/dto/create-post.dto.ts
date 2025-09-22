import { IsString } from 'class-validator'
import { GetPostDto } from './get-post.dto'

export class CreatePostBodyDto {
  @IsString() title: string
  @IsString() content: string
}

export class CreatePostDto extends GetPostDto {
  constructor(partial: Partial<CreatePostDto>) {
    super(partial)
  }
}
