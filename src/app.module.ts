import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { PostsModule } from './routes/posts/posts.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { AccessTokenGuard } from './shared/guards/access-token.guard'

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
