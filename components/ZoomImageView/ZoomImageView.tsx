import React from "react";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";

interface ZoomImageViewProps {
  zoomImage: ImageSource[];
  setZoomImage: React.Dispatch<React.SetStateAction<ImageSource[]>>;
}

export default function ZoomImageView(props: ZoomImageViewProps) {
  const { zoomImage, setZoomImage } = props;

  return (
    <ImageView
      images={zoomImage}
      imageIndex={0}
      visible={true}
      onRequestClose={() => {
        setZoomImage([]);
      }}
    />
  );
}
