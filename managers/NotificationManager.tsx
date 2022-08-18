import { DataStore } from "aws-amplify";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
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

    const token = (await Notifications.getDevicePushTokenAsync()).data;

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
      shouldShowAlert: false,
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
  message: Message,
  announcement: boolean
) => {
  if (user && chat && members && message) {
    const messageSender = await DataStore.query(
      ChatUser,
      message.chatuserID ?? ""
    );

    let recipientTokens;

    if (announcement) {
      recipientTokens = members.map((member) => member.user.expoPushToken);
    } else {
      recipientTokens = members
        .filter((member) => member.notificationsEnabled)
        .map((member) => member.user.expoPushToken);
    }

    if (recipientTokens && messageSender) {
      const https =
        "https://tlvk01h5sc.execute-api.us-east-1.amazonaws.com/default/PushNotificationSender";

      const recipients = Array.from(recipientTokens).join(",");

      const currentUserName = members
        .map((member) => member.user)
        .filter((member) => member.id === user.id)
        .map((member) => member.name)[0];

      const mediaMessage =
        message.imageUrl?.split(".")[1] == "jpg" ? "an image" : "a video";

      fetch(https, {
        // @ts-ignore
        headers: {
          title: chat.isGroupChat ? chat.title : currentUserName,
          message: announcement
            ? encodeURIComponent(message.announcementBody ?? "")
            : message.messageBody
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

/* -------------------------------------------------------------------------- */
/*                            Set Up Notifications                            */
/* -------------------------------------------------------------------------- */

export const setUpNotifications = async (
  notificationsHandler: (
    response: Notifications.NotificationResponse
  ) => Promise<void>,
  user?: User
) => {
  if (!user) return;

  setUpAndroidNotificationChanel();

  const notificationStatus = await getPushNotificationPermissions(user);

  if (notificationStatus === "granted") {
    updateUserExpoToken(user);
    setNotificationHandler();
    attachNotificationHandler(notificationsHandler);
  }
};
