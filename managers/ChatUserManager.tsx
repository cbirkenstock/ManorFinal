import { DataStore } from "aws-amplify";
import { Chat, ChatUser, User } from "../src/models";
import {
  fetchMediaBlob,
  manipulatePhoto,
  PickImageRequestEnum,
  uploadMedia,
} from "./MediaManager";
import { CustomImageData } from "../managers/MediaManager";

export const prependChatUser = (
  newChatUser: ChatUser,
  chatUsers: ChatUser[]
) => {
  return [newChatUser, ...chatUsers];
};

export const removeChatUser = (
  removedChatUser: ChatUser,
  chatUsers: ChatUser[]
) => {
  return chatUsers.filter((chatUser) => chatUser.id !== removedChatUser.id);
};

export const ChatUserIncluded = (
  specificChatUser: ChatUser,
  chatUsers: ChatUser[]
) => {
  return chatUsers.filter(
    (chatUser) => chatUser.id === specificChatUser.id
  )?.[0];
};

export const sortChatUsers = (chatUser1: ChatUser, chatUser2: ChatUser) => {
  const chat1 = chatUser1.chat;
  const chat2 = chatUser2.chat;
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

export const createChatUsers = async (
  users?: User[],
  chat?: Chat,
  currentUser?: User,
  isOfActiveChat?: boolean
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
        isOfActiveChat: isOfActiveChat ? true : chat.isEventChat ? true : false,
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

export const updateChatUserUpToDate = async (chatUser?: ChatUser) => {
  if (chatUser) {
    DataStore.query(ChatUser, chatUser?.id ?? "").then((upToDateChatUser) => {
      console.log(upToDateChatUser?.id);
      upToDateChatUser &&
        DataStore.save(
          ChatUser.copyOf(upToDateChatUser, (updatedChatUser) => {
            updatedChatUser.hasUnreadMessage = false;
            updatedChatUser.hasUnreadAnnouncement = false;
            updatedChatUser.unreadMessagesCount = 0;
          })
        );
    });
  }
};

export const updateChatUserHasUnreadMessages = async (
  chatUsers: ChatUser[] | undefined,
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
            updatedChatUser.hasUnreadMessage = true;
            updatedChatUser.unreadMessagesCount =
              upToDateChatUser.unreadMessagesCount ?? 0 + 1;
          })
        );
      }
    }
  }
};

export const updateChatUserHasUnreadAnnouncements = async (
  chatUsers: ChatUser[] | undefined,
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
            updatedChatUser.hasUnreadAnnouncement = true;
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
