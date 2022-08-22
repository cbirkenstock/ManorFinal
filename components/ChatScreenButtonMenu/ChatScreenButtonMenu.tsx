import React, { useEffect, useRef } from "react";
import { Animated, Keyboard, Pressable, View } from "react-native";
import CacheImage from "../CustomPrimitives/CacheImage";
import { chatFlatlistButtons } from "../../constants/chatFlatlistButtonData";
import { styles } from "./styles";
import { ChatUser } from "../../src/models";
import { MemoizedDefaultContactImage } from "../DefaultContactImage/DefaultContactImage";
import IconButton, { IconButtonProps } from "../IconButton/IconButton";
import { animate } from "../../managers/AnimationManager";
import useAppContext from "../../hooks/useAppContext";

interface ChatScreenButtonMenuProps {
  contactImageUrl?: string;
  menuFunctions?: (() => any)[];
}
export default function ChatScreenButtonMenu(props: ChatScreenButtonMenuProps) {
  const { members } = useAppContext();
  const { contactImageUrl, menuFunctions } = props;
  const chatFlatlistButtonsHeightAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                              Keyboard Listener                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      animate(chatFlatlistButtonsHeightAnim, 165, 300);
    });
  }, []);

  useEffect(() => {
    Keyboard.addListener("keyboardWillHide", () => {
      animate(chatFlatlistButtonsHeightAnim, 0, 300);
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                       Render FlatList Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderIconButton = ({
    item,
  }: {
    item: Omit<IconButtonProps, "onPress"> & { title: string };
  }) => {
    const { title, icon, color } = item;
    return (
      <IconButton
        style={{ marginBottom: 7.5 }}
        icon={icon}
        padding={8}
        color={color}
        onPress={() => {
          if (title === "announcement") {
            menuFunctions?.[1]();
          }
        }}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.chatFlatlistButtons}>
      <Pressable
        style={styles.ChatInfoButton}
        onPress={() => menuFunctions?.[0]()}
      >
        {contactImageUrl ? (
          <CacheImage
            cacheKey={contactImageUrl}
            source={contactImageUrl}
            style={{ flex: 1 }}
          />
        ) : (
          <MemoizedDefaultContactImage members={members} />
        )}
      </Pressable>
      <Animated.FlatList
        style={{ marginTop: 7.5, height: chatFlatlistButtonsHeightAnim }}
        scrollEnabled={false}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.title}
        data={chatFlatlistButtons}
        renderItem={renderIconButton}
      />
    </View>
  );
}
