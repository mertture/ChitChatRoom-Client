import { Route } from '../constants/constants'
import User from '../models/user/user'

export const authRoutes: string[] = [Route.Login, Route.ForgotPassword]

export const allWelcomeRoutes: string[] = [Route.ResetPassword]

export async function checkAuthentication(
  path: string,
  token?: string
): Promise<User> {
  try {
    if (!token) throw new Error('no token')
    console.log("TOKEN:", token);
    const user = await (
      await fetch(
        new URL(
          ('http://localhost:8080') +
            '/api/user/me'
        ).href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).json() as User
    console.log("USER:", user);
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
