import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CacheImage from "../../components/CustomPrimitives/CacheImage";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import SectionInput, {
  SectionInputProps,
} from "../../components/SectionInput/SectionInput";
import SectionButton, {
  SectionButtonProps,
} from "../../components/SectionButton/SectionButton";
import {
  setProfileImage,
  updateUserVenmoHandle,
} from "../../managers/UserManager";
import { setChatUserImage } from "../../managers/ChatUserManager";
import { Auth } from "aws-amplify";

export default function ProfileScreen() {
  const { user, setUser, signOut, deleteAccount } = useAuthContext();
  const profileImageUrl = user?.profileImageUrl ?? undefined;

  const isLocal = profileImageUrl?.includes("file:///");

  /* -------------------------------------------------------------------------- */
  /*                              Section Functions                             */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Section Input ----------------------------- */

  const updateVenmoHandle = async (currentInfo: string) => {
    const updatedUser = await updateUserVenmoHandle(currentInfo, user);

    updatedUser && setUser(updatedUser);
  };

  /* -------------------------------------------------------------------------- */
  /*                              Section Constants                             */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Section Input ----------------------------- */

  const profileSectionInputs: SectionInputProps[] = [
    {
      caption: "Name",
      info: user?.name,
      editable: false,
    },
    {
      caption: "Phone",
      info: user?.phoneNumber,
      editable: false,
    },
    {
      caption: "Venmo Handle",
      info: user?.venmoHandle ?? "Input Venmo Handle",
      editable: true,
      onSubmit: updateVenmoHandle,
    },
  ];

  /* ----------------------------- Section Button ----------------------------- */

  const profileSectionButtons: SectionButtonProps[] = [
    { caption: "Sign Out", onPress: signOut },
    {
      caption: "Delete Account",
      onPress: () =>
        Alert.alert(
          "Delete Account?",
          "You will not be able to undo this action.",
          [
            {
              text: "Delete",
              onPress: () => deleteAccount(user),
              style: "destructive",
            },
            { text: "Cancel", style: "cancel" },
          ]
        ),
      textStyle: { color: Colors.manorRed },
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                                Render Items                                */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Section Input ----------------------------- */

  const renderSectionInput = ({ item }: { item: SectionInputProps }) => {
    return <SectionInput containerStyle={{ paddingVertical: 15 }} {...item} />;
  };

  /* ----------------------------- Section Button ----------------------------- */

  const renderSectionButton = ({ item }: { item: SectionButtonProps }) => {
    return <SectionButton {...item} />;
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.manorPurple, Colors.manorBackgroundGray]}
      start={[1, 1]}
      end={[0.9, 0.85]}
    >
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={async () => {
            const results = await setProfileImage(user ?? undefined);
            results?.updatedUser && setUser(results.updatedUser);
            results &&
              setChatUserImage(
                user ?? undefined,
                results.imageData,
                results.key
              );
          }}
        >
          {profileImageUrl ? (
            <CacheImage
              style={styles.imageContainer}
              source={profileImageUrl}
              cacheKey={profileImageUrl}
            />
          ) : (
            <View style={[styles.imageContainer, styles.addImageContainer]}>
              <Text style={styles.addImageText}>Add Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.nameText}>{user?.name?.split(" ")[0]}</Text>
          <Text style={styles.nameText}>{user?.name?.split(" ")[1]}</Text>
        </View>
      </View>
      <FlatList
        style={styles.flatlist}
        data={profileSectionInputs}
        renderItem={renderSectionInput}
        scrollEnabled={false}
        keyExtractor={(item) => item.caption}
      />
      <FlatList
        style={styles.flatlist}
        data={profileSectionButtons}
        renderItem={renderSectionButton}
        scrollEnabled={false}
        keyExtractor={(item) => item.caption}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "7.5%",
    paddingHorizontal: "5%",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(45, 50, 56, 0.0)",
  },

  imageContainer: {
    height: 130,
    width: 130,
    borderRadius: 65,
    backgroundColor: Colors.manorBlueGray,
  },

  addImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  addImageText: {
    color: Colors.manorDarkWhite,
    fontSize: 18,
    fontWeight: "600",
  },

  nameText: {
    fontSize: 30,
    color: "white",
    marginLeft: 25,
    fontWeight: "bold",
  },

  flatlist: {
    flexGrow: 0,
    marginTop: 30,
  },
});
