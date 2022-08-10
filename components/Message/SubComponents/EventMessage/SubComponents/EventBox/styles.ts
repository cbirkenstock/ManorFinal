import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import Colors from "../../../../../../constants/Colors";

const width = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  eventBox: {
    flexDirection: "row",
    alignSelf: "center",
    overflow: "hidden",
    width: 0.9 * width,
    height: 150,
    backgroundColor: Colors.manorBackgroundGray,
    borderRadius: 10,
  },

  dateIconContainer: {
    flex: 0.4,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },

  dateIconLinearGradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
  },

  dateIconSmallText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  dateIconLargeText: {
    color: "white",
    fontSize: 80,
    fontWeight: "500",
    textAlign: "center",
  },

  eventInformationContainer: {
    flex: 0.6,
    alignItems: "flex-start",
    paddingLeft: "5%",
    marginVertical: 25,
  },

  eventInfoTitleText: {
    color: "white",
    fontSize: 25,
    fontWeight: "800",
  },

  eventInfoEventDescription: {
    color: "#E1D9D1",
    fontSize: 18,
    fontWeight: "500",
  },
});
