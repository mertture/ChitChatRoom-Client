import Model from '../model';

enum UserRole {
    USER = 1,
    ADMIN = 2,
    SUPER_USER = 3,
}

export default class User extends Model {
  name!: string
  id!: string
  role!: UserRole
  email!: string
}
