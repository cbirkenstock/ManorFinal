import { DataStore } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { ChatUser } from "../src/models";
import { Chat, User } from "../src/models";

export const appendChats = (
  newChat: Chat,
  chats: Chat[],
  setChats: (value: React.SetStateAction<Chat[] | undefined>) => void
) => {
  setChats([newChat, ...chats]);
};

export const createGroupChat = async (
  isCoreChat: boolean,
  title?: string,
  members?: User[],
  chatImageUrl?: string,
  currentUser?: User
) => {
  if (title && currentUser && members) {
    let chatUserMembers: ChatUser[] = [];

    const chat = await DataStore.save(
      new Chat({
        title: title,
        isCoreChat: isCoreChat,
        chatImageUrl: chatImageUrl,
        isGroupChat: true,
      })
    );

    for (const member of members) {
      const chatUser = await DataStore.save(
        new ChatUser({
          userID: member.id,
          user: member,
          chatID: chat.id,
          chat: chat,
          nickname: member.name,
          profileImageUrl: member.profileImageUrl,
          notificationsEnabled: true,
        })
      );

      chatUserMembers.push(chatUser);
    }

    return {
      chat: chat,
      chatUser: chatUserMembers.filter(
        (chatUser) => chatUser.user.id === currentUser.id
      )[0],
      members: chatUserMembers,
    };
  }
};
