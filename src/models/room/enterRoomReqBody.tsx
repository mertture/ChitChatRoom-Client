import { IsNotEmpty, IsString } from 'class-validator'
import Model from '../model'
export default class EnterRoomReqBody extends Model {
  @IsString()
  @IsNotEmpty()
  password!: string
}