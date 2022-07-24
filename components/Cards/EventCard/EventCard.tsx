import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { EventCardBackgrounds } from "../../../constants/EventCardBackgrounds";
import useAppContext from "../../../hooks/useAppContext";
import { getShortenedAddress } from "../../../managers/AddressManager";
import { formatDate, formatTime } from "../../../managers/DateTimeManager";
import { getEventTitle } from "../../../managers/EventManager";
import { InnerEventCardNavigationProps } from "../../../navigation/NavTypes";
import { Message } from "../../../src/models";

interface EventCardProps {
  index: number;
  eventMessage: Message;
}

export default function EventCard(props: EventCardProps) {
  const navigation = useNavigation<InnerEventCardNavigationProps>();
  const { index, eventMessage } = props;
  const { chat } = useAppContext();
  const dateTime = eventMessage.eventDateTime
    ? new Date(eventMessage.eventDateTime)
    : "No Date";
  const location = eventMessage.eventLocation;
  const backgroundImageSource = EventCardBackgrounds[index % 8];

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <ImageBackground
      style={{
        height: 115,
        width: 165,
        marginRight: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
      source={backgroundImageSource}
      resizeMode="cover"
      imageStyle={{ borderRadius: 10, opacity: 0.7 }}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
            {getEventTitle(eventMessage, chat ?? undefined)}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-end", alignItems: "flex-end" }}>
          <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
            {typeof dateTime === "string" ? dateTime : formatDate(dateTime)}
          </Text>
          <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
            {typeof dateTime === "string" ? "" : formatTime(dateTime)}
          </Text>
          {location && (
            <Pressable
              onPress={() =>
                navigation.navigate("GoogleMapsScreen", { link: location })
              }
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                {getShortenedAddress(location)}
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: 0.56 * width,
    alignSelf: "center",
  },

  linearGradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
  },

  monthText: {
    color: "white",
    fontSize: 45,
  },

  dayText: {
    color: "black",
    fontSize: 120,
    fontWeight: "600",
    textAlign: "center",
  },

  timeText: {
    color: "black",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
});
