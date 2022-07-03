import { DataStore } from "aws-amplify";
import { UserMinus } from "react-native-feather";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { ChatUser } from "../src/models";
import { Chat, User } from "../src/models";

export const appendChats = (
  newChat: Chat,
  chats: Chat[],
  setChats: (value: React.SetStateAction<Chat[] | undefined>) => void
) => {
  setChats([
    newChat,
    ...chats.filter((chat) => chat.title !== "Header_Trojan_Horse"),
  ]);
};

/* -------------------------------------------------------------------------- */
/*                                 BreadCrumbs                                */
/* -------------------------------------------------------------------------- */

export const checkForPreExistingDMChat = async (
  user: User,
  otherUser: User
) => {
  const { breadCrumb } = createBreadCrumbs(user, otherUser);

  var chat = (
    await DataStore.query(Chat, (chat) => chat.breadCrumb("eq", breadCrumb))
  )[0];

  return chat;
};

const createBreadCrumbs = (user: User, otherUser: User) => {
  let breadCrumb: string;
  let displayUserName: string;
  let displayUserProfileImageUrl: string;

  if ((user?.id).localeCompare(otherUser.id) == -1) {
    breadCrumb = `${user?.id}+${otherUser.id}`;
    displayUserName = `${user?.name}+${otherUser.name}`;
    displayUserProfileImageUrl = `${user?.profileImageUrl}+${otherUser.profileImageUrl}`;

    return { breadCrumb, displayUserName, displayUserProfileImageUrl };
  } else {
    breadCrumb = `${otherUser.id}+${user?.id}`;
    displayUserName = `${otherUser.name}+${user.name}`;
    displayUserProfileImageUrl = `${otherUser.profileImageUrl}+${user.profileImageUrl}`;

    return { breadCrumb, displayUserName, displayUserProfileImageUrl };
  }
};

export const extractDisplayUser = (chat: Chat, user?: User) => {
  if (user) {
    let position: number;

    const idArray = chat.breadCrumb?.split("+");
    const nameArray = chat.displayUserName?.split("+");
    const profileImageUrlArray = chat.displayUserProfileImageUrl?.split("+");

    if (idArray && nameArray && profileImageUrlArray) {
      user.id === idArray[0] ? (position = 0) : (position = 1);

      const displayUser = new User({
        name: nameArray[position],
        profileImageUrl: profileImageUrlArray[position],
        phoneNumber: "0",
      });

      return displayUser;
    }
  }
};

export const createDMChat = async (user?: User, otherUser?: User) => {
  if (user && otherUser) {
    try {
      const { breadCrumb, displayUserName, displayUserProfileImageUrl } =
        createBreadCrumbs(user, otherUser);

      const members = [otherUser, user];
      let chatUserMembers: ChatUser[] = [];

      const newChat = await DataStore.save(
        new Chat({
          breadCrumb: breadCrumb,
          displayUserName: displayUserName,
          displayUserProfileImageUrl: displayUserProfileImageUrl,
          isGroupChat: false,
          isActive: true,
        })
      );

      for (const member of members) {
        const newChatUser = await DataStore.save(
          new ChatUser({
            userID: member.id,
            user: member,
            chatID: newChat.id,
            chat: newChat,
            notificationsEnabled: true,
            hasUnreadMessage: false,
            unreadMessagesCount: 0,
            nickname: user?.name ?? "choose Nickname",
            profileImageUrl: user?.profileImageUrl ?? undefined,
          })
        );

        chatUserMembers.push(newChatUser);
      }

      return {
        chat: newChat,
        chatUser: chatUserMembers[1],
        members: chatUserMembers,
      };
    } catch (error) {
      console.log(error);
    }
  }
};

export const createGroupChat = async (
  isCoreChat: boolean,
  title?: string,
  members?: User[],
  chatImageUrl?: string,
  currentUser?: User
) => {
  if (title && currentUser && members) {
    members.push(currentUser);
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
          profileImageUrl: `${
            member.profileImageUrl?.split(".")[0]
          }-reducedSizeVersion.jpg`,
          notificationsEnabled: true,
        })
      );

      chatUserMembers.push(chatUser);
    }

    return {
      chat: chat,
      chatUser: chatUserMembers[chatUserMembers.length - 1],
      members: chatUserMembers,
    };
  }
};
