import * as React from "react";
import { Text, TextProps } from "react-native";

import styles from "./Text.styles";

interface NTextProps {
}

type Props = TextProps & NTextProps;

const NText = (props: Props) => {
  const { style, ...rest } = props;

  return <Text {...rest} style={[styles.container, style]} />;
};

export default NText;
