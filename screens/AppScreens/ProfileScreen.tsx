import React, { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CacheImage from "../../components/CustomPrimitives/CacheImage";
import {
  pickMedia,
  PickImageRequestEnum,
  fetchMediaBlob,
  uploadMedia,
} from "../../managers/MediaManager";

import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import SectionInput, {
  SectionInputProps,
  SectionInputEnum,
} from "../../components/SectionInput/SectionInput";
import SectionButton, {
  SectionButtonProps,
} from "../../components/SectionButton/SectionButton";
import { ImageData } from "../../managers/MediaManager";
import { DataStore } from "aws-amplify";
import { User } from "../../src/models";

export default function ProfileScreen() {
  const { user, setUser } = useAuthContext();
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    user?.profileImageUrl ?? ""
  );
  const { signOut } = useAuthContext();

  /* -------------------------------------------------------------------------- */
  /*                              Section Constants                             */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Section Input ----------------------------- */

  const profileSectionInputs: SectionInputProps[] = [
    { caption: SectionInputEnum.name, info: user?.name, editable: false },
    {
      caption: SectionInputEnum.phone,
      info: user?.phoneNumber,
      editable: false,
    },
    {
      caption: SectionInputEnum.venmoHandle,
      info: user?.venmoHandle ?? "Input Venmo Handle",
      editable: true,
    },
  ];

  /* ----------------------------- Section Button ----------------------------- */

  const profileSectionButtons: SectionButtonProps[] = [
    { caption: "Sign Out", onPress: signOut },
    {
      caption: "Delete Account",
      textStyle: { color: Colors.manorRed },
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                              Set Profile Photo                             */
  /* -------------------------------------------------------------------------- */

  const setProfileImage = async () => {
    const imageData = await pickMedia(PickImageRequestEnum.setProfileImage);

    if (user && imageData && imageData.type) {
      const blob = await fetchMediaBlob(imageData.uri);
      const key = await uploadMedia(imageData.type, blob);
      const upToDateUser = await DataStore.query(User, user.id);

      if (upToDateUser) {
        const updatedUser = await DataStore.save(
          User.copyOf(upToDateUser, (_updatedUser) => {
            _updatedUser.profileImageUrl = key;
          })
        );

        setProfileImageUrl(imageData.fullQualityImageUri);
        setUser(updatedUser);
        return { imageData, key };
      }
    }
  };

  const setPotentialChatUserImage = async (
    imageData: ImageData,
    key: string
  ) => {
    if (user && imageData && imageData.type) {
      const blob = await fetchMediaBlob(imageData.uri);
      await uploadMedia(imageData.type, blob, `${key}-reducedSizeVersion`);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render Items                                */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Section Input ----------------------------- */

  const renderSectionInput = ({ item }: { item: SectionInputProps }) => {
    return <SectionInput {...item} />;
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
      colors={[Colors.manorPurple, "#171717"]}
      start={[1, 1]}
      end={[0.9, 0.85]}
    >
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={async () => {
            const results = await setProfileImage();
            results &&
              setPotentialChatUserImage(results.imageData, results.key);
          }}
        >
          <CacheImage
            style={styles.image}
            source={profileImageUrl}
            cacheKey={profileImageUrl}
          />
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

  image: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },

  nameText: {
    fontSize: 30,
    color: "white",
    marginLeft: 25,
    fontWeight: "bold",
  },

  flatlist: {
    flexGrow: 0,
    marginTop: 50,
  },
});
