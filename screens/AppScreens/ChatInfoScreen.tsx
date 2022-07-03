import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  SectionList,
  FlatList,
  SectionListData,
  Text,
} from "react-native";
import useAppContext from "../../hooks/useAppContext";
import useAuthContext from "../../hooks/useAuthContext";
import { ChatInfoScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser, Message, User } from "../../src/models";
import Colors from "../../constants/Colors";
import { DataStore, SortDirection } from "aws-amplify";
import SectionButton, {
  SectionButtonProps,
} from "../../components/SectionButton/SectionButton";
import { SectionInputProps } from "../../components/SectionInput/SectionInput";
import SignedImage from "../../components/CustomPrimitives/SignedImage";
import DefaultContactImage from "../../components/DefaultContactImage";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  checkForPreExistingDMChat,
  createDMChat,
} from "../../managers/ChatManager";

export type ChatInfoDataType = {
  title: string | undefined;
  data: SectionButtonProps[];
  horizontal?: boolean;
};

export default function ProfileScreen({ navigation, route }: Props) {
  const { chat, members } = useAppContext();
  const { user } = useAuthContext();
  const { displayUser } = route.params;

  /* -------------------------------------------------------------------------- */
  /*                          Settings Button functions                         */
  /* -------------------------------------------------------------------------- */

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
          navigation.navigate("ChatScreen", {
            chat: results?.chat,
            chatUser: results?.chatUser,
            displayUser: member.user,
            members: results?.members,
          });
        }
      }
    }
  };

  /* ------------------------------- Add Members ------------------------------ */

  /* -------------------------------------------------------------------------- */
  /*                                Data Constant                               */
  /* -------------------------------------------------------------------------- */

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
        },
        {
          caption: "Notifications:",
          textStyle: { color: Colors.manorPurple },
          startAdornment: (
            <Ionicons
              name="notifications"
              size={24}
              color={Colors.manorPurple}
              style={{ marginRight: "3%" }}
            />
          ),
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
        },
      ],
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

  /* ------------------------------ Section List ------------------------------ */

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<SectionButtonProps, ChatInfoDataType>;
  }) => {
    return section.horizontal ? (
      <></>
    ) : (
      <Text style={styles.header}>{section.title}</Text>
    );
  };

  const renderData = ({
    item,
    section,
  }: {
    item: SectionButtonProps;
    section: SectionListData<SectionButtonProps, ChatInfoDataType>;
  }) => {
    if (!section.horizontal) {
      return (
        <SectionButton
          caption={item.caption}
          startAdornment={item.startAdornment}
          textStyle={item.textStyle}
          buttonStyle={item.buttonStyle}
          onPress={item.onPress}
        />
      );
    } else {
      return null;
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
            style={styles.text}
            placeholder={chat?.title ?? displayUser?.name}
            placeholderTextColor={"white"}
            multiline={true}
            maxLength={30}
            // onChangeText={(value) => {
            //   setTitle(value);
            // }}
            returnKeyType="done"
            // onSubmitEditing={() => {
            //   updateChatTitle();
            // }}
          />
        </View>
      </View>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.caption + index}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
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

  text: {
    fontSize: 28,
    color: "white",
    marginLeft: 15,
    fontWeight: "bold",
  },
  rowBack: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#242323",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    width: "97%",
    height: 51.8,
    borderRadius: 10,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 150,
  },
  // backRightBtnLeft: {
  //   backgroundColor: "#242323",
  //   right: 75,
  //   width: 150,
  // },
  backRightBtnRight: {
    backgroundColor: Colors.manorPurple,
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
