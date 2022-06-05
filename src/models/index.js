// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Chat, Message, ChatUser, User, ChatUserMessage } = initSchema(schema);

export {
  Chat,
  Message,
  ChatUser,
  User,
  ChatUserMessage
};