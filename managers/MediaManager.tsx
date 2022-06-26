import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Dimensions, Platform } from "react-native";
import { Storage } from "aws-amplify";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../src/models";

export enum PickImageRequestEnum {
  sendChatImage,
  setChatImage,
  setProfileImage,
  setChatUserImage,
}

export type ImageData = {
  fullQualityImageUri: string;
  type: "image" | "video" | undefined;
  uri: string;
  width: number;
  height: number;
  base64?: string | undefined;
};

export const requestCameraPermissions = async () => {
  if (Platform.OS !== "web") {
    const libraryResponse =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
    if (
      libraryResponse.status !== "granted" ||
      photoResponse.status !== "granted"
    ) {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  }
};

const getImageWidthAndQuality = (request: PickImageRequestEnum) => {
  switch (request) {
    case PickImageRequestEnum.sendChatImage:
      return { width: 700, quality: 0.3 };
    case PickImageRequestEnum.setProfileImage:
      return { width: 185, quality: 0.3 };
    case PickImageRequestEnum.setChatImage:
      return { width: 185, quality: 0.3 };
    case PickImageRequestEnum.setChatUserImage:
      return { width: 90, quality: 0.3 };
  }
};

const manipulatePhoto = async (
  metaData: ImagePicker.ImageInfo,
  request: PickImageRequestEnum
) => {
  const manipulatedPhoto = await manipulateAsync(
    metaData.uri,
    [
      {
        resize: {
          width: getImageWidthAndQuality(request).width,
        },
      },
    ],
    {
      compress: getImageWidthAndQuality(request).quality,
      format: SaveFormat.JPEG,
    }
  );

  return manipulatedPhoto;
};

export const pickMedia = async (request: PickImageRequestEnum) => {
  const metaData = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!metaData.cancelled) {
    const type = metaData.type;
    const fullQualityImageUri = metaData.uri;
    try {
      const manipResultMetaData =
        type === "image" ? await manipulatePhoto(metaData, request) : metaData;

      const imageData = {
        ...manipResultMetaData,
        fullQualityImageUri,
        type,
      };

      return imageData;
    } catch (error) {
      alert(error);
    }
  }

  return null;
};

export const fetchMediaBlob = async (imageDataUri: string) => {
  const response = await fetch(imageDataUri);
  const blob = await response.blob();

  return blob;
};

export const uploadMedia = async (
  type: "image" | "video",
  blob: Blob,
  uniqueKey?: string
) => {
  const { key } = await Storage.put(`${uniqueKey ?? uuidv4()}.jpg`, blob, {
    contentType: type,
  });

  return key;
};

export const resizeImage = (message: Message) => {
  const necessaryWidth = 0.75 * Dimensions.get("window").width;

  if (message.imageHeight && message.imageWidth) {
    const necessaryHeight =
      (message.imageHeight * necessaryWidth) / message.imageWidth;

    return { necessaryHeight, necessaryWidth };
  } else {
    const necessaryHeight = 500;

    return { necessaryHeight, necessaryWidth };
  }
};

export const fetchSignedUrl = async (url: string) => {
  const https =
    "https://f2hz7p4po1.execute-api.us-east-1.amazonaws.com/default/ManorSignedURL?" +
    url;

  try {
    const response = await fetch(https);
    const json = await response.json();
    const signedUrl = json.signedURL;
    return signedUrl;
  } catch (error) {
    console.log(error);
  }
};
