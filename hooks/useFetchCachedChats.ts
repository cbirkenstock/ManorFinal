import { DataStore } from "aws-amplify";
import { Chat, ChatUser } from "../src/models";
import useAuthContext from "./useAuthContext";

const sortChats = (chat1: Chat, chat2: Chat) => {
  if (chat1.updatedAt && chat2.updatedAt) {
    const chat1Date = new Date(chat1.updatedAt);
    const chat2Date = new Date(chat2.updatedAt);

    if (chat1Date.getTime() > chat2Date.getTime()) {
      return -1;
    } else {
      return 1;
    }
  }

  return 0;
};

const useFetchCachedChats = async () => {
  const { user } = useAuthContext();

  const _chats = (
    await DataStore.query(ChatUser, (chatUser) =>
      chatUser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true)
    )
  )
    .map((chatUser) => {
      return chatUser.chat;
    })
    .sort(sortChats);

  return _chats;
};

export default useFetchCachedChats;
