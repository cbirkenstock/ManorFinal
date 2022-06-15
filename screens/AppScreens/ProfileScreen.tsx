import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import useAuthContext from "../../hooks/useAuthContext";
import { Chat, ChatUser, User } from "../../src/models";

export default function ProfileScreen() {
  const { user } = useAuthContext();
  const [chats, setChats] = useState<Chat[]>();

  useEffect(() => {
    const fetchChats = async () => {
      const _chats = (
        await DataStore.query(ChatUser, (chatuser) =>
          chatuser.userID("eq", user?.id ?? "")
        )
      ).map((chatUser) => chatUser.chat);

      setChats(_chats);
    };

    fetchChats();
  }, []);

  return <View />;
}
