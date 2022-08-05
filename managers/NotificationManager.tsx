import { DataStore } from "aws-amplify";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Chat, ChatUser, Message, User } from "../src/models";

/* -------------------------------------------------------------------------- */
/*                                  Register                                  */
/* -------------------------------------------------------------------------- */

export const getPushNotificationPermissions = async (
  user: User | undefined
) => {
  if (Device.isDevice && user) {
    const { status: currentStatus } = await Notifications.getPermissionsAsync();

    if (currentStatus === "granted") {
      return currentStatus;
    } else {
      const { status: updatedStatus } =
        await Notifications.requestPermissionsAsync();

      if (updatedStatus !== "granted") {
        alert("Failed to get push token for push notification!");
      }

      return updatedStatus;
    }
  }
};

export const updateUserExpoToken = async (user: User | undefined) => {
  if (user) {
    const upToDateUser = await DataStore.query(User, user.id);

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (upToDateUser && upToDateUser?.expoPushToken !== token) {
      try {
        DataStore.save(
          User.copyOf(upToDateUser, (updatedUser) => {
            updatedUser.expoPushToken = token;
          })
        );
      } catch (error) {
        alert(error);
      }
    }
  }
};

export const setUpAndroidNotificationChanel = () => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

/* -------------------------------------------------------------------------- */
/*                              Response Handler                              */
/* -------------------------------------------------------------------------- */

/* ------------------------- Fetch Notification Chat ------------------------ */

export const fetchNotificationChat = async (
  response: Notifications.NotificationResponse,
  user: User | undefined
) => {
  if (user) {
    const chat = await DataStore.query(
      Chat,
      response?.notification?.request?.content?.data?.chatID as string
    );

    if (chat) {
      const members = await DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", chat?.id ?? "")
      );

      const chatUser = members.filter(
        (chatUser) => chatUser.user.id === user?.id
      )[0];

      const displayUser = !chat?.isGroupChat
        ? members.filter((member) => member.user.id !== user?.id)[0].user
        : undefined;

      if (chatUser) {
        return { chat, chatUser, members, displayUser };
      }
    }
  }
};

/* ------------------------- Attach Response Handler ------------------------ */

export const attachNotificationHandler = (
  responseHandler: (
    response: Notifications.NotificationResponse
  ) => Promise<void>
) => {
  Notifications.addNotificationResponseReceivedListener(responseHandler);
};

/* -------------------------------------------------------------------------- */
/*                              Send Notification                             */
/* -------------------------------------------------------------------------- */

export const sendNotification = async (
  user: User | undefined,
  chat: Chat | undefined,
  members: ChatUser[] | undefined,
  message: Message
) => {
  if (user && chat && members && message) {
    const messageSender = await DataStore.query(
      ChatUser,
      message.chatuserID ?? ""
    );

    const recpientTokens = members
      .filter((member) => member.notificationsEnabled)
      .map((member) => member.user.expoPushToken);

    if (recpientTokens && messageSender) {
      const https =
        "https://tlvk01h5sc.execute-api.us-east-1.amazonaws.com/default/PushNotificationSender";

      const recipients = Array.from(recpientTokens).join(",");

      const otherUserName = members
        .map((member) => member.user)
        .filter((member) => member.id != user.id)
        .map((member) => member.name)[0];

      const mediaMessage =
        message.imageUrl?.split(".")[1] == "jpg" ? "an image" : "a video";

      fetch(https, {
        // @ts-ignore
        headers: {
          title: chat.isGroupChat ? chat.title : otherUserName,
          message: message.messageBody
            ? encodeURIComponent(message.messageBody)
            : `${messageSender.user.name} sent ${mediaMessage}`,
          sender: chat.isGroupChat
            ? message.messageBody
              ? messageSender.nickname ?? undefined
              : undefined
            : undefined,
          recipients: recipients,
          chat: chat.id,
          imageurl: message.imageUrl ? message.imageUrl : null,
          messageid: message.id,
        },
      }).catch((error) => alert(error));
    }
  }
};