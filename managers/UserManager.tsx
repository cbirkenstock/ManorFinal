import { DataStore } from "aws-amplify";
import { User } from "../src/models";

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
