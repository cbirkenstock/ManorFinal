import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  AppState,
} from "react-native";

import { API, DataStore, graphqlOperation } from "aws-amplify";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Ionicons, Octicons } from "@expo/vector-icons";

import useAuthContext from "../../hooks/useAuthContext";
import { animate, animateTwoSequence } from "../../managers/AnimationManager";
import {
  initializeUpdatedChatSubscription,
  getContactSubscription,
} from "../../managers/SubscriptionManager";
import {
  fetchNotificationChat,
  setUpNotifications,
} from "../../managers/NotificationManager";

import Header from "../../components/Header";
import DropdownItem, { DropdownItemProps } from "../../components/DropdownItem";
import { MemoizedContact } from "../../components/Contact/Contact";

import Colors from "../../constants/Colors";
import { ContactScreenProps as Props } from "../../navigation/NavTypes";
import { ChatUser, User } from "../../src/models";
import { dropDown } from "../../constants/Dropdown";
import { hasBezels } from "../../constants/hasBezels";
import * as queries from "../../src/graphql/queries";
import * as subscriptions from "../../src/graphql/subscriptions";
import * as mutations from "../../src/graphql/mutations";
import { ZenObservable } from "../../node_modules/zen-observable-ts";

import {
  ChatUserIncluded,
  prependChatUser,
  removeChatUser,
  sortChatUsers,
} from "../../managers/ChatUserManager";
import useAppSyncSetUp from "../../hooks/useAppSyncSetUp";
import { buildSync } from "aws-appsync";

import { a as b } from "../../test";
import gql from "graphql-tag";
import useDataClean from "../../hooks/useDataClean";

import { Observable } from "../../node_modules/zen-observable-ts";

