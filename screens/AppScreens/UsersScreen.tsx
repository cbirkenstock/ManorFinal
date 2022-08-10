import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import { UsersScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser, User } from "../../src/models";
import SearchedContact from "../../components/SearchedContact/SearchedContact";
import SingleNameContact from "../../components/SingleNameContact";
import {
  checkForPreExistingDMChat,
  createCoordinationChat,
  createDMChat,
  createGroupChat,
  fetchExistingCoordinationChat,
} from "../../managers/ChatManager";
import useAuthContext from "../../hooks/useAuthContext";
import useAppContext from "../../hooks/useAppContext";
import { addMembers } from "../../managers/ChatManager";
import { requestCameraPermissionsAsync } from "expo-image-picker";
import {
  fetchMediaBlob,
  PickImageRequestEnum,
  pickMedia,
  uploadMedia,
} from "../../managers/MediaManager";

export enum ChatEnum {
  direct,
  group,
  event,
  coordination,
  core,
  addMembers,
}

export default function UsersScreen({ route, navigation }: Props) {
  const { user } = useAuthContext();
  const { chat, chatUser, members } = useAppContext();

  let searchedUsers: User[] | undefined = undefined;
  let searchedCoreChats: Chat[] | undefined = undefined;

  const [title, setTitle] = useState<string>();
  const [isCoreChat, setIsCoreChat] = useState<boolean>(false);
  const [chatImageUrl, setChatImageUrl] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>();
  const [filteredCoreChats, setFilteredCoreChats] = useState<
    Chat[] | undefined
  >();
  const [chosenUsers, setChosenUsers] = useState<User[] | undefined>();

  const isCoordination = route.params?.chatType === ChatEnum.coordination;

  /* -------------------------------------------------------------------------- */
  /*                               Sub Components                               */
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Create Button Component ------------------------ */

  const CreateButton = ({ onPress }: { onPress: (() => void) | undefined }) => {
    return (
      <TouchableOpacity style={styles.createButtonContainer} onPress={onPress}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    );
  };

  /* --------------------------- Chat Option Button --------------------------- */

  const ChatOptionButton = ({
    text,
    style,
    onPress,
  }: {
    text: string;
    style?: StyleProp<ViewStyle>;
    onPress?: ((event: GestureResponderEvent) => void) & (() => void);
  }) => {
    return (
      <Pressable style={[styles.chatOptionButton, style]} onPress={onPress}>
        <Text style={styles.chatOptionButtonText}>{text}</Text>
      </Pressable>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                           Set Navigation Options                           */
  /* -------------------------------------------------------------------------- */

  const HeaderRightButton = () => {
    switch (route.params?.chatType) {
      case ChatEnum.group:
        return (
          <CreateButton
            onPress={async () => {
              const results = await createGroupChat(
                isCoreChat,
                false,
                title,
                chosenUsers,
                chatImageUrl,
                user ?? undefined
              );
              if (results) {
                navigation.goBack();
                // @ts-ignore
                navigation.navigate("ChatNav", {
                  screen: "ChatScreen",
                  params: {
                    chat: results.chat,
                    chatUser: results.chatUser,
                    members: results.members,
                    chats: route.params?.chats,
                    setChats: route.params?.setChats,
                  },
                });
              }
            }}
          />
        );
      case ChatEnum.addMembers:
        return (
          <CreateButton
            onPress={async () => {
              const newChatUsers = await addMembers(
                chat ?? undefined,
                undefined,
                chosenUsers
              );
              // @ts-ignore
              navigation.navigate("ChatNav", {
                screen: "ChatScreen",
                params: {
                  chat: chat,
                  chatUser: chatUser,
                  members: [...(newChatUsers ?? []), ...members],
                  chats: route.params?.chats,
                  setChats: route.params?.setChats,
                },
              });
            }}
          />
        );
    }
  };

  useEffect(() => {
    navigation.setOptions({});
    switch (route.params?.chatType) {
      case ChatEnum.group:
        navigation.setOptions({
          headerRight: () => (
            <CreateButton
              onPress={async () => {
                const results = await createGroupChat(
                  isCoreChat,
                  false,
                  title,
                  chosenUsers,
                  chatImageUrl,
                  user ?? undefined
                );

                if (results) {
                  navigation.goBack();
                  // @ts-ignore
                  navigation.navigate("ChatNav", {
                    screen: "ChatScreen",
                    params: {
                      chat: results.chat,
                      chatUser: results.chatUser,
                      members: results.members,
                      chats: route.params?.chats,
                      setChats: route.params?.setChats,
                    },
                  });
                }
              }}
            />
          ),
        });
        break;
      case ChatEnum.addMembers:
        navigation.setOptions({
          headerRight: () => (
            <CreateButton
              onPress={async () => {
                const newChatUsers = await addMembers(
                  chat ?? undefined,
                  undefined,
                  chosenUsers
                );
                // @ts-ignore
                navigation.navigate("ChatNav", {
                  screen: "ChatScreen",
                  params: {
                    chat: chat,
                    chatUser: chatUser,
                    members: [...(newChatUsers ?? []), ...members],
                    chats: route.params?.chats,
                    setChats: route.params?.setChats,
                  },
                });
              }}
            />
          ),
        });
        break;

      case ChatEnum.coordination:
        navigation.setOptions({
          headerShown: false,
        });
    }
  }, [title, chosenUsers, members, isCoreChat, chatImageUrl]);

  const goToCoordinationChat = async (otherChat: Chat) => {
    const existingCoordinationChat = await fetchExistingCoordinationChat(
      chat ?? undefined,
      otherChat
    );

    if (existingCoordinationChat) {
      const _chatUser = (
        await DataStore.query(ChatUser, (chatUser) =>
          chatUser
            .chatID("eq", existingCoordinationChat.id)
            .userID("eq", user?.id ?? "")
        )
      )[0];
      navigation.navigate("ChatScreen", {
        chat: existingCoordinationChat,
        chatUser: _chatUser,
        members: undefined,
        displayUser: undefined,
        chats: route.params?.chats,
        setChats: route.params?.setChats,
      });
    } else {
      const results = await createCoordinationChat(
        chat ?? undefined,
        otherChat
      );

      if (results) {
        const { coordinationChat, newMembers } = results!;

        const _chatUser = newMembers?.find(
          (chatUser) => chatUser.user.id === user?.id
        );

        if (_chatUser) {
          navigation.navigate("ChatScreen", {
            chat: coordinationChat,
            chatUser: _chatUser,
            members: newMembers,
            displayUser: undefined,
            chats: route.params?.chats,
            setChats: route.params?.setChats,
          });
        }
      }
    }
  };

  const goToDM = async (otherUser: User) => {
    if (user) {
      const existingChat = await checkForPreExistingDMChat(user, otherUser);

      if (existingChat) {
        const _chatUser = (
          await DataStore.query(ChatUser, (chatUser) =>
            chatUser.chatID("eq", existingChat.id).userID("eq", user.id)
          )
        )[0];

        navigation.goBack();
        // @ts-ignore
        navigation.navigate("ChatNav", {
          screen: "ChatScreen",
          params: {
            chat: existingChat,
            chatUser: _chatUser,
            displayUser: otherUser,
            members: undefined,
            chats: route.params?.chats,
            setChats: route.params?.setChats,
          },
        });
      } else {
        const results = await createDMChat(user, otherUser);

        if (results) {
          const { chat, chatUser, members } = results!;

          navigation.goBack();
          // @ts-ignore
          navigation.navigate("ChatNav", {
            screen: "ChatScreen",
            params: {
              chat: chat,
              chatUser: chatUser,
              displayUser: otherUser,
              members: members,
              chats: route.params?.chats,
              setChats: route.params?.setChats,
            },
          });
        }
      }
    }
  };

  const selectGroupChatImage = async () => {
    requestCameraPermissionsAsync();

    const imageData = await pickMedia(PickImageRequestEnum.setChatImage);

    if (imageData) {
      const blob = await fetchMediaBlob(imageData.uri);
      const key = await uploadMedia(imageData.type, blob);
      setChatImageUrl(key);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                      Fetch & Fill Searched Core Chats                      */
  /* -------------------------------------------------------------------------- */

  const fetchSearchedCoreChats = async (searchValue: string) => {
    const searchedCoreChats = (
      await DataStore.query(Chat, (chat) =>
        chat.title("contains", searchValue).isCoreChat("eq", true)
      )
    ).filter((searchedUser) => searchedUser.id !== chat?.id);

    return searchedCoreChats;
  };

  /* -------------------------------------------------------------------------- */
  /*                        Fetch & Filter Searched Users                       */
  /* -------------------------------------------------------------------------- */

  const fetchSearchedUsers = async (searchValue: string) => {
    const searchedUsers = (
      await DataStore.query(User, (user) => user.name("contains", searchValue))
    ).filter((searchedUser) => {
      const isMe = searchedUser.id === user?.id;
      let alreadyInGroup = false;

      const chosenUserIDs = chosenUsers?.map((user) => user.id);
      const memberIDs = members?.map((member) => member.user.id);

      if (
        chosenUserIDs?.includes(searchedUser.id) ||
        memberIDs?.includes(searchedUser.id)
      ) {
        alreadyInGroup = true;
      }

      return !isMe && !alreadyInGroup;
    });

    return searchedUsers;
  };

  /*
  I do it like this becuase while it rerenders on every changeText, it only calls
  from the database when necessary which should drastically increase speed, if not 
  solve the rerender problem 
   */
  useEffect(() => {
    const getSearchedUsers = async () => {
      if (searchValue === "") {
        searchedUsers = undefined;
        setFilteredUsers([]);
      } else {
        if (searchedUsers) {
          const _filteredUsers = searchedUsers.filter((user) =>
            user.name.includes(searchValue)
          );

          setFilteredUsers(_filteredUsers);
        } else {
          const _searchedUsers = await fetchSearchedUsers(searchValue);
          searchedUsers = _searchedUsers;
          setFilteredUsers(_searchedUsers);
        }
      }
    };

    const getSearchedCoreChats = async () => {
      if (searchValue === "") {
        searchedCoreChats = undefined;
        setFilteredCoreChats([]);
      } else {
        if (searchedCoreChats) {
          const _filteredCoreChats = searchedCoreChats.filter((chat) =>
            chat.title?.includes(searchValue)
          );

          setFilteredCoreChats(_filteredCoreChats);
        } else {
          const _searchedCoreChats = await fetchSearchedCoreChats(searchValue);
          searchedCoreChats = _searchedCoreChats;
          setFilteredCoreChats(_searchedCoreChats);
        }
      }
    };

    isCoordination ? getSearchedCoreChats() : getSearchedUsers();
  }, [searchValue]);

  /* -------------------------------------------------------------------------- */
  /*                           User Clicked Functions                           */
  /* -------------------------------------------------------------------------- */

  const updateChosenUsers = (user: User) => {
    const _chosenUsers = chosenUsers ? [...chosenUsers, user] : [user];
    setChosenUsers(_chosenUsers);
    setSearchValue("");
  };

  /* ----------------------------- SearchedContact ---------------------------- */

  const searchedContactPressed = (user: User) => {
    switch (route.params?.chatType) {
      case ChatEnum.group:
        updateChosenUsers(user);
        break;
      case ChatEnum.addMembers:
        updateChosenUsers(user);
        break;
      case ChatEnum.direct:
        goToDM(user);
        break;
    }
  };

  /* ---------------------------- SingleNameContact --------------------------- */

  const singleNameContactPressed = (contact: User) => {
    const _chosenUsers = [...chosenUsers!].filter(
      (user) => user.id !== contact.id
    );

    setChosenUsers(_chosenUsers.length > 0 ? _chosenUsers : undefined);
  };

  /* -------------------------------------------------------------------------- */
  /*                              Render Functions                              */
  /* -------------------------------------------------------------------------- */

  const renderSearchedUser = ({ item }: { item: User }) => {
    return (
      <SearchedContact
        contact={item}
        onPress={() => searchedContactPressed(item)}
      />
    );
  };

  const renderSearchedCoreChat = ({ item }: { item: Chat }) => {
    return (
      <SearchedContact
        contact={item}
        onPress={() => goToCoordinationChat(item)}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 35,
            fontWeight: "700",
          }}
        >
          {route.params?.chatType === ChatEnum.group
            ? "Create Group"
            : route.params?.chatType === ChatEnum.coordination
            ? "New Group Event"
            : "New DM"}
        </Text>
        {HeaderRightButton()}
      </View>
      {route.params?.chatType === ChatEnum.group && (
        <TextInput
          style={styles.searchBar}
          keyboardAppearance="dark"
          placeholder={"Title..."}
          placeholderTextColor={Colors.manorDarkWhite}
          onChangeText={(value) => setTitle(value)}
        />
      )}
      <TextInput
        style={styles.searchBar}
        keyboardAppearance="dark"
        placeholder={"Search..."}
        placeholderTextColor={Colors.manorDarkWhite}
        onChangeText={(_searchValue) => {
          setSearchValue(_searchValue);
        }}
        value={searchValue}
      />
      {route.params?.chatType === ChatEnum.group && (
        <View style={styles.chatOptionButtonsContainer}>
          <ChatOptionButton
            text="Make Core Chat"
            style={{
              backgroundColor: isCoreChat
                ? Colors.manorGreen
                : Colors.manorBlueGray,
              flex: 0.4,
            }}
            onPress={() => setIsCoreChat(!isCoreChat)}
          />
          <ChatOptionButton
            text="Add Group Chat Picture"
            style={{
              backgroundColor: chatImageUrl
                ? Colors.manorGreen
                : Colors.manorBlueGray,
              flex: 0.59,
            }}
            onPress={() => {
              selectGroupChatImage();
            }}
          />
        </View>
      )}
      {chosenUsers && (
        <FlatList
          horizontal={true}
          keyboardShouldPersistTaps={"handled"}
          style={styles.chosenNamesFlatList}
          data={chosenUsers}
          renderItem={({ item }) => (
            <SingleNameContact
              user={item}
              flatListWidth={0.97 * Dimensions.get("window").width}
              firstPageNumber={7}
              spacing={3}
              onPress={() => singleNameContactPressed(item)}
            />
          )}
        />
      )}
      <FlatList
        style={styles.searchedNamesFlatlist}
        numColumns={3}
        keyboardShouldPersistTaps={"handled"}
        //@ts-ignore
        data={isCoordination ? filteredCoreChats : filteredUsers}
        //@ts-ignore
        renderItem={
          isCoordination ? renderSearchedCoreChat : renderSearchedUser
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "4%",
    backgroundColor: Colors.manorBackgroundGray,
  },

  chatOptionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 10,
  },

  chatOptionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: "3%",
  },

  chatOptionButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },

  chosenNamesFlatList: {
    flexGrow: 0,
    borderRadius: 15,
    padding: "2%",
    backgroundColor: Colors.manorBlueGray,
    marginTop: 10,
  },

  searchedNamesFlatlist: {
    marginTop: 20,
    marginBottom: 5,
  },

  searchBar: {
    height: 37.5,
    marginTop: 20,
    fontSize: 22,
    color: "white",
    borderBottomWidth: 2,
    borderBottomColor: Colors.manorPurple,
  },

  createButtonContainer: {
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  createButtonText: {
    color: Colors.manorPurple,
    fontWeight: "600",
    fontSize: 16,
  },
});
