// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Chat, User, ChatUser, Message, PendingAnnouncement, Reaction, Report } = initSchema(schema);

export {
  Chat,
  User,
  ChatUser,
  Message,
  PendingAnnouncement,
  Reaction,
  Report
};