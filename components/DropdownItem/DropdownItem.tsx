import React from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { animate } from "../../managers/AnimationManager";
import { InnerContactScreenNavigationProp } from "../../navigation/NavTypes";
import { styles } from "./styles";

export interface DropdownItemProps {
  tab: {
    caption: string;
    type: string;
  };
  exitViewHeightAnim: Animated.Value;
  exitViewOpacityAnim: Animated.Value;
}

export default function DropdownItem(props: DropdownItemProps) {
  const { tab, exitViewHeightAnim, exitViewOpacityAnim } = props;
  const navigation = useNavigation<InnerContactScreenNavigationProp>();

  const closeContactMenu = () => {
    animate(exitViewHeightAnim, 0, 0);
    animate(exitViewOpacityAnim, 0, 0);
  };

  const toNewDirectMessage = () => {
    closeContactMenu();
    navigation.navigate("UsersScreen", { chatType: "dm" });
  };

  const toNewGroupMessage = () => {
    closeContactMenu();
    navigation.navigate("UsersScreen", { chatType: "group" });
  };

  const dmItem = tab.caption === "New Direct Message";

  return (
    <Pressable onPress={dmItem ? toNewDirectMessage : toNewGroupMessage}>
      <View style={styles.container}>
        {dmItem ? (
          <Feather name={"message-square"} size={31} color="white" />
        ) : (
          <MaterialCommunityIcons
            name={"account-group-outline"}
            size={31}
            color="white"
          />
        )}
        <Text style={styles.text}>{tab.caption}</Text>
      </View>
    </Pressable>
  );
}
