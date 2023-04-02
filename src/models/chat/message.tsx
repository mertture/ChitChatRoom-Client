import Model from '../model';

export default class Message extends Model {
  id?: string
  sender!: {
    id: string
    email: string
  }
  content!: string
  createdAt!: number
}

export const formatMessage = (senderId: string, senderEmail: string, content: string, createdAt: number ): Message => {
    return {
        sender: {
            id: senderId,
            email: senderEmail
        },
        content,
        createdAt
    };
}