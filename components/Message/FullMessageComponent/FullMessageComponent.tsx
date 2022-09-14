import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import useAppContext from "../../../hooks/useAppContext";
import { Message } from "../../../src/models";
import { styles } from "./styles";
import ContactImage from "../SubComponents/ContactImage";
import ContactNameLabel from "../SubComponents/ContactNameLabel";
import MediaMessage from "../SubComponents/MediaMessage";
import MessageBubble from "../SubComponents/MessageBubble";
import Colors from "../../../constants/Colors";
import IconCounter from "../SubComponents/IconCounter/IconCounter";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import MultiGestureButton from "../../CustomPrimitives/MultiGestureButton";
import { animate } from "../../../managers/AnimationManager";
import * as FileSystem from "expo-file-system";
import UrlPreviewMessage from "../SubComponents/UrlPreviewMessage";
import ResponseMessage from "../SubComponents/ResponseMessage/ResponseMessage";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import EventMessage from "../SubComponents/EventMessage";
import EventSuggestionMessage from "../SubComponents/EventSuggestionMessage/EventSuggestionMessage";
import {
  containsVenmo,
  extractVenmoAmount,
  getVenmoHandle,
  goToVenmo,
} from "../../../managers/VenmoManager";
import TimeCard from "../../TimeCard/TimeCard";

interface FullMessageComponentProps {
  message: Message;
  isPartOfThread?: boolean;
  setZoomImage?: React.Dispatch<React.SetStateAction<ImageSource[]>>;

