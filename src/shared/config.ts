import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import * as fs from 'fs'
import path from 'path'

if (!fs.existsSync(path.resolve('.env'))) {
  console.warn('.env file does not exist. Please create one based on .env.example')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRATION: string
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string
}

// Note: dùng class-transformer để convert plain object to class instance
// https://github.com/typestack/class-transformer?tab=readme-ov-file#plaintoinstance
const configServer = plainToInstance(ConfigSchema, process.env)

// Note: dùng class-validator để validate class instance
// https://github.com/typestack/class-validator?tab=readme-ov-file#validation
const errorsArray = validateSync(configServer)

// Nếu có lỗi thì in ra và thoát luôn
if (errorsArray.length > 0) {
  console.error('❌  Invalid configuration', errorsArray)
  const errors = errorsArray.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      values: eItem.value,
    }
  })
  throw errors
}

const envConfig = configServer

export { envConfig }
