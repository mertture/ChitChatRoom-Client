import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import Model from '../model'
export default class LoginRegisterReqBody extends Model {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}