export default function ContactScreen({ route, navigation }: Props) {
  const context = useAuthContext();
  const { user } = context;

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const hasRefreshedChatUsersRef = useRef<boolean>(false);

  const height = Dimensions.get("screen").height;
  const exitViewHeightAnim = useRef(new Animated.Value(0)).current;
  const exitViewOpacityAnim = useRef(new Animated.Value(0)).current;

  let contactSubscription: ZenObservable.Subscription;
  let subscriptionsArrayRef = useRef<ZenObservable.Subscription[]>([]);

  /*
  This Screen keeps it pretty simple, think of leading chats as a sequence of 3

  1. get up the cached chats -- these chats are likely outdated but then there is 
  no lag time where the user sees a blank screen 

  2. Refresh the chats -- here we actuall make a call to database to get most up
  to date chats 

  3. Initialize subscriptions -- we only want subscriptions after everything has
  been updated, otherwaize we could get several refreshes all at once if there are 
  changes before the refresh completes -- this look annoying 
  */

  /* -------------------------------------------------------------------------- */
  /*                                Set ChatUsers                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Get Cached ChatUsers -------------------------- */

  useEffect(() => {
    const getCachedChatUsers = async () => {
      const _chatUsers = (
        await DataStore.query(ChatUser, (chatUser) =>
          chatUser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true)
        )
      ).sort(sortChatUsers);
      //if refresh hasn't beaten cache, then do set chats
      !hasRefreshedChatUsersRef.current && setChatUsers(_chatUsers);
    };

    getCachedChatUsers();
  }, []);

  /* ---------------------------- Refresh ChatUsers --------------------------- */

  const refreshChatUsers = async () => {
    try {
      const _chatUsers = (
        (await API.graphql(
          graphqlOperation(queries.byUserID, {
            userID: user?.id,
            filter: { isOfActiveChat: { eq: true } },
            limit: 1000,
          })
        )) as any
      )?.data?.byUserID?.items
        ?.filter(
          (chatUser: ChatUser) =>
            // @ts-ignore
            !chatUser._deleted
        )
        ?.sort(sortChatUsers);

      hasRefreshedChatUsersRef.current = true;

      if (_chatUsers) {
        setChatUsers(_chatUsers as ChatUser[]);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    refreshChatUsers();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- ChatUser Listener --------------------------- */

  // const initializeChatUserDeletedSubscription = (
  //   removeChatUser: (updatedChatUser: ChatUser) => void,
  //   user?: User
  // ) => {
  //   const observable = API.graphql(
  //     graphqlOperation(subscriptions.onDeleteChatUserByUserID, {
  //       userID: user?.id,
  //     })
  //   ) as Observable<object>;

  //   const subscription = observable.subscribe({
  //     next: (chatUserMetaInfo) => {
  //       const createdChatUser: ChatUser = (chatUserMetaInfo as any).value.data
  //         .onUpdateChatUserByUserID;

  //       removeChatUser(createdChatUser);
  //     },

  //     error: () => {},
  //   });

  //   return subscription;
  // };

  // const initializeChatUserCreatedSubscription = (
  //   prependChatUser: (updatedChatUser: ChatUser) => void,
  //   user?: User
  // ) => {
  //   const observable = API.graphql(
  //     graphqlOperation(subscriptions.onCreateChatUserByUserID, {
  //       userID: user?.id,
  //     })
  //   ) as Observable<object>;

  //   const subscription = observable.subscribe({
  //     next: (chatUserMetaInfo) => {
  //       const createdChatUser: ChatUser = (chatUserMetaInfo as any).value.data
  //         .onUpdateChatUserByUserID;

  //       prependChatUser(createdChatUser);
  //     },

  //     error: () => {},
  //   });

  //   return subscription;
  // };

  useEffect(() => {
    setTimeout(() => {
      console.log("yeah");
      const chatUserDetails = {
        id: "0970d87e-db07-4678-b324-3f05847ba297",
        unreadMessagesCount: 0,
      };

      API.graphql({
        query: mutations.updateChatUser,
        variables: { input: chatUserDetails },
      });
    }, 500);
  }, []);

  const initializeChatUserUpdatedSubscription = (
    a?: (updatedChatUser: ChatUser) => void,
    updateChatUser?: (updatedChatUser: ChatUser) => void,
    user?: User
  ) => {
    const observable = API.graphql(
      graphqlOperation(subscriptions.onUpdateChatUserByUserID, {
        userID: user?.id,
      })
    ) as Observable<object>;

    const subscription = observable.subscribe({
      next: (chatUserMetaInfo) => {
        const updatedChatUser: ChatUser = (chatUserMetaInfo as any).value.data
          .onUpdateChatUserByUserID;

        const currentChatUser = chatUsers.filter(
          (chatUser) => chatUser.id === updatedChatUser.id
        )[0];

        const unreadMessagesIncremented =
          (updatedChatUser.unreadMessagesCount ?? 0) >
          (currentChatUser.unreadMessagesCount ?? 0);

        if (!updatedChatUser.isOfActiveChat) {
          removeChatUser(updatedChatUser, chatUsers);
        } else if (unreadMessagesIncremented) {
          reOrderChatUser(updatedChatUser);
        }

        //change in active chat -- remove user
        //updated unread message -- move user
        //change to other information for chatUser -- update user
      },
      error: () => {},
    });
    return subscription;
  };

  /* ------------------------ Chat Updated Subscription ----------------------- */

  /*
  This subscription listens to last message changing so that whenber someone texts
  the message is moved to the top and has unread messages is update
  */

  // const initializeUpdatedChatSubscriptions = async () => {
  //   const chats = chatUsers.map((chatUser) => chatUser?.chat);

  //   for (const chat of chats) {
  //     const subscription = initializeUpdatedChatSubscription(
  //       chat,
  //       reOrderChatUser,
  //       user
  //     );

  //     if (subscription) {
  //       subscriptionsArrayRef.current = [
  //         ...subscriptionsArrayRef.current,
  //         subscription,
  //       ];
  //     }
  //   }
  // };

  const reOrderChatUser = (updatedChatUser: ChatUser) => {
    let chatUsersList = removeChatUser(updatedChatUser, chatUsers);
    chatUsersList = prependChatUser(updatedChatUser, chatUsersList);
    setChatUsers(chatUsersList);
  };

  const updateChatUserInPlace = (updatedChatUser: ChatUser) => {
    const updatedChatUsersList = chatUsers.map((chatUser) => {
      if (chatUser.id === updatedChatUser.id) {
        return updatedChatUser;
      } else {
        return chatUser;
      }
    });

    setChatUsers(updatedChatUsersList);
  };

  /* --------------------------- Chat Added/Deleted --------------------------- */

  /*
  This subscription follows adding and removing chats that are not currently
  on the contact screen. This includes an old chat becoming active again, 
  a chat being created, and a user leaving a chat.
  */
  const initializeAddRemoveSubscription = () => {
    const addRemoveSubscription = getContactSubscription(
      addRemoveChatUser,
      user
    );

    return addRemoveSubscription;
  };

  const addRemoveChatUser = (specificChatUser: ChatUser) => {
    const chatIncluded = !!ChatUserIncluded(specificChatUser, chatUsers);
    const isOfActiveChat = specificChatUser.isOfActiveChat;

    if (chatIncluded && !isOfActiveChat) {
      const updatedChatUsers = removeChatUser(specificChatUser, chatUsers);
      setChatUsers(updatedChatUsers);
    } else if (!chatIncluded && isOfActiveChat) {
      const updatedChatUsers = prependChatUser(specificChatUser, chatUsers);
      setChatUsers(updatedChatUsers);
    }
  };

  /* ----------------------- Chat Subscription UseEffect ---------------------- */

  const unsubscribeAll = () => {
    contactSubscription?.unsubscribe();

    for (const subscription of subscriptionsArrayRef.current) {
      subscription.unsubscribe();
    }

    subscriptionsArrayRef.current = [];
  };

  useEffect(() => {
    initializeChatUserUpdatedSubscription(undefined, undefined, user);
  }, []);

  // useEffect(() => {
  //   initializeUpdatedChatSubscriptions();

  //   contactSubscription = initializeAddRemoveSubscription();

  //   return () => unsubscribeAll();
  // }, [chatUsers]);

  /* ------------------------------ App Listener ------------------------------ */

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        refreshChatUsers();
      } else if (status === "background") {
        unsubscribeAll();
        hasRefreshedChatUsersRef.current = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             Notification Set Up                            */
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Notification Response Handler --------------------- */

  const notificationRespondedTo = async (
    response: Notifications.NotificationResponse
  ) => {
    const results = await fetchNotificationChat(response, user);

    if (results?.chat && results.chatUser) {
      // @ts-ignore
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: results.chat,
          chatUser: results.chatUser,
          members: results.members,
          displayUser: results.displayUser,
          triggeredByNotification: true,
        },
      });
    }
  };

  /* -------------------------- Set Up Notifications -------------------------- */

  useEffect(() => {
    setUpNotifications(notificationRespondedTo, user);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Header --------------------------------- */

  const ContactScreenHeader = () => {
    return (
      <Header
        title="Messages"
        buttons={[
          <Pressable
            key={"profileButton"}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Ionicons
              name={"person-circle-outline"}
              size={35}
              color={"white"}
            />
          </Pressable>,
          <Pressable
            key={"addChatButton"}
            onPress={() => {
              animate(exitViewHeightAnim, height, 0);
              animate(exitViewOpacityAnim, 1, 150);
            }}
          >
            <Octicons name="plus" size={35} color={"white"} />
          </Pressable>,
        ]}
        style={styles.header}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Contact -------------------------------- */

  const renderContact = ({ item }: { item: ChatUser }) => {
    return (
      <MemoizedContact
        chatUser={item}
        chatUsers={chatUsers}
        setChatUsers={setChatUsers}
      />
    );
  };

  /* ----------------------------- Drop Down Item ----------------------------- */

  const renderDropdownItem = ({ item }: { item: DropdownItemProps["tab"] }) => {
    return (
      <DropdownItem
        tab={item}
        exitViewHeightAnim={exitViewHeightAnim}
        exitViewOpacityAnim={exitViewOpacityAnim}
        // chats={chatUsers}
        // setChats={setChatUsers}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.manorPurple, Colors.manorBackgroundGray]}
      start={[0, 0]}
      end={[0.1, 0.15]}
    >
      <StatusBar hidden />
      <FlatList
        style={styles.FlatList}
        numColumns={2}
        data={chatUsers}
        renderItem={renderContact}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ContactScreenHeader />}
      />
      <Animated.View
        style={[
          styles.exitView,
          { height: exitViewHeightAnim, opacity: exitViewOpacityAnim },
        ]}
      >
        <Pressable
          style={styles.exitPressable}
          onPress={() => {
            animateTwoSequence(
              exitViewOpacityAnim,
              0,
              150,
              exitViewHeightAnim,
              0,
              0
            );
          }}
        >
          <FlatList
            style={styles.dropDown}
            data={dropDown}
            renderItem={renderDropdownItem}
            keyExtractor={(item) => item.caption}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginHorizontal: "5%",
    marginTop: hasBezels ? "5%" : "12%",
    marginBottom: "2%",
  },

  FlatList: {
    flex: 1,
  },

  chatPairContainer: {
    width: "100%",
    flexDirection: "row",
  },

  hangingChatContainer: {
    width: "50%",
    flexDirection: "row",
  },

  exitView: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  exitPressable: {
    flex: 1,
    paddingTop: "10%",
  },

  dropDown: {
    flex: 1,
  },
});
