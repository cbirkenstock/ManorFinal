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
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../../constants/Colors";
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
    <TouchableOpacity
      disabled={!location}
      style={{ marginRight: 10 }}
      onPress={() => {
        if (location) {
          navigation.navigate("GoogleMapsScreen", { link: location });
        }
      }}
    >
      <ImageBackground
        style={{
          height: 115,
          width: 165,

          paddingHorizontal: 10,
          paddingVertical: 5,
          flex: 1,
          justifyContent: "space-between",
        }}
        source={backgroundImageSource}
        resizeMode="cover"
        imageStyle={{
          borderRadius: 10,
          opacity: 0.7,
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
            {typeof dateTime === "string" ? "" : formatTime(dateTime)}
          </Text>
          <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
            {typeof dateTime === "string" ? dateTime : formatDate(dateTime)}
          </Text>
          {location && (
            <Text
              style={{
                color: Colors.manorPaymentBlue,
                fontSize: 15,
                fontWeight: "800",
              }}
            >
              {getShortenedAddress(location)}
            </Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
