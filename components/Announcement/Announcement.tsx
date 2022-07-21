import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { animate } from "../../managers/AnimationManager";
import { styles } from "./styles";

interface AnnouncementProps {
  announcements: string[];
}

export default function Announcement(props: AnnouncementProps) {
  const { announcements } = props;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [messageIndex, setMessageIndex] = useState<number>(0);

  const messages = [
    "hello",
    "goodbye",
    "asdlkfa;slfkdja;lsdfjka;lsdgjk;alsdkjf;alskjf;alskdjfa;lskdjfa;lskdjfa;sldkfja;sdlkfja;sdklfja;slkdfja;lksfdj",
    "see ya!",
  ];

  const appear = () => {
    animate(opacityAnim, 1, 1000);
  };

  const disappearAndReplaceMessage = async () => {
    if (messages[messageIndex + 1]) {
      animate(opacityAnim, 0, 300, () => setMessageIndex(messageIndex + 1));
    } else {
      animate(opacityAnim, 0, 300);
    }
  };

  useEffect(() => {
    appear();
  }, [messageIndex]);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <View style={styles.topRow}>
        <View style={styles.contactImage} />
        <View style={styles.textWrapper}>
          <Text style={styles.announcementBody} numberOfLines={0}>
            {messages[messageIndex]}
          </Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            disappearAndReplaceMessage();
          }}
        >
          <Text style={styles.buttonText}>Hello</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginLeft: 5 }]}>
          <Text style={styles.buttonText}>Hello</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
