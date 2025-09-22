import { Type } from 'class-transformer'
import { PostModel } from 'src/shared/models/post.model'
import { UserModel } from 'src/shared/models/user.model'

export class GetPostDto extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>

  constructor(partial: Partial<GetPostDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
