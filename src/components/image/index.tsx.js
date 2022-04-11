import React from 'react';
import { Image, ImageProps } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';


interface NImageProps {
  useFastImage: boolean;
}

type Props = ImageProps & NImageProps & FastImageProps;

const NImage = (props: Props) => {
  const { style, useFastImage = true, ...rest } = props;

  if (useFastImage) {
    return <FastImage {...rest} style={style} />;
  }

  return <Image {...rest} style={style} />;
};

export default NImage;
