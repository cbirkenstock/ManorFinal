import { DataStore } from "aws-amplify";
import { User } from "../src/models";
import {
  fetchMediaBlob,
  PickImageRequestEnum,
  pickMedia,
  uploadMedia,
} from "./MediaManager";

export const updateUserVenmoHandle = async (
  user: User | null,
  venmoHandle: string
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
