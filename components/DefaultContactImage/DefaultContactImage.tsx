import React, { useEffect, useState } from "react";
import { Chat, ChatUser } from "../../src/models";
import { View } from "react-native";
import CacheImage from "../CustomPrimitives/CacheImage/CacheImage";
import { DataStore } from "aws-amplify";

interface DefaultContactImageProps {
  members?: ChatUser[];
  chat?: Chat;
}

export default function DefaultContactImage(props: DefaultContactImageProps) {
  const { members, chat } = props;

  const [membersCount, setMembersCount] = useState<number>(0);
  const [formattedMembers, setFormattedMembers] = useState<ChatUser[]>([]);

  useEffect(() => {
    setMembersCount(members?.length ?? 0);
    setFormattedMembers(members ?? []);
  }, [members]);

  /* -------------------------------------------------------------------------- */
  /*                                Fetch Members                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchChatMembers = () => {
      if (chat) {
        DataStore.query(Chat, chat.id)
          .then((coreChat) =>
            DataStore.query(ChatUser, (chatUser) =>
              chatUser.chatID("eq", coreChat?.id ?? "")
            )
          )
          .then((members) => {
            setFormattedMembers(members);
            setMembersCount(members.length);
          });
      }
    };

    fetchChatMembers();
  }, [chat]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  /*
  leaving it as the larger version of the contact image since you stare at this 
  a lot, would actually pick up if the quality was low, and there are only
  at max six photos
  */
  switch (membersCount) {
    case 0:
      return null;
    case 1:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 3,
            marginTop: 3,
          }}
        >
          <CacheImage
            source={formattedMembers[0].profileImageUrl ?? ""}
            cacheKey={formattedMembers[0].id}
            style={{
              height: "60%",
              width: "60%",
              borderRadius: 100,
            }}
          />
        </View>
      );
    case 2:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
            padding: 5,
          }}
        >
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
            }}
          >
            <CacheImage
              source={formattedMembers[0].profileImageUrl ?? ""}
              cacheKey={formattedMembers[0].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
                marginLeft: "30%",
                marginTop: "5%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <CacheImage
              source={formattedMembers[1].profileImageUrl ?? ""}
              cacheKey={formattedMembers[1].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
                marginRight: "30%",
                marginBottom: "5%",
              }}
            />
          </View>
        </View>
      );
    case 3:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
            padding: 5,
          }}
        >
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <CacheImage
              source={formattedMembers[0].profileImageUrl ?? ""}
              cacheKey={formattedMembers[0].id}
              style={{
                height: "95%",
                width: "40%",
                borderRadius: 100,
                marginTop: "3%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.6,
              flexDirection: "row",
            }}
          >
            <CacheImage
              source={formattedMembers[1].profileImageUrl ?? ""}
              cacheKey={formattedMembers[1].id}
              style={{
                height: "65%",
                width: "40%",
                borderRadius: 100,
                marginLeft: "5%",
                marginRight: "10%",
                marginTop: "5%",
              }}
            />
            <CacheImage
              source={formattedMembers[2].profileImageUrl ?? ""}
              cacheKey={formattedMembers[2].id}
              style={{
                height: "65%",
                width: "40%",
                borderRadius: 100,
                marginTop: "5%",
              }}
            />
          </View>
        </View>
      );
    case 4:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
            padding: "8%",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <CacheImage
              source={formattedMembers[0].profileImageUrl ?? ""}
              cacheKey={formattedMembers[0].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
              }}
            />
            <CacheImage
              source={formattedMembers[1].profileImageUrl ?? ""}
              cacheKey={formattedMembers[1].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
              }}
            />
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <CacheImage
              source={formattedMembers[2].profileImageUrl ?? ""}
              cacheKey={formattedMembers[2].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
              }}
            />
            <CacheImage
              source={formattedMembers[3].profileImageUrl ?? ""}
              cacheKey={formattedMembers[3].id}
              style={{
                height: "90%",
                width: "45%",
                borderRadius: 100,
              }}
            />
          </View>
        </View>
      );
    case 5:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 0.3,
              marginHorizontal: "8%",
              marginVertical: "2.5%",
              alignItems: "center",
            }}
          >
            <CacheImage
              source={formattedMembers[0].profileImageUrl ?? ""}
              cacheKey={formattedMembers[0].id}
              style={{
                height: "110%",
                width: "37.5%",
                borderRadius: 100,
                marginTop: "2%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "7.5%",
              marginBottom: "5%",
            }}
          >
            <CacheImage
              source={formattedMembers[1].profileImageUrl ?? ""}
              cacheKey={formattedMembers[1].id}
              style={{
                height: "110%",
                width: "36%",
                borderRadius: 100,
                marginBottom: "1%",
              }}
            />
            <CacheImage
              source={formattedMembers[2].profileImageUrl ?? ""}
              cacheKey={formattedMembers[2].id}
              style={{
                height: "110%",
                width: "36%",
                borderRadius: 100,
                marginBottom: "1%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
              marginHorizontal: "15%",
            }}
          >
            <CacheImage
              source={formattedMembers[3].profileImageUrl ?? ""}
              cacheKey={formattedMembers[3].id}
              style={{
                height: "110%",
                width: "43%",
                borderRadius: 100,
                marginBottom: "3.5%",
              }}
            />
            <CacheImage
              source={formattedMembers[4].profileImageUrl ?? ""}
              cacheKey={formattedMembers[4].id}
              style={{
                height: "110%",
                width: "43%",
                borderRadius: 100,
                marginBottom: "3.5%",
              }}
            />
          </View>
        </View>
      );
    default:
      return (
        <View
          style={{
            height: "95%",
            width: "95%",
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 0.3,
              marginHorizontal: "8%",
              marginVertical: "2.5%",
              alignItems: "center",
            }}
          >
            <CacheImage
              source={formattedMembers[0].profileImageUrl ?? ""}
              cacheKey={formattedMembers[0].id}
              style={{
                height: "110%",
                width: "37.5%",
                borderRadius: 100,
                marginTop: "2%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "7.5%",
              marginBottom: "5%",
            }}
          >
            <CacheImage
              source={formattedMembers[1].profileImageUrl ?? ""}
              cacheKey={formattedMembers[1].id}
              style={{
                height: "110%",
                width: "36%",
                borderRadius: 100,
                marginBottom: "1%",
              }}
            />
            <CacheImage
              source={formattedMembers[2].profileImageUrl ?? ""}
              cacheKey={formattedMembers[2].id}
              style={{
                height: "110%",
                width: "36%",
                borderRadius: 100,
                marginBottom: "1%",
              }}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
              marginHorizontal: "15%",
            }}
          >
            <CacheImage
              source={formattedMembers[3].profileImageUrl ?? ""}
              cacheKey={formattedMembers[3].id}
              style={{
                height: "110%",
                width: "43%",
                borderRadius: 100,
                marginBottom: "3.5%",
              }}
            />
            <CacheImage
              source={formattedMembers[4].profileImageUrl ?? ""}
              cacheKey={formattedMembers[4].id}
              style={{
                height: "110%",
                width: "43%",
                borderRadius: 100,
                marginBottom: "3.5%",
              }}
            />
          </View>
        </View>
      );
  }
}

export const MemoizedDefaultContactImage = React.memo(DefaultContactImage);
