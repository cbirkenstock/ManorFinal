import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Colors from "../../../../../constants/Colors";
import { Chat } from "../../../../../src/models";
import { months } from "../../../../../constants/Months";
import { styles } from "./styles";

interface EventMessageProps {
  eventChat: Chat | undefined;
}

export default function EventBox(props: EventMessageProps) {
  const { eventChat } = props;
  const [dateTime, setDateTime] = useState<Date>();

  /* -------------------------------------------------------------------------- */
  /*                               Fetch dateTime                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (eventChat?.eventDateTime) {
      const newDate = new Date(eventChat?.eventDateTime);

      setDateTime(newDate);
    }
  }, [eventChat]);

  /* -------------------------------------------------------------------------- */
  /*                                 Format Time                                */
  /* -------------------------------------------------------------------------- */

  const formatTime = (dateTime?: Date) => {
    if (dateTime) {
      let hours = dateTime.getUTCHours();
      const minutes = dateTime.getUTCMinutes();
      let period = "AM";

      if (hours > 12) {
        hours = hours - 12;
        period = "PM";
      }

      return `${hours}:${minutes} ${period}`;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------- DateIcon -------------------------------- */

  const DateIcon = () => {
    return (
      <View style={styles.dateIconContainer}>
        <LinearGradient
          colors={[Colors.manorPurple, Colors.manorBackgroundGray]}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.dateIconLinearGradient}
        >
          <Text style={styles.dateIconeSmallText}>
            {months[dateTime?.getMonth() ?? 0]}{" "}
          </Text>
          <Text style={styles.dateIconLargeText}>{dateTime?.getDate()}</Text>
          <Text style={styles.dateIconeSmallText}>{formatTime(dateTime)}</Text>
        </LinearGradient>
      </View>
    );
  };

  /* ---------------------------- Event Information --------------------------- */

  const EventInformation = () => {
    return (
      <View
        style={[
          styles.eventInformationContainer,
          {
            justifyContent: eventChat?.eventDescription
              ? "space-between"
              : "center",
          },
        ]}
      >
        <Text style={styles.eventInfoTitleText}>{eventChat?.title}</Text>
        {eventChat?.eventDescription ? (
          <Text style={styles.eventInfoEventDescription}>
            {eventChat?.eventDescription}
          </Text>
        ) : null}
      </View>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <TouchableOpacity>
      <View style={styles.eventBox}>
        <DateIcon />
        <EventInformation />
      </View>
    </TouchableOpacity>
  );
}
