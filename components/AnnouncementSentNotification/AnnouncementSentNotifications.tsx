import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import Colors from "../../constants/Colors";
import { animate } from "../../managers/AnimationManager";
import styles from "./styles";

interface AnnouncementSentNotificationProps {
  setHasSentAnnouncement: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AnnouncementSentNotification(
  props: AnnouncementSentNotificationProps
) {
  const { setHasSentAnnouncement } = props;

  const announcementSentNotificationOpacityAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    const time = 500;

    animate(announcementSentNotificationOpacityAnim, 1, time, () =>
      animate(announcementSentNotificationOpacityAnim, 0, time, () => {
        setHasSentAnnouncement(false);
      })
    );
  }, []);

  return (
    <Animated.View
      style={[
        styles.background,
        { opacity: announcementSentNotificationOpacityAnim },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Sent</Text>
        <FontAwesome name="check" size={70} color={Colors.manorGreen} />
      </View>
    </Animated.View>
  );
}
