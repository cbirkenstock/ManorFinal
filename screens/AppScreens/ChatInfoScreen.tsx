import React, { useEffect, useRef, useState } from "react";
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
import { ChatUser, Message, User } from "../../src/models";
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
import EventCard from "../../components/Cards/EventCard/EventCard";
import { FlatList } from "react-native-gesture-handler";
import CacheImage from "../../components/CustomPrimitives/CacheImage";

export type ChatInfoDataType = {
  title: string | undefined;
  data: ReadonlyArray<SectionButtonProps | Message>;
  horizontal?: boolean;
};

export default function ProfileScreen({ navigation, route }: Props) {
  const { chat, members, chatUser, setChatUser, pendingAnnouncements } =
    useAppContext();
  const { user } = useAuthContext();
  const { displayUser } = route.params;
  const [eventMessages, setEventMessages] = useState<Message[]>([]);
  const [firstThreeAnnouncementMessages, setFirstThreeAnnouncementMessages] =
    useState<Message[]>([]);
  const [firstThreeAnnouncementSenders, setFirstThreeAnnouncementSenders] =
    useState<User[]>([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    chatUser?.notificationsEnabled ?? true
  );
  const notificationsEnabledRef = useRef(
    chatUser?.notificationsEnabled ?? true
  );

  /* -------------------------------------------------------------------------- */
  /*                          Settings Button functions                         */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Go To Add Members --------------------------- */

  const goToAddMembers = () => {
    navigation.navigate("UsersScreen", {
      chatType: ChatEnum.addMembers,
      chats: route.params?.chats,
      setChats: route.params.setChats,
    });
  };

  /* -------------------------- Toggle Notifications -------------------------- */

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    notificationsEnabledRef.current = !notificationsEnabledRef.current;
  };

  useEffect(() => {
    const updateChatUser = () => {
      if (
        chatUser &&
        notificationsEnabledRef.current !== chatUser?.notificationsEnabled
      ) {
        DataStore.save(
          ChatUser.copyOf(chatUser, (updatedChatUser) => {
            updatedChatUser.notificationsEnabled =
              notificationsEnabledRef.current;
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
    navigation.navigate("UsersScreen", {
      chatType: ChatEnum.coordination,
      chats: route.params?.chats,
      setChats: route.params?.setChats,
    });
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
          chats: route.params?.chats,
          setChats: route.params.setChats,
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
            chats: route.params?.chats,
            setChats: route.params.setChats,
          });
        }
      }
    }
  };

  /* ------------------------- Go To Unreached Members ------------------------ */

  const goToUnreachedMembers = (announcementMessage: Message) => {
    navigation.navigate("UnreachedMembersScreen", {
      announcementMessage: announcementMessage,
    });
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

  useEffect(() => {
    const fetchFirstThreeAnnouncementsAndSenders = async () => {
      const _firstThreeAnnouncementMessages = await DataStore.query(
        Message,
        (message) =>
          message
            .chatID("eq", chat?.id ?? "")
            .isAnnouncementMessage("eq", true),
        { limit: 3 }
      );

      let _firstThreeAnnouncementSenders: User[] = [];

      for (const announcement of _firstThreeAnnouncementMessages) {
        const user = await DataStore.query(
          ChatUser,
          announcement.chatuserID ?? ""
        ).then((chatUser) => chatUser?.user);

        if (user) {
          _firstThreeAnnouncementSenders.push(user);
        }
      }

      setFirstThreeAnnouncementMessages(_firstThreeAnnouncementMessages);
      setFirstThreeAnnouncementSenders(_firstThreeAnnouncementSenders);
    };

    fetchFirstThreeAnnouncementsAndSenders();
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
            <CacheImage
              source={member.profileImageUrl}
              cacheKey={member.profileImageUrl}
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
      title: "Announcements",
      data: firstThreeAnnouncementMessages.map((announcementMessage, index) => {
        const announcementSender = firstThreeAnnouncementSenders[index];
        return {
          caption: announcementMessage.announcementBody ?? "",
          multiline: true,
          textStyle: { fontWeight: "500" },
          onPress: () => goToUnreachedMembers(announcementMessage),
          dictionaryInput: (
            <Text
              style={{
                fontWeight: "700",
                fontSize: 19,
                color: Colors.manorRed,
                alignSelf: "flex-start",
              }}
            >
              {`${announcementSender?.name}: `}
            </Text>
          ),
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
  /* --------------------------------------------------------------------- ----- */

  /* ----------------------------- Section Header ----------------------------- */

  // const renderSectionHeader = (
  //   section: SectionListData<SectionButtonProps | Message, ChatInfoDataType>
  // ) => {
  //   return null;
  //   if (section.data.length === 0 || !section.title) {
  //     return null;
  //   } else {
  //     return <Text style={styles.header}>{section.title}</Text>;
  //   }
  // };

  /* ----------------------------- Section Button ----------------------------- */

  const renderSectionButton = (item: SectionButtonProps, first?: boolean) => {
    return (
      <SectionButton
        caption={item.caption}
        startAdornment={item.startAdornment}
        textStyle={item.textStyle}
        buttonStyle={[item.buttonStyle]}
        onPress={item.onPress}
        multiline={item.multiline}
        dictionaryInput={item.dictionaryInput}
        first={first}
      />
    );
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
        <View
          style={{
            backgroundColor: Colors.manorBackgroundGray,
            padding: 15,
            marginBottom: 15,
            borderRadius: 20,
          }}
        >
          {section.title && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
                {section.title}
              </Text>
            </View>
          )}
          <FlatList
            style={{ marginTop: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={eventMessageItems}
            keyExtractor={(eventMessage) => eventMessage.id}
            renderItem={renderEventCard}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderSectionListCard = (
    index: number,
    section: SectionListData<SectionButtonProps | Message, ChatInfoDataType>
  ) => {
    if (index === 0) {
      const sectionButtons = section.data as SectionButtonProps[];
      return (
        <View
          style={{
            backgroundColor: Colors.manorBackgroundGray,
            padding: 15,
            marginBottom: 15,
            borderRadius: 20,
          }}
        >
          {section.title && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
                {section.title}
              </Text>

              <Text
                style={{
                  color: Colors.manorPaymentBlue,
                  fontSize: 18,
                  fontWeight: "400",
                }}
              >
                See More
              </Text>
            </View>
          )}
          <FlatList
            style={{ marginTop: section.title ? 10 : 0 }}
            scrollEnabled={false}
            data={sectionButtons}
            keyExtractor={(sectionButtonProps) => sectionButtonProps.caption}
            renderItem={({ item, index }) =>
              renderSectionButton(item, index === 0)
            }
          />
        </View>
      );
    } else {
      return null;
    }
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
      <View style={styles.paddingContainer}>
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
              keyboardAppearance="dark"
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
          renderSectionHeader={() => {
            return null;
          }}
          renderItem={({ index, item, section }) => {
            if ((item as SectionButtonProps).caption) {
              //return renderSectionButton(item as SectionButtonProps);
              return renderSectionListCard(index, section);
            } else {
              return renderEventCardFlatlist(index, section);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  paddingContainer: {
    flex: 1,
    paddingHorizontal: "3%",
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    marginVertical: 5,
  },
  rowContainer: {
    marginTop: 10,
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
  sectionList: { marginTop: 20 },
});
