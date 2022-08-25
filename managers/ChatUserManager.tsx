import { DataStore } from "aws-amplify";
import { Chat, ChatUser, User } from "../src/models";
import {
  fetchMediaBlob,
  manipulatePhoto,
  PickImageRequestEnum,
  uploadMedia,
} from "./MediaManager";
import { CustomImageData } from "../managers/MediaManager";

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
        profileImageUrl: user?.profileImageUrl
          ? `${user?.profileImageUrl?.split(".")[0]}-reducedSizeVersion.jpg`
          : undefined,
        isOfActiveChat: chat.isEventChat ? true : false,
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

export const updateChatUserHasUnreadMessages = async (
  chatUsers: ChatUser[] | undefined,
  hasUnreadMessages: boolean,
  currentChatUser?: ChatUser
) => {
  if (chatUsers) {
    for (const member of chatUsers.filter(
      (chatUser) => chatUser.id !== currentChatUser?.id
    )) {
      const upToDateChatUser = await DataStore.query(
        ChatUser,
        member?.id ?? ""
      );

      if (upToDateChatUser) {
        DataStore.save(
          ChatUser.copyOf(upToDateChatUser, (updatedChatUser) => {
            updatedChatUser.hasUnreadMessage = hasUnreadMessages;
          })
        );
      }
    }
  }
};

export const updateChatUserHasUnreadAnnouncements = async (
  chatUsers: ChatUser[] | undefined,
  hasUnreadAnnouncements: boolean
) => {
  if (chatUsers) {
    for (const member of chatUsers) {
      const upToDateChatUser = await DataStore.query(
        ChatUser,
        member?.id ?? ""
      );

      if (upToDateChatUser) {
        DataStore.save(
          ChatUser.copyOf(upToDateChatUser, (updatedChatUser) => {
            updatedChatUser.hasUnreadAnnouncement = hasUnreadAnnouncements;
          })
        );
      }
    }
  }
};

export const setChatUserImage = async (
  user: User | undefined,
  imageData: CustomImageData,
  key: string
) => {
  if (user) {
    const reducedSizeImageData = await manipulatePhoto(
      imageData.fullQualityImageMetaData,
      PickImageRequestEnum.setChatUserImage
    );

    const blob = await fetchMediaBlob(reducedSizeImageData.uri);
    await uploadMedia(
      imageData.type,
      blob,
      `${key.split(".")[0]}-reducedSizeVersion.jpg`
    );
  }
};
