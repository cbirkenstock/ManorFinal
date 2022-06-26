import React from "react";
import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { InnerContactScreenNavigationProps } from "../../navigation/NavTypes";
import { styles } from "./styles";
import { animate } from "../../managers/AnimationManager";

interface HeaderProps {
  exitViewHeightAnim: Animated.Value;
  exitViewOpacityAnim: Animated.Value;
}

export default function Header(props: HeaderProps) {
  const { exitViewHeightAnim, exitViewOpacityAnim } = props;
  const navigation = useNavigation<InnerContactScreenNavigationProps>();
  const height = Dimensions.get("screen").height;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Messages</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate("ProfileScreen")}>
          <Ionicons name={"person-circle-outline"} size={35} color={"white"} />
        </Pressable>
        <Pressable
          onPress={() => {
            animate(exitViewHeightAnim, height, 0);
            animate(exitViewOpacityAnim, 1, 150);
          }}
        >
          <Octicons name="plus" size={35} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}
