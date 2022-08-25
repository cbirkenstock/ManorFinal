import { Auth, DataStore } from "aws-amplify";
import { Chat, ChatUser, User } from "../src/models";
import {
  fetchMediaBlob,
  PickImageRequestEnum,
  pickMedia,
  uploadMedia,
} from "./MediaManager";

export const updateUserVenmoHandle = async (
  venmoHandle: string,
  user?: User | null
) => {
  const upToDateUser = await DataStore.query(User, user?.id ?? "");

  if (upToDateUser) {
    const updatedUser = await DataStore.save(
      User.copyOf(upToDateUser, (updatedUser) => {
        updatedUser.venmoHandle = venmoHandle;
      })
    );

    return updatedUser;
  }
};

export const updateUserProfileImageUrl = async (
  user: User | null,
  profileImageUrl: string
) => {
  const upToDateUser = await DataStore.query(User, user?.id ?? "");

  if (upToDateUser) {
    const updatedUser = await DataStore.save(
      User.copyOf(upToDateUser, (updatedUser) => {
        updatedUser.profileImageUrl = profileImageUrl;
      })
    );

    const userChats = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.userID("eq", upToDateUser.id)
      )
    ).map((chatUser) => chatUser.chat);

    for (const chat of userChats) {
      if (chat.displayUserProfileImageUrl) {
        const profileImageUrls = chat.displayUserProfileImageUrl.split("+");
        let newProfileImageUrls = "";

        if (profileImageUrls[0] === upToDateUser.profileImageUrl) {
          newProfileImageUrls = profileImageUrl + "+" + profileImageUrls[1];
        } else {
          newProfileImageUrls = profileImageUrls[0] + "+" + profileImageUrl;
        }

        DataStore.save(
          Chat.copyOf(chat, (updatedChat) => {
            updatedChat.displayUserProfileImageUrl = newProfileImageUrls;
          })
        );
      }
    }

    return updatedUser;
  }
};

export const setProfileImage = async (user: User | undefined) => {
  const upToDateUser = await DataStore.query(User, user?.id ?? "");
  const imageData = await pickMedia(PickImageRequestEnum.setProfileImage);

  if (imageData && upToDateUser) {
    const blob = await fetchMediaBlob(imageData.uri);
    const key = await uploadMedia(imageData.type, blob);
    const updatedUser = await updateUserProfileImageUrl(upToDateUser, key);
    return { updatedUser, imageData, key };
  }
};
