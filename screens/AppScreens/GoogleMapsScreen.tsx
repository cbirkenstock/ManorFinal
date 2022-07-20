import React from "react";
import { WebView } from "react-native-webview";
import { GoogleMapsScreenProps } from "../../navigation/NavTypes";
import useAppContext from "../../hooks/useAppContext";
import {
  getHumanFormattedAddress,
  getGoogleFormattedAddress,
  addressContainsTitle,
} from "../../managers/AddressManager";

export default function GoogleMapsScreen({
  route,
  navigation,
}: GoogleMapsScreenProps) {
  const { setEventLocation, setIsForwardingEvent } = useAppContext();
  const { link } = route.params;

  /* -------------------------------------------------------------------------- */
  /*                             Address Formatting                             */
  /* -------------------------------------------------------------------------- */

  /* checks for "+" to make sure the new url contains address, then 
  formats address, then updates location and goes back to modal*/
  const updateEventLocation = (newAddress: string) => {
    if (newAddress.includes("+") && !route.params?.link) {
      const address = getHumanFormattedAddress(newAddress);
      setEventLocation(address);
      setIsForwardingEvent(true);
      navigation.goBack();
    }
  };

  /* requires formatting if address has official name in front of number 
  address like restaurant name or something */
  const formattedAddress = () => {
    if (link) {
      if (addressContainsTitle(link)) {
        return getGoogleFormattedAddress(link);
      } else {
        return link;
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <WebView
      source={{
        uri: "https://www.google.com/maps/place/" + formattedAddress(),
      }}
      onNavigationStateChange={(state) => {
        updateEventLocation(state.url);
      }}
      forceDarkOn={true}
    />
  );
}
