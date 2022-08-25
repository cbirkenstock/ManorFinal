import { View, Text } from "react-native";
import Colors from "../../../../constants/Colors";
import { Message } from "../../../../src/models";
import CacheImage from "../../../CustomPrimitives/CacheImage";

interface ResponseMessageProps {
  message: Message;
  isMe: boolean;
}

export default function ResponseMessage(props: ResponseMessageProps) {
  const { message, isMe } = props;

  return (
    <View
      style={{
        backgroundColor: isMe ? Colors.manorDarkPurple : Colors.manorBlueGray,
        padding: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: isMe ? "rgba(92, 106, 239, 0.5)" : "#535c69",
      }}
    >
      <View
        style={{
          width: message.replyToMessageImageUrl ? 250 : undefined,
          padding: message.replyToMessageImageUrl ? 0 : 5,
          borderRadius: 10,
          borderWidth: message.replyToMessageImageUrl ? 0 : 2,
          borderColor: Colors.manorGreen,
        }}
      >
        <Text
          style={{
            color: Colors.manorDarkWhite,
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          {message.replyToMessageSenderName ?? "Missing Name"}
        </Text>
        {message.replyToMessageImageUrl ? (
          <CacheImage
            source={message.replyToMessageImageUrl}
            cacheKey={message.replyToMessageImageUrl}
            style={{
              marginTop: 5,
              minWidth: "100%",
              height: 350,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 5,
            }}
          />
        ) : (
          <Text
            style={{
              color: "white",
              fontSize: 18,
              marginTop: 5,
            }}
          >
            {message.replyToMessageBody}
          </Text>
        )}
      </View>

      <Text style={{ color: "white", fontSize: 19, marginTop: 10 }}>
        {message.messageBody}
      </Text>
    </View>
  );
}
