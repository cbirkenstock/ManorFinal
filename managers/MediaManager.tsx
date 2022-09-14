import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Dimensions, Platform } from "react-native";
import { Storage } from "aws-amplify";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../src/models";

export type CustomImageData = {
  fullQualityImageMetaData: ImagePicker.ImageInfo;
  type: "image" | "video";
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

/* -------------------------------------------------------------------------- */
/*                             Image Manipulation                             */
/* -------------------------------------------------------------------------- */

export enum PickImageRequestEnum {
  sendChatImage,
  setChatImage,
  setProfileImage,
  setChatUserImage,
}

const getImageWidthAndQuality = (request: PickImageRequestEnum) => {
  switch (request) {
    case PickImageRequestEnum.sendChatImage:
      return { width: 700, quality: 0.6 };
    case PickImageRequestEnum.setProfileImage:
      return { width: 300, quality: 0.7 };
    case PickImageRequestEnum.setChatImage:
      return { width: 300, quality: 0.7 };
    case PickImageRequestEnum.setChatUserImage:
      return { width: 200, quality: 0.7 };
  }
};

export const manipulatePhoto = async (
  metaData: ImagePicker.ImageInfo,
  request: PickImageRequestEnum
) => {
  const { width, quality } = getImageWidthAndQuality(request);
  const manipulatedPhoto = await manipulateAsync(
    metaData.uri,
    [
      {
        resize: {
          width: width,
        },
      },
    ],
    {
      compress: quality,
      format: SaveFormat.JPEG,
    }
  );

  return manipulatedPhoto;
};

export const resizeImage = (
  message: Message,
  isImage: boolean,
  width?: number
) => {
  const necessaryWidth = width ? width : 0.75 * Dimensions.get("window").width;

  if (message.imageHeight && message.imageWidth) {
    //video width is sometimes wrong for some reason so this hardcodes it
    const trueWidth =
      message.imageWidth === 3840 && !isImage ? 1215 : message.imageWidth;

    const necessaryHeight = (message.imageHeight * necessaryWidth) / trueWidth;

    return { necessaryHeight, necessaryWidth };
  } else {
    const necessaryHeight = 500;

    return { necessaryHeight, necessaryWidth };
  }
};

/* -------------------------------------------------------------------------- */
/*                                Choose Media                                */
/* -------------------------------------------------------------------------- */

export const pickMedia = async (request: PickImageRequestEnum) => {
  const metaData = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!metaData.cancelled) {
    const type = metaData.type ?? "image";
    const fullQualityImageMetaData = metaData;
    try {
      const manipResultMetaData =
        type === "image" ? await manipulatePhoto(metaData, request) : metaData;

      const imageData = {
        ...manipResultMetaData,
        fullQualityImageMetaData,
        type,
      };

      return imageData;
    } catch (error) {
      alert(error);
    }
  }

  return null;
};

/* -------------------------------------------------------------------------- */
/*                                 Fetch Blob                                 */
/* -------------------------------------------------------------------------- */

export const fetchMediaBlob = async (imageDataUri: string) => {
  const response = await fetch(imageDataUri);
  const blob = await response.blob();

  return blob;
};

/* -------------------------------------------------------------------------- */
/*                                Upload Media                                */
/* -------------------------------------------------------------------------- */

export const uploadMedia = async (
  type: "image" | "video",
  blob: Blob,
  uniqueKey?: string
) => {
  const suffix = type === "image" ? "jpg" : "mp4";
  const { key } = await Storage.put(
    uniqueKey ? uniqueKey : `${uuidv4()}.${suffix}`,
    blob,
    {
      contentType: type,
    }
  );

  return key;
};

/* -------------------------------------------------------------------------- */
/*                              fetch Signed Url                              */
/* -------------------------------------------------------------------------- */

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
