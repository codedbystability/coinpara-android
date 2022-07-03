import React from "react";
import PropTypes from "prop-types";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";


const source = "https://images.coinpara.com/files/mobile-assets/";

const TinyImage = props => {
  const { style, name, parent, ...rest } = props;

  const { activeThemeKey } = useSelector(state => state.globalReducer);


  return <FastImage
    source={{
      uri: source + activeThemeKey + "/" + parent + name + ".png",
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    }}
    {...rest}
    resizeMode={"contain"}
    style={style} />;
};


export default React.memo(TinyImage);

TinyImage.propTypes = {
  parent: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
