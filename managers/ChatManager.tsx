import { DataStore } from "aws-amplify";
import { ChatUser } from "../src/models";
import { Chat, User } from "../src/models";
import { createChatUsers } from "./ChatUserManager";

export const prependChat = (newChat: Chat, chats: Chat[]) => {
  return [
    newChat,
    ...chats.filter((chat) => chat.title !== "Header_Trojan_Horse"),
  ];
};

export const removeChat = (removedChat: Chat, chats: Chat[]) => {
  return chats.filter((chat) => chat.id !== removedChat.id);
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

//this is in the breadcrumb section because it uses the breadcrumbs to extract the info
export const extractDisplayUser = (chat: Chat, user?: User) => {
  if (user) {
    let position: number;

    const idArray = chat.breadCrumb?.split("+");
    const nameArray = chat.displayUserName?.split("+");
    const profileImageUrlArray = chat.displayUserProfileImageUrl?.split("+");

    if (idArray && nameArray && profileImageUrlArray) {
      user.id === idArray[0] ? (position = 1) : (position = 0);

      const displayUser = new User({
        name: nameArray[position],
        profileImageUrl: profileImageUrlArray[position],
        phoneNumber: "111 111 1111",
      });

      return displayUser;
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                                Create Chats                                */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Create DM Chat ----------------------------- */

export const createDMChat = async (user?: User, otherUser?: User) => {
  if (user && otherUser) {
    try {
      const { breadCrumb, displayUserName, displayUserProfileImageUrl } =
        createBreadCrumbs(user, otherUser);

      const members = [otherUser, user];

      const newChat = new Chat({
        breadCrumb: breadCrumb,
        displayUserName: displayUserName,
        displayUserProfileImageUrl: displayUserProfileImageUrl,
        isGroupChat: false,
      });

      const chatUserMembers = await createChatUsers(members, newChat);

      if (chatUserMembers) {
        DataStore.save(newChat);

        return {
          chat: newChat,
          chatUser: chatUserMembers[1],
          members: chatUserMembers,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
};

/* ------------------------------- Group Chat ------------------------------- */

export const createGroupChat = async (
  isCoreChat: boolean,
  isEventChat: boolean,
  title?: string,
  members?: User[],
  chatImageUrl?: string,
  currentUser?: User
) => {
  if (title && currentUser && members) {
    members.push(currentUser);

    const newChat = await DataStore.save(
      new Chat({
        title: title,
        isCoreChat: isCoreChat,
        isEventChat: isEventChat,
        chatImageUrl: chatImageUrl,
        isGroupChat: true,
      })
    );

    const chatUserMembers = await createChatUsers(
      members,
      newChat,
      currentUser
    );

    if (chatUserMembers) {
      return {
        chat: newChat,
        chatUser: chatUserMembers[chatUserMembers.length - 1],
        members: chatUserMembers,
      };
    }
  }
};

/* ---------------------------- Coordination Chat --------------------------- */

export const createCoordinationChat = async (
  chatOne?: Chat,
  chatTwo?: Chat
) => {
  if (chatOne && chatTwo) {
    const chatOneMembers = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", chatOne.id).isAdmin("eq", true)
      )
    ).map((chatUser) => chatUser.user);

    const chatTwoMembers = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", chatTwo.id).isAdmin("eq", true)
      )
    ).map((chatUser) => chatUser.user);

    let allMembers = [...chatOneMembers, ...chatTwoMembers];

    const uniqueMembers = getUniqueMembers(allMembers);

    const coordinationChat = new Chat({
      title: `${chatOne.title}+${chatTwo.title}`,
      isGroupChat: true,
      isCoordinationChat: true,
      parentChat1ID: chatOne.id,
      parentChat2ID: chatTwo.id,
    });

    DataStore.save(coordinationChat);

    const newMembers = await createChatUsers(uniqueMembers, coordinationChat);

    return { coordinationChat, newMembers };
  }
};

export const fetchExistingCoordinationChat = async (
  chatOne?: Chat,
  chatTwo?: Chat
) => {
  if (chatOne && chatTwo) {
    const existingCoordinationChat = (
      await DataStore.query(Chat, (chat) =>
        chat
          .or((chat) =>
            chat.parentChat1ID("eq", chatOne.id).parentChat1ID("eq", chatTwo.id)
          )
          .or((chat) =>
            chat.parentChat2ID("eq", chatOne.id).parentChat2ID("eq", chatTwo.id)
          )
          .isCoordinationChat("eq", true)
      )
    )[0];

    return existingCoordinationChat;
  }
};

const getUniqueMembers = (members: User[]) => {
  const uniqueMembers = members.reduce((iteratedArray, currentMember) => {
    if (!iteratedArray.map((member) => member.id).includes(currentMember.id)) {
      iteratedArray.push(currentMember);
    }

    return iteratedArray;
  }, [] as User[]);

  return uniqueMembers;
};

/* -------------------------------------------------------------------------- */
/*                                 Add Members                                */
/* -------------------------------------------------------------------------- */

export const addMembers = async (
  chat?: Chat,
  chatID?: string,
  chosenUsers?: User[]
) => {
  if (chosenUsers) {
    if (chat) {
      const newChatUsers = createChatUsers(chosenUsers, chat);
      return newChatUsers;
    } else if (chatID) {
      const queriedChat = await DataStore.query(Chat, chatID);

      if (queriedChat) {
        const newChatUsers = createChatUsers(chosenUsers, queriedChat);
        return newChatUsers;
      }
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                                Reorder Chats                               */
/* -------------------------------------------------------------------------- */

export const reOrderChats = (
  updatedChat: Chat | undefined,
  chats: Chat[] | undefined,
  newMessage?: string
) => {
  if (updatedChat && chats) {
    let newOrderChats = chats.filter((chat) => chat.id !== updatedChat?.id);

    if (newMessage) {
      updatedChat = { ...updatedChat, lastMessage: newMessage };
    }

    newOrderChats = [updatedChat, ...newOrderChats];

    return newOrderChats;
  }
};
