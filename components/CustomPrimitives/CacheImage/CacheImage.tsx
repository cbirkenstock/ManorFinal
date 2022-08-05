import React, { useEffect, useState } from "react";
import { Alert, Image, ImageProps, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { fetchSignedUrl } from "../../../managers/MediaManager";

interface CachImageProps extends Omit<ImageProps, "source"> {
  cacheKey: string | undefined | null;
  source: string | undefined | null;
}

export default function CacheImage(props: CachImageProps) {
  const { source, cacheKey, style } = props;
  const [cachePath, setCachePath] = useState<string>("");

  /*
    Checks if image already cached through cachePath 
    If it does then the cachePath is set and the image is rendered
    Else it is cached and then rendered
  */
  useEffect(() => {
    let unmounted = false;

    async function loadImg() {
      if (cacheKey && source) {
        const _cachePath = `${FileSystem.cacheDirectory}.${cacheKey}`;
        const imgInfo = await findImageInCache(_cachePath);
        if (imgInfo.exists) {
          !unmounted && setCachePath(_cachePath);
        } else {
          const signedUrl = await fetchSignedUrl(source);
          const cached = await cacheImage(signedUrl, _cachePath);
          if (cached.path) {
            !unmounted && setCachePath(cached.path);
          } else {
            Alert.alert(`Couldn't load Image!`);
          }
        }
      }
    }

    loadImg();

    return () => {
      unmounted = true;
    };
  }, [source]);

  /*
    Checks if image is in cache and if it is returns info and error=false
    else it returns exists=false and error=true
  */
  async function findImageInCache(uri: string) {
    try {
      let info = await FileSystem.getInfoAsync(uri);
      return { ...info, err: false };
    } catch (error) {
      return {
        exists: false,
        err: true,
        msg: error,
      };
    }
  }

  /*
  creates a resumable object in case caching is interrupted
  takes the signedUrl to download the Image and the cachePath to assign it to 
  returns the cachePath
  */
  async function cacheImage(signedUrl: string, _cachePath: string) {
    try {
      const downloadImage = FileSystem.createDownloadResumable(
        signedUrl,
        _cachePath
      );

      const downloaded = await downloadImage.downloadAsync();
      return {
        cached: true,
        err: false,
        path: downloaded?.uri,
      };
    } catch (error) {
      return {
        cached: false,
        err: true,
        msg: error,
      };
    }
  }

  return (
    <>
      {cachePath ? (
        <Image source={{ uri: cachePath }} style={style} />
      ) : (
        <View style={style} />
      )}
    </>
  );
}
