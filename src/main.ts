import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { TransformInterceptor } from './shared/interceptor/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ props không có decorator trong DTO
      forbidNonWhitelisted: true, // ném lỗi nếu có props không có decorator trong DTO
      transform: true, // tự động chuyển đổi kiểu dữ liệu thành instance của class DTO
      transformOptions: { enableImplicitConversion: true }, // cho phép chuyển đổi kiểu dữ liệu mà không cần dùng decorator
      exceptionFactory: (validationErrors: ValidationError[]) => {
        console.log(validationErrors)
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}).join(', '),
          })),
        )
      },
    }),
  )
  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
