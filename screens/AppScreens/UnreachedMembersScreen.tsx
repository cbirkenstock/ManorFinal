import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import SectionButton from "../../components/SectionButton";
import { DataStore } from "aws-amplify";
import { PendingAnnouncement, User } from "../../src/models";
import { UnreachedMembersScreenProps } from "../../navigation/NavTypes";
import SignedImage from "../../components/CustomPrimitives/SignedImage";
import Dialog from "../../components/Dialog";
import MessageAllForm from "../../components/Dialog/DialogForms/MessageAllForm/MessageAllForm";
import Colors from "../../constants/Colors";

export default function UnreachedMembersScreen({
  route,
  navigation,
}: UnreachedMembersScreenProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [unreachedUsers, setUnreachedUsers] = useState<User[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                            Fetch Unreached Users                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchUnreachedUsers = async () => {
      const unreachedChatUsers = (
        await DataStore.query(PendingAnnouncement, (pendingAnnouncement) =>
          pendingAnnouncement.messageID(
            "eq",
            route.params?.announcementMessage.id
          )
        )
      ).map((pendingAnnouncement) => pendingAnnouncement.chatUser);

      let _unreachedUsers = [];

      for (const unreachedChatUser of unreachedChatUsers) {
        const _unreachedUser = await DataStore.query(
          User,
          unreachedChatUser.userID
        );

        if (_unreachedUser) {
          _unreachedUsers.push(_unreachedUser);
        }
      }

      setUnreachedUsers(_unreachedUsers);
    };

    fetchUnreachedUsers();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                           Set Header Bar Settings                          */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: "5%" }}
          onPress={() => {
            setIsDialogOpen(true);
          }}
        >
          <Text style={{ color: Colors.manorPurple, fontSize: 18 }}>
            Message All
          </Text>
        </Pressable>
      ),
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Function                        */
  /* -------------------------------------------------------------------------- */

  const renderUnreachedMember = ({ item }: { item: User }) => {
    return (
      <SectionButton
        caption={item?.name}
        startAdornment={
          <SignedImage
            source={item.profileImageUrl}
            style={styles.signedImage}
          />
        }
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <Dialog
        visible={isDialogOpen}
        width={300}
        title="Message All"
        helperText="This message will be sent as a DM to everyone on this list"
        onClose={() => setIsDialogOpen(false)}
      >
        <MessageAllForm
          unreachedUsers={unreachedUsers}
          onSubmit={() => setIsDialogOpen(false)}
        />
      </Dialog>
      <FlatList
        style={styles.flatList}
        data={unreachedUsers}
        renderItem={renderUnreachedMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
