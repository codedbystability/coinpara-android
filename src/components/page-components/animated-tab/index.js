import React from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet, Pressable,
} from "react-native";
import { connect } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";
import HapticProvider from "../../../providers/HapticProvider";


const headerRefs = [];

class AnimatedTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      translateX: new Animated.Value(0),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.activeKey) {
        const index = this.props.headers.findIndex(itm => itm && "key" in itm && itm.key === this.props.activeKey);
        if (index > 0) {
          this.handleSlide(index, this.props.headers[index]).then(r => null);
        }
      }
    }, 1000);
  }

  handleSlide = async (i, head) => {
    HapticProvider.trigger();
    this.props.onChange(head);
  };

  getProperState = (i) => this.state[["xTab" + i]];

  // handleDimension = (event, i) => this.setState({ ["xTab" + i]: event.nativeEvent.layout.x });

  render() {
    // let { handleDimension } = this;
    // let { translateX } = this.state;
    const {
      activeTheme,
      fontSizes,
      language,
      activeKey,
      headers,
      // width,
      filled,
      cd,
      isBig,
      // cLength = null,
      // oLength = null,
    } = this.props;

    // const isBigTitle = headers.length <= 4;

    return (
      <View style={[styles(activeTheme).wrapper]}>
        <View style={styles(activeTheme).container}>
          <View style={styles(activeTheme, filled).c1}>
            {/*<Animated.View*/}
            {/*  style={[styles(activeTheme, filled).cc, {*/}
            {/*    width: width,*/}
            {/*    transform: [*/}
            {/*      {*/}
            {/*        translateX,*/}
            {/*      },*/}
            {/*    ],*/}
            {/*  }]}*/}
            {/*/>*/}

            {
              headers.map((header, i) => (
                <Pressable
                  // onLayout={(event) => handleDimension(event, i)}
                  ref={ref => headerRefs[i] = ref}
                  key={header.key}
                  style={[i === 0 ? styles(activeTheme, filled).first :
                    i === headers.length - 1 ? styles(activeTheme, filled).last :
                      styles(activeTheme, filled).mid, {
                    backgroundColor: filled ? header.key === activeKey ? activeTheme.inActiveListBg : activeTheme.activeListBg : "transparent",
                  }, {
                    borderBottomWidth: filled ? .5 : header.key === activeKey ? 4 : .5,
                    borderWidth: filled ? .5 : 0,
                    borderColor: filled ? activeTheme.activeListBg : activeTheme.inActiveListBg,
                  }]}
                  onPress={() => this.handleSlide(i, header)}>
                  <Text style={[styles(activeTheme, fontSizes, filled).headerText, {
                    color: activeTheme.appWhite,
                  }]}>
                    {" "}
                    {isBig ? getLang(language, header.title).toUpperCase() : getLang(language, header.title)}

                  </Text>
                </Pressable>
              ))
            }

          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeTheme: state.globalReducer.activeTheme,
    fontSizes: state.globalReducer.fontSizes,
    language: state.globalReducer.language,
    authenticated: state.authenticationReducer.authenticated,
  };
}


export default connect(mapStateToProps, null)(AnimatedTab);

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    height: DIMENSIONS.LABEL_HEIGHT + 2,
    marginVertical: DIMENSIONS.MARGIN_T / 4,
    width: "100%",
  },
  container: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  c1: {
    flexDirection: "row",
    height: DIMENSIONS.LABEL_HEIGHT + 2,

  },
  first: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  last: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  mid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
  },
});
