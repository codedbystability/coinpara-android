import React from "react";
import {  View } from "react-native";
import { LIST_ITEM_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { SvgUri } from "react-native-svg";

const CHART_BASE_URI = "https://minichart.coinpara.com/";
const width = parseInt(SCREEN_WIDTH * 0.3);


class MarketChart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) { // REACT_REDUNDANT_SHOULD_COMPONENT_UPDATE alarm because 'Hello' component extends 'React.PureComponent' but overrides 'shouldComponentUpdate()'.
  //   return nextState.market && nextState.market.to !== this.props.market.to || false;
  // }


  render() {
    const { market } = this.props;
    if (!market || !market.fs)
      return null;
    return (
        <SvgUri
          width={width}
          height={LIST_ITEM_HEIGHT}
          uri={`${CHART_BASE_URI}${market.fs}-${market.to}.svg`}
        />
    );
  }
}

export default MarketChart;

// const styles = {
//   width: width,
//   alignItems: "center",
//   justifyContent: "center",
// };
