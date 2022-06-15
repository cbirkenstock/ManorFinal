import { DataStore } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { ChatUser, Message } from "../src/models";

export const messageSubscription = (
  context: AppInitialStateProps,
  handler: (message: Message, context: AppInitialStateProps) => void
) => {
  const { chat, chatUser } = context;

  const subscription = DataStore.observe(Message, (message) =>
    message.chatID("eq", chat?.id ?? "")
  ).subscribe((object) => {
    const message = object.element;
    const isMe = message.chatuserID === chatUser?.id;

    if (object.model === Message && object.opType === "INSERT" && !isMe) {
      handler(message, context);
    }
  });

  return subscription;
};
