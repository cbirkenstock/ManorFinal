import React, { useEffect, useState } from "react";
import { Chat, ChatUser } from "../../src/models";
import { ImageStyle, StyleProp, View } from "react-native";
import CacheImage from "../CustomPrimitives/CacheImage/CacheImage";
import { DataStore } from "aws-amplify";
import Avatar from "../Avatar";
import Colors from "../../constants/Colors";

interface DefaultContactImageProps {
  members?: ChatUser[];
  fontSize: number;
}

export default function DefaultContactImage(props: DefaultContactImageProps) {
  const { members, fontSize } = props;

  const membersCount = members?.length;

  const CacheImageOrAvatar = (
    member: ChatUser,
    style: StyleProp<ImageStyle>
  ) => {
    if (member.profileImageUrl) {
      return (
        <CacheImage
          source={member.profileImageUrl}
          cacheKey={member.profileImageUrl}
          style={style}
        />
      );
    } else {
      return (
        <Avatar
          chatUser={member}
          dimensions={0}
          fontSize={fontSize}
          style={[{ backgroundColor: Colors.manorBackgroundGray }, style]}
        />
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  /*
  leaving it as the larger version of the contact image since you stare at this 
  a lot, would actually pick up if the quality was low, and there are only
  at max six photos
  */

  if (!members) {
    return <View />;
  }

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
          {CacheImageOrAvatar(members[0], {
            height: "80%",
            width: "80%",
            borderRadius: 100,
          })}
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
            {CacheImageOrAvatar(members[0], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
              marginLeft: "30%",
              marginTop: "5%",
            })}
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {CacheImageOrAvatar(members[1], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
              marginRight: "30%",
              marginBottom: "5%",
            })}
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
            {CacheImageOrAvatar(members[0], {
              height: "95%",
              width: "40%",
              borderRadius: 100,
              marginTop: "3%",
            })}
          </View>
          <View
            style={{
              flex: 0.6,
              flexDirection: "row",
            }}
          >
            {CacheImageOrAvatar(members[1], {
              height: "65%",
              width: "40%",
              borderRadius: 100,
              marginLeft: "5%",
              marginRight: "10%",
              marginTop: "5%",
            })}
            {CacheImageOrAvatar(members[2], {
              height: "65%",
              width: "40%",
              borderRadius: 100,
              marginTop: "5%",
            })}
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
            {CacheImageOrAvatar(members[0], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
            })}
            {CacheImageOrAvatar(members[1], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
            })}
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {CacheImageOrAvatar(members[2], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
            })}
            {CacheImageOrAvatar(members[3], {
              height: "90%",
              width: "45%",
              borderRadius: 100,
            })}
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
            {CacheImageOrAvatar(members[0], {
              height: "110%",
              width: "37.5%",
              borderRadius: 100,
              marginTop: "2%",
            })}
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
            {CacheImageOrAvatar(members[1], {
              height: "110%",
              width: "36%",
              borderRadius: 100,
              marginBottom: "1%",
            })}
            {CacheImageOrAvatar(members[2], {
              height: "110%",
              width: "36%",
              borderRadius: 100,
              marginBottom: "1%",
            })}
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
            {CacheImageOrAvatar(members[3], {
              height: "110%",
              width: "43%",
              borderRadius: 100,
              marginBottom: "3.5%",
            })}
            {CacheImageOrAvatar(members[4], {
              height: "110%",
              width: "43%",
              borderRadius: 100,
              marginBottom: "3.5%",
            })}
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
            {CacheImageOrAvatar(members[0], {
              height: "110%",
              width: "37.5%",
              borderRadius: 100,
              marginTop: "2%",
            })}
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
            {CacheImageOrAvatar(members[1], {
              height: "110%",
              width: "36%",
              borderRadius: 100,
              marginBottom: "1%",
            })}
            {CacheImageOrAvatar(members[2], {
              height: "110%",
              width: "36%",
              borderRadius: 100,
              marginBottom: "1%",
            })}
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
            {CacheImageOrAvatar(members[3], {
              height: "110%",
              width: "43%",
              borderRadius: 100,
              marginBottom: "3.5%",
            })}

            {CacheImageOrAvatar(members[4], {
              height: "110%",
              width: "43%",
              borderRadius: 100,
              marginBottom: "3.5%",
            })}
          </View>
        </View>
      );
  }
}

const areEqual = (
  props1: DefaultContactImageProps,
  props2: DefaultContactImageProps
) => {
  if (props1.members?.length !== props2.members?.length) return false;

  const length = props1.members?.length;
  const members1 = props1.members?.slice(0, length);
  const members2 = props2.members?.slice(0, length);

  let areEqual = true;

  areEqual =
    members1?.every((member, index) => member.id === members2?.[index].id) ??
    false;

  return areEqual;
};

export const MemoizedDefaultContactImage = React.memo(
  DefaultContactImage,
  areEqual
);
