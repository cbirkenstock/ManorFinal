import { Message } from "../../../../src/models";
import { View, Text } from "react-native";
import CacheImage from "../../../CustomPrimitives/CacheImage";
import Colors from "../../../../constants/Colors";
import { getPrettyUrl } from "../../../../managers/UrlPreviewManager";

interface UrlPreviewProps {
  message: Message;
  isMe: boolean;
  containsMoreThanUrl: boolean;
}

export default function UrlPreview(props: UrlPreviewProps) {
  const { message, isMe, containsMoreThanUrl } = props;

  return (
    <View
      style={{
        width: 250,
        marginBottom: containsMoreThanUrl ? 2 : 0,
        alignSelf: isMe ? "flex-end" : "flex-start",
      }}
    >
      <CacheImage
        needsSigning={false}
        source={message.urlPreviewImageUrl}
        cacheKey={message.urlPreviewImageUrl?.replaceAll("/", ".")}
        style={{
          height: 150,
          backgroundColor: "black",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      />
      <View
        style={{
          backgroundColor: Colors.manorBlueGray,
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: 18,
            marginBottom: 5,
          }}
        >
          {message.urlPreviewTitle}
        </Text>
        <Text numberOfLines={1} style={{ color: Colors.manorDarkWhite }}>
          {getPrettyUrl(message.urlPreviewWebsiteUrl)}
        </Text>
      </View>
    </View>
  );
}
