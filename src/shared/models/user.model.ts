import { Exclude } from 'class-transformer'

export class UserModel {
  id: number
  email: string
  @Exclude() password?: string // Make optional to handle omitted password from Prisma
  name: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}
