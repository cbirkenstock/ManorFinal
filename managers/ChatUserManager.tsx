import { DataStore } from "aws-amplify";
import { Chat, ChatUser, User } from "../src/models";

export const createChatUsers = async (
  users?: User[],
  chat?: Chat,
  currentUser?: User
) => {
  if (users && chat) {
    let newChatUsers = [];

    for (const user of users) {
      const newChatUser = new ChatUser({
        userID: user.id,
        user: user,
        chatID: chat.id,
        chat: chat,
        nickname: user?.name ?? "choose Nickname",
        profileImageUrl: user?.profileImageUrl ?? undefined,
        isOfActiveChat: true,
        isAdmin: user.id === currentUser?.id ? true : false,
        notificationsEnabled: true,
        hasUnreadMessage: false,
        unreadMessagesCount: 0,
      });

      const savedChatUser = await DataStore.save(newChatUser);

      newChatUsers.push(savedChatUser);
    }

    return newChatUsers;
  }
};

export const updateChatUserOfActiveChatStatus = async (
  chatUsers: ChatUser[] | null,
  isOfActiveChat: boolean
) => {
  for (const chatUser of chatUsers ?? []) {
    const upToDateChatUser = await DataStore.query(
      ChatUser,
      chatUser?.id ?? ""
    );

    if (upToDateChatUser) {
      DataStore.save(
        ChatUser.copyOf(upToDateChatUser, (updatedChatUser) => {
          updatedChatUser.isOfActiveChat = isOfActiveChat;
        })
      );
    }
  }
};
