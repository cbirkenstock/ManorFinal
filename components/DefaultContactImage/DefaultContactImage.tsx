import React from "react";
import { ChatUser } from "../../src/models";
import { View } from "react-native";
import CacheImage from "../CacheImage/CacheImage";

interface DefaultContactImageProps {
  members: ChatUser[];
}

export default function DefaultContactImage(props: DefaultContactImageProps) {
  const { members } = props;
  const membersCount = members.length;
  const formattedMembers = members;

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
