import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { IconButtonProps } from "../components/IconButton/IconButton";
import Colors from "./Colors";

export const chatFlatlistButtons: (Omit<IconButtonProps, "onPress"> & {
  title: string;
})[] = [
  {
    title: "announcement",
    icon: <Entypo name="pin" size={28} color={"white"} />,
    dimension: 45,
    color: Colors.manorPurple,
  },
  {
    title: "poll",
    icon: <FontAwesome5 name="poll-h" size={28} color={"white"} />,
    dimension: 45,
    color: Colors.manorRed,
  },
  {
    title: "voiceMemo",
    icon: <MaterialCommunityIcons name="waveform" size={32} color={"white"} />,
    dimension: 45,
    color: Colors.manorGreen,
  },
];
