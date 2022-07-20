import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  SectionList,
  SectionListData,
  Text,
} from "react-native";
import useAppContext from "../../hooks/useAppContext";
import useAuthContext from "../../hooks/useAuthContext";
import { ChatInfoScreenProps as Props } from "../../navigation/NavTypes";
import { ChatUser, Message } from "../../src/models";
import Colors from "../../constants/Colors";
import { DataStore } from "aws-amplify";
import SectionButton, {
  SectionButtonProps,
} from "../../components/SectionButton/SectionButton";
import SignedImage from "../../components/CustomPrimitives/SignedImage";
import DefaultContactImage from "../../components/DefaultContactImage";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  checkForPreExistingDMChat,
  createDMChat,
} from "../../managers/ChatManager";
import { ChatEnum } from "./UsersScreen";
import EventCard from "../../components/EventCard/EventCard";
import { FlatList } from "react-native-gesture-handler";

export type ChatInfoDataType = {
  title: string | undefined;
  data: ReadonlyArray<SectionButtonProps | Message>;
  horizontal?: boolean;
};

export default function ProfileScreen({ navigation, route }: Props) {
  const { chat, members, chatUser, setChatUser } = useAppContext();
  const { user } = useAuthContext();
  const { displayUser } = route.params;
  const [eventMessages, setEventMessages] = useState<Message[]>([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    chatUser?.notificationsEnabled ?? true
  );

  /* -------------------------------------------------------------------------- */
  /*                          Settings Button functions                         */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Go To Add Members --------------------------- */

  const goToAddMembers = () => {
    navigation.navigate("UsersScreen", { chatType: ChatEnum.addMembers });
  };

  /* -------------------------- Toggle Notifications -------------------------- */

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  useEffect(() => {
    const updateChatUser = () => {
      if (chatUser && notificationsEnabled != chatUser.notificationsEnabled) {
        DataStore.save(
          ChatUser.copyOf(chatUser, (updatedChatUser) => {
            updatedChatUser.notificationsEnabled = notificationsEnabled;
          })
        ).then((newChatUser) => {
          setChatUser(newChatUser);
        });
      }
    };

    return () => updateChatUser();
  }, []);

  /* -------------------------- Go To Add Group Event ------------------------- */

  const goToAddGroupEvent = () => {
    navigation.navigate("UsersScreen", { chatType: ChatEnum.event });
  };

  /* -------------------------------- Go To DM -------------------------------- */

  const goToDM = async (member: ChatUser) => {
    if (user) {
      const existingChat = await checkForPreExistingDMChat(user, member.user);

      if (existingChat) {
        const _chatUser = (
          await DataStore.query(ChatUser, (chatUser) =>
            chatUser.chatID("eq", existingChat.id).userID("eq", user.id)
          )
        )[0];

        navigation.navigate("ChatScreen", {
          chat: existingChat,
          chatUser: _chatUser,
          displayUser: member.user,
          members: undefined,
        });
      } else {
        const results = await createDMChat(user, member.user);

        if (results) {
          const { chat, chatUser, members } = results!;

          navigation.navigate("ChatScreen", {
            chat: chat,
            chatUser: chatUser,
            displayUser: member.user,
            members: members,
          });
        }
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Data Constant                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchEventMessages = async () => {
      const _eventMessages = await DataStore.query(Message, (message) =>
        message.chatID("eq", chat?.id ?? "").isEventMessage("eq", true)
      );

      setEventMessages(_eventMessages);
    };

    fetchEventMessages();
  }, []);

  const data: ChatInfoDataType[] = [
    {
      title: undefined,
      data: [
        {
          caption: "Add Members",
          textStyle: { color: Colors.manorRed },
          startAdornment: (
            <FontAwesome
              name="group"
              size={24}
              color={Colors.manorRed}
              style={{ marginRight: "3%" }}
            />
          ),
          onPress: goToAddMembers,
        },
        {
          caption: `Notifications: ${notificationsEnabled ? "On" : "Off"}`,
          textStyle: { color: Colors.manorPurple },
          startAdornment: (
            <Ionicons
              name="notifications"
              size={24}
              color={Colors.manorPurple}
              style={{ marginRight: "3%" }}
            />
          ),
          onPress: toggleNotifications,
        },
        {
          caption: "Add Group Event",
          textStyle: { color: Colors.manorGreen },
          startAdornment: (
            <MaterialIcons
              name="event"
              size={26}
              color={Colors.manorGreen}
              style={{ marginRight: "3%" }}
            />
          ),
          onPress: goToAddGroupEvent,
        },
      ],
    },
    {
      title: "Events",
      data: eventMessages,
      horizontal: true,
    },
    {
      title: "Members",
      data: members.map((member) => {
        return {
          caption: member.nickname ?? "",
          startAdornment: (
            <SignedImage
              source={member.profileImageUrl}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: "3%",
              }}
            />
          ),
          onPress: () => goToDM(member),
        };
      }),
    },
    {
      title: "Settings",
      data: [{ caption: "Leave Chat", textStyle: { color: "red" } }],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                              Render Functions                              */
  /* -------------------------------------------------------------------------- */

  /* ----------------------------- Section Header ----------------------------- */

  const renderSectionHeader = (
    section: SectionListData<SectionButtonProps | Message, ChatInfoDataType>
  ) => {
    if (section.data.length > 0) {
      return <Text style={styles.header}>{section.title}</Text>;
    } else {
      return null;
    }
  };

  /* ------------------------------- Event Card ------------------------------- */

  const renderEventCard = ({
    index,
    item,
  }: {
    index: number;
    item: Message;
  }) => {
    return <EventCard index={index} eventMessage={item} />;
  };

  const renderEventCardFlatlist = (
    index: number,
    section: SectionListData<SectionButtonProps | Message, ChatInfoDataType>
  ) => {
    if (index === 0) {
      const eventMessageItems = section.data as Message[];

      return (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={eventMessageItems}
          keyExtractor={(eventMessage) => eventMessage.id}
          renderItem={renderEventCard}
        />
      );
    } else {
      return null;
    }
  };

  /* ----------------------------- Section Button ----------------------------- */

  const renderSectionButton = (item: SectionButtonProps) => {
    return (
      <SectionButton
        caption={item.caption}
        startAdornment={item.startAdornment}
        textStyle={item.textStyle}
        buttonStyle={item.buttonStyle}
        onPress={item.onPress}
      />
    );
  };

  /* ------------------------------- Extract Key ------------------------------ */

  const extractKey = (item: SectionButtonProps | Message) => {
    if ((item as SectionButtonProps).caption) {
      return (item as SectionButtonProps).caption;
    } else {
      return (item as Message).id;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowContainer}>
        {displayUser?.profileImageUrl || chat?.chatImageUrl ? (
          <SignedImage
            style={styles.image}
            source={
              displayUser ? displayUser.profileImageUrl : chat?.chatImageUrl
            }
          />
        ) : (
          <View style={[styles.image]}>
            <DefaultContactImage members={members} />
          </View>
        )}

        <View style={{ flexShrink: 1 }}>
          <TextInput
            editable={chat ? false : true}
            style={styles.title}
            placeholder={chat?.title ?? displayUser?.name}
            placeholderTextColor={"white"}
            multiline={true}
            maxLength={30}
            returnKeyType="done"
          />
        </View>
      </View>
      <SectionList
        showsVerticalScrollIndicator={false}
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => extractKey(item)}
        renderSectionHeader={({ section }) => renderSectionHeader(section)}
        renderItem={({ index, item, section }) => {
          if ((item as SectionButtonProps).caption) {
            return renderSectionButton(item as SectionButtonProps);
          } else {
            return renderEventCardFlatlist(index, section);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    marginBottom: 3,
  },
  rowContainer: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  image: {
    height: 130,
    width: 130,
    borderRadius: 75,
    resizeMode: "cover",
    backgroundColor: Colors.manorBlueGray,
  },

  title: {
    fontSize: 28,
    color: "white",
    marginLeft: 15,
    fontWeight: "bold",
  },
  sectionList: { paddingHorizontal: "1%" },
});
