import { IsNotEmpty, IsString } from 'class-validator'
import Model from '../model'
export default class CreateRoomReqBody extends Model {
  @IsString()
  name!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}