import { DataStore } from "aws-amplify";
import { Chat, ChatUser } from "../src/models";
import useAuthContext from "./useAuthContext";

/*kinda a hack rn -- not sure why update getting called several times
and also called after INSERT */
const chatsIncludeSpecificChat = (chats: Chat[], specificChat: Chat) => {
  return chats.map((chat) => chat.id).includes(specificChat.id);
};

const prependChat = (newChat: Chat, chats: Chat[]) => {
  return [
    newChat,
    ...chats.filter((chat) => chat.title !== "Header_Trojan_Horse"),
  ];
};

const removeChat = (removedChat: Chat, chats: Chat[]) => {
  return chats.filter((chat) => chat.id !== removedChat.id);
};

export default function useContactSubscription(
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) {
  const { user } = useAuthContext();

  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    const chatUser = object.element;

    if (object.opType === "INSERT") {
      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chatID)).then(
        (newChat) => {
          if (!chatsIncludeSpecificChat(chats, newChat[0])) {
            return setChats(prependChat(newChat[0], chats));
          }
        }
      );
    } else if (object.opType === "UPDATE") {
      const isOfActiveChat = !chatUser.isOfActiveChat;

      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chatID)).then(
        (updatedChat) => {
          let chatsList = chats;
          if (
            chatsIncludeSpecificChat(chats, updatedChat[0]) &&
            isOfActiveChat
          ) {
            chatsList = removeChat(updatedChat[0], chats);
          } else if (
            !chatsIncludeSpecificChat(chats, updatedChat[0]) &&
            !isOfActiveChat
          ) {
            chatsList = prependChat(updatedChat[0], chatsList);
          }

          return setChats(chatsList);
        }
      );
    }
  });

  return subscription;
}
