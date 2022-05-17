import React from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet, Pressable,
} from "react-native";
import { connect } from "react-redux";
import { getLang } from "../../helpers/array-helper";
import { LABEL_HEIGHT, MARGIN_T, PADDING_H } from "../../../utils/dimensions";


const headerRefs = [];

class RealAnimatedTab extends React.PureComponent {
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


  componentDidUpdate(prevProps) {
    //Typical usage, don't forget to compare the props
    if (this.props.activeKey && this.props.activeKey !== prevProps.activeKey) {
      const index = this.props.headers.findIndex(itm => itm.key === this.props.activeKey);
      this.handleSlide(index, this.props.headers[index]).then(r => null);
      // console.log('activeKey - ',this.props.activeKey , '---',prevProps.activeKey)
    }
  }

  handleSlide = async (i, head) => {
    let {
      translateX,
    } = this.state;
    Animated.spring(translateX, {
      toValue: this.getProperState(i),
      useNativeDriver: true,
      friction: 6,
    }).start(() => {
      this.props.onChange(head.key);
    });
  };

  getProperState = (i) => this.state[["xTab" + i]];

  handleDimension = (event, i) => this.setState({ ["xTab" + i]: event.nativeEvent.layout.x });

  render() {
    let { handleDimension } = this;
    let { translateX } = this.state;
    const {
      activeTheme,
      fontSizes,
      language,
      activeKey,
      headers,
      width,
      filled,
    } = this.props;


    return (
      <View style={[styles(activeTheme).wrapper]}>
        <View style={styles(activeTheme).container}>
          <View style={styles(activeTheme).c1}>
            <Animated.View
              style={[styles(activeTheme).cc, {
                width: width,
                transform: [
                  {
                    translateX,
                  },
                ],
              }]}
            />

            {
              headers.map((header, i) => (
                <Pressable
                  onLayout={(event) => handleDimension(event, i)}
                  ref={ref => headerRefs[i] = ref}
                  key={header.key}
                  style={[i === 0 ? styles(activeTheme).first :
                    i === headers.length - 1 ? styles(activeTheme).last :
                      styles(activeTheme).mid, {
                    // backgroundColor: filled ? header.key === activeKey ? activeTheme.inActiveListBg : activeTheme.activeListBg : "transparent",
                  }, {
                    borderBottomWidth: filled ? .5 : header.key === activeKey ? 4 : .5,
                    borderWidth: .5,
                    borderColor: activeTheme.borderGray,
                  }]}
                  onPress={() => this.handleSlide(i, header)}>
                  <Text style={[styles(activeTheme, fontSizes).headerText, {
                    color: activeTheme.appWhite,
                  }]}>
                    {getLang(language, header.title, header.title)}
                  </Text>

                  <View style={{
                    flexDirection: "row",
                    width: "60%",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      backgroundColor: header.colors.bidText,
                    }} />

                    <View style={{
                      width: 16,
                      height: 16,
                      backgroundColor: header.colors.askText,
                    }} />

                  </View>
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

// AnimatedTab.propTypes = {
//   headers: PropTypes.array,
//   activeKey: PropTypes.string,
//   onChange: PropTypes.func,
//   width: PropTypes.string,
// };


export default connect(mapStateToProps, null)(RealAnimatedTab);

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    height: 50,
    marginVertical: MARGIN_T / 4,
    width: "100%",
    zIndex: 1,
    paddingHorizontal: PADDING_H,
  },
  container: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  c1: {
    flexDirection: "row",
    height: 50,
  },
  cc: {
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: props.borderGray,
    borderBottomColor: props.activeListBg,
    // borderRadius: 4,
  },
  first: {
    flex: 1,
    // paddingVertical: PADDING_H / 2,
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
    fontSize: fontSizes?.NORMAL_FONTSIZE - 2,
    marginBottom: PADDING_H / 2,
  },
});
