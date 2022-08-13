import { DataStore, SortDirection } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import CacheImage from "../../components/CustomPrimitives/CacheImage";
import SectionButton from "../../components/SectionButton";
import useAppContext from "../../hooks/useAppContext";
import { ChatUser, Message, User } from "../../src/models";
import { AllItemsScreenProps as Props } from "../../navigation/NavTypes";
import Colors from "../../constants/Colors";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export enum AllItemType {
  members = "Members",
  announcements = "Announcements",
}

export default function AllItemsScreen({ navigation, route }: Props) {
  const allItemType = route.params?.allItemType;
  const { chat, members } = useAppContext();
  const [allItems, setAllItems] = useState<any[]>([]);
  const [secondaryItems, setSecondaryItems] = useState<any[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                 Fetch Items                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    switch (allItemType) {
      case AllItemType.announcements:
        fetchAllAnnouncementMessages();
        break;
      case AllItemType.members:
        setAllItems(members);
        break;
      default:
        break;
    }
  }, []);

  /* --------------------------- Fetch Announcements -------------------------- */

  const fetchAllAnnouncementMessages = async () => {
    const allAnnouncementMessages = await DataStore.query(
      Message,
      (message) =>
        message.chatID("eq", chat?.id ?? "").isAnnouncementMessage("eq", true),
      {
        sort: (announcement) => {
          return announcement.createdAt(SortDirection.DESCENDING);
        },
      }
    );

    let allAnnouncementSenders: User[] = [];

    for (const announcement of allAnnouncementMessages) {
      const user = await DataStore.query(
        ChatUser,
        announcement.chatuserID ?? ""
      ).then((chatUser) => chatUser?.user);

      if (user) {
        allAnnouncementSenders.push(user);
      }
    }

    setAllItems(allAnnouncementMessages);
    setSecondaryItems(allAnnouncementSenders);
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render Items                                */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Handler -------------------------------- */

  const chooseRenderfunction = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    switch (allItemType) {
      case AllItemType.announcements:
        return renderAnnouncementMessage(item, index);
      case AllItemType.members:
        return renderMember(item, index);
      default:
        return <View />;
    }
  };

  /* -------------------------- Announcement Message -------------------------- */

  const renderAnnouncementMessage = (item: any, index: number) => {
    const start = index === 0;
    return (
      <>
        {start && (
          <Header
            title={AllItemType.announcements}
            style={{ marginBottom: "5%" }}
          />
        )}
        <SectionButton
          caption={item.announcementBody ?? ""}
          textStyle={{ fontWeight: "500" }}
          onPress={() => {}}
          dictionaryInput={
            <Text
              style={{
                fontWeight: "700",
                fontSize: 19,
                color: Colors.manorRed,
                alignSelf: "flex-start",
              }}
            >
              {`${secondaryItems[index]?.name}: `}
            </Text>
          }
        />
      </>
    );
  };

  /* ------------------------------ Render Member ----------------------------- */

  const renderMember = (item: ChatUser, index: number) => {
    const start = index === 0;
    return (
      <>
        {start && (
          <Header title={AllItemType.members} style={{ marginBottom: "5%" }} />
        )}
        <SectionButton
          caption={item.nickname ?? "" ?? ""}
          onPress={() => {}}
          startAdornment={
            <CacheImage
              source={item.profileImageUrl}
              cacheKey={item.profileImageUrl}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: "3%",
              }}
            />
          }
        />
      </>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          data={allItems}
          renderItem={chooseRenderfunction}
        />
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  paddingContainer: {
    flex: 1,
    paddingHorizontal: "1.5%",
  },
  flatList: {
    paddingTop: 5,
  },
  signedImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: "3%",
  },
});