  setReactionMessageAndYCoordinate?: React.Dispatch<
    React.SetStateAction<
      | {
          yCoordinate: number;
          message: Message;
        }
      | undefined
    >
  >;
  onBackgroundPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export enum ReactionType {
  liked = "liked",
  disliked = "disliked",
}

export default function FullMessageComponent(props: FullMessageComponentProps) {
  const {
    message,
    isPartOfThread = false,
    setZoomImage,
    setReactionMessageAndYCoordinate,
    onBackgroundPress,

    style,
  } = props;
  const { chatUser, members } = useAppContext();

  const isMe = message?.chatuserID === chatUser?.id;

  const venmoHandle = getVenmoHandle(chatUser ?? undefined);
  const containsVenmoKeyword = containsVenmo(message.messageBody ?? "");
  const venmoAmount = extractVenmoAmount(message.messageBody ?? "");

  const isValidVenmoRequest =
    containsVenmoKeyword &&
    venmoAmount !== undefined &&
    venmoHandle !== undefined &&
    !isMe;

  const containsMoreThanUrl =
    (message.messageBody?.split(" ").length ?? 2) >= 2;
  const sender = members.find((member) => member.id === message.chatuserID);
  const isFirstOfGroup = message.marginTop === 10;

  const isLocal = message.imageUrl?.includes("file:///");
  const isImage = message.imageUrl?.split(".")[1] === "jpg";

  const [isTimeStampVisible, setIsTimeStampVisible] = useState<boolean>(false);

  const buttonPositionRef = useRef(null);

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animate(opacityAnim, 1, 300);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 Zoom Image                                 */
  /* -------------------------------------------------------------------------- */

  const getImageCachePath = async () => {
    if (isImage) {
      try {
        if (isLocal) {
          setZoomImage?.([{ uri: message.imageUrl! }]);
        } else {
          const cachePath = `${FileSystem.cacheDirectory}.${message.imageUrl!}`;
          const imageInfo = await FileSystem.getInfoAsync(cachePath);

          if (imageInfo.exists) {
            setZoomImage?.([{ uri: cachePath }]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const multiGestureButtonPressed = () => {
    if (message.imageUrl) {
      getImageCachePath();
    } else if (message.urlPreviewWebsiteUrl) {
      Linking.openURL(message.urlPreviewWebsiteUrl);
    } else if (isValidVenmoRequest && venmoHandle && venmoAmount) {
      goToVenmo(venmoHandle, venmoAmount);
    }
  };

  const getMarginTop = () => {
    const marginTop = message.marginTop ?? 1;
    if (marginTop === 10) {
      return marginTop;
    } else {
      if (message?.likes ?? 0 >= 10) {
        return marginTop + 3;
      } else {
        return marginTop;
      }
    }
  };

  if (message.isEventMessage) {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <EventMessage
          message={message}
          style={{ marginTop: message.marginTop ?? 1 }}
        />
      </Animated.View>
    );
  } else if (message.eventDateTime) {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <EventSuggestionMessage
          message={message}
          style={{ marginTop: message.marginTop ?? 1 }}
        />
      </Animated.View>
    );
  } else if (message.timeCardDateTime) {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <TimeCard
          formattedDate={message.timeCardDateTime}
          isVisible={true}
          style={{ marginTop: 10 }}
        />
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        style={[
          {
            opacity: opacityAnim,
            marginTop: getMarginTop(),
          },
          style,
        ]}
      >
        <Pressable
          style={{ flex: 1, justifyContent: "flex-end" }}
          onPress={() => onBackgroundPress?.()}
        >
          <TimeCard
            date={message.createdAt ?? undefined}
            isVisible={isTimeStampVisible}
          />
          <View
            style={[
              styles.container,
              {
                justifyContent: isMe ? "flex-end" : "flex-start",
              },
            ]}
          >
            {!isMe && (
              <View style={styles.contactImageContainer}>
                {isFirstOfGroup && (
                  <ContactImage sender={sender} style={{ marginTop: 2 }} />
                )}
              </View>
            )}
            <View style={{ maxWidth: "75%" }}>
              {!isMe && isFirstOfGroup && (
                <ContactNameLabel contactName={sender?.nickname} />
              )}

              <View
                style={[
                  {
                    alignSelf: isMe ? "flex-end" : "flex-start",
                  },
                ]}
              >
                <Pressable>
                  <MultiGestureButton
                    onPress={multiGestureButtonPressed}
                    onLongPress={() =>
                      setIsTimeStampVisible(!isTimeStampVisible)
                    }
                    style={(message.likes ?? 0) >= 10 && styles.popularMessage}
                    onDoublePress={() => {
                      if (buttonPositionRef.current) {
                        //@ts-ignore
                        buttonPositionRef.current.measure(
                          (
                            x: number,
                            y: number,
                            width: number,
                            height: number,
                            pageX: number,
                            pageY: number
                          ) => {
                            const messageBottomYCoordinate = pageY + height;
                            const flatListBottomYCoordinate =
                              Dimensions.get("screen").height;

                            const messageInfo = {
                              yCoordinate:
                                flatListBottomYCoordinate -
                                messageBottomYCoordinate,
                              message: message,
                            };

                            setReactionMessageAndYCoordinate?.(messageInfo);
                          }
                        );
                      }
                    }}
                  >
                    <View ref={buttonPositionRef}>
                      {message.replyToMessageID && !isPartOfThread && (
                        <ResponseMessage message={message} isMe={isMe} />
                      )}
                      {message.urlPreviewTitle && (
                        <UrlPreviewMessage
                          message={message}
                          isMe={isMe}
                          containsMoreThanUrl={containsMoreThanUrl}
                        />
                      )}
                      {message.messageBody &&
                        (!message.urlPreviewTitle || containsMoreThanUrl) &&
                        (!message.replyToMessageID || isPartOfThread) && (
                          <MessageBubble
                            message={message}
                            isValidVenmoRequest={isValidVenmoRequest}
                          />
                        )}
                      {message.imageUrl && <MediaMessage message={message} />}
                    </View>
                  </MultiGestureButton>
                </Pressable>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: isMe ? "flex-start" : "flex-end",
                    marginLeft: isMe ? -10 : 0,
                    marginRight: isMe ? 0 : -10,
                  }}
                >
                  {message.likes ? (
                    <Pressable
                      onPress={() => {}}
                      style={[
                        styles.iconCounterContainer,
                        {
                          backgroundColor:
                            (message?.likes ?? 0) >= 10
                              ? Colors.manorGold
                              : isMe
                              ? Colors.manorPurple
                              : Colors.manorBlueGray,
                          // marginRight: messageDislikes ? 5 : 0,
                        },
                      ]}
                    >
                      <IconCounter
                        count={message.likes}
                        side={"left"}
                        icon={
                          <FontAwesome
                            name="heart"
                            size={20}
                            color="white"
                            style={{ marginTop: 3 }}
                          />
                        }
                      />
                    </Pressable>
                  ) : null}
                  {message.dislikes ? (
                    <Pressable
                      onPress={() => {}}
                      style={[
                        styles.iconCounterContainer,
                        {
                          backgroundColor:
                            (message?.likes ?? 0) > 1
                              ? Colors.manorGold
                              : isMe
                              ? Colors.manorPurple
                              : Colors.manorBlueGray,
                        },
                      ]}
                    >
                      <IconCounter
                        count={message.dislikes}
                        side={"left"}
                        icon={
                          <FontAwesome5
                            name="poop"
                            size={20}
                            color="white"
                            style={{ marginTop: 3 }}
                          />
                        }
                      />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
}

export const MemoizedFullMessageComponent = React.memo(
  FullMessageComponent,
  (version1, version2) => {
    if (version1.message.eventTitle) {
      return false;
    } else if (
      version1.message.likes !== version2.message.likes ||
      version1.message.dislikes !== version2.message.dislikes
    ) {
      return false;
    } else {
      return true;
    }
  }
);
