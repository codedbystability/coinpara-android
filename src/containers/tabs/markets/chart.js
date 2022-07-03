import React from "react";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { SvgUri } from "react-native-svg";

const CHART_BASE_URI = "https://minichart.coinpara.com/";
const width = parseInt(DIMENSIONS.SCREEN_WIDTH * 0.3);


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
          height={DIMENSIONS.LIST_ITEM_HEIGHT}
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
