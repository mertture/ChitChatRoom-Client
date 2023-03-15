import Model from '../model';

export default class Room extends Model {
  id!: string
  name!: string
  participants!: Array<string>
}