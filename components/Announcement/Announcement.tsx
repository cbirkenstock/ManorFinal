import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useAppContext from "../../hooks/useAppContext";
import { animate } from "../../managers/AnimationManager";
import { deletePendingAnnouncement } from "../../managers/MessageManager";
import { InnerAnnouncementProps } from "../../navigation/NavTypes";
import { styles } from "./styles";

interface AnnouncementProps {}

export default function Announcement(props: AnnouncementProps) {
  const { pendingAnnouncements, setPendingAnnouncements } = useAppContext();
  const navigation = useNavigation<InnerAnnouncementProps>();
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [pendingAnnouncementIndex, setPendingAnnouncementIndex] =
    useState<number>(0);

  /* -------------------------------------------------------------------------- */
  /*                      Unwrapped & Asbtracted Constants                      */
  /* -------------------------------------------------------------------------- */

  const { announcementBody, link, isMandatory } =
    pendingAnnouncements[pendingAnnouncementIndex].message;

  const isLastPendingAnnouncement =
    !pendingAnnouncements[pendingAnnouncementIndex + 1]?.message
      .announcementBody;

  /* -------------------------------------------------------------------------- */
  /*                                   Appear                                   */
  /* -------------------------------------------------------------------------- */

  /*
  The reason we use a useEffect here is becuase not only does announcement now appear
  right when the first announcement is received, but everytime one is deleted, 
  the useEffect spots the change in the index and triggers the new one
  to appear
   */
  const appear = () => {
    animate(opacityAnim, 1, 1000);
  };

  useEffect(() => {
    appear();
  }, [pendingAnnouncementIndex]);

  /* -------------------------------------------------------------------------- */
  /*                      Disappear, Delete, & Update Index                     */
  /* -------------------------------------------------------------------------- */

  const hideDeleteAndReplacePendingAnnouncement = async () => {
    animate(opacityAnim, 0, 300, () => {
      deletePendingAnnouncement(pendingAnnouncements[pendingAnnouncementIndex]);
      if (!isLastPendingAnnouncement) {
        setPendingAnnouncementIndex(pendingAnnouncementIndex + 1);
      } else {
        setPendingAnnouncements([]);
      }
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <View style={styles.topRow}>
        <View style={styles.contactImage} />
        <View style={styles.textWrapper}>
          <Text style={styles.announcementBody} numberOfLines={0}>
            {
              pendingAnnouncements[pendingAnnouncementIndex].message
                .announcementBody
            }
          </Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            isMandatory ? () => {} : hideDeleteAndReplacePendingAnnouncement();
          }}
        >
          <Text style={styles.buttonText}>Hello</Text>
        </TouchableOpacity>
        {link && (
          <TouchableOpacity
            style={[styles.button, { marginLeft: 5 }]}
            onPress={() =>
              navigation.navigate("GoogleFormsScreen", {
                announcementMessage:
                  pendingAnnouncements[pendingAnnouncementIndex],
              })
            }
          >
            <Text style={styles.buttonText}>Hello</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
