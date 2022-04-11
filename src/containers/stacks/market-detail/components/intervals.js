import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { TITLE_FONTSIZE } from "../../../../../utils/dimensions";
import { intervals } from "../constants";
import { getLang } from "../../../../helpers/array-helper";
import TinyImage from "../../../../tiny-image";


const ChartIntervals = ({
                          activeInterval,
                          fullscreen,
                          setFullscreen,
                          activeChart,
                          setActiveChart,
                          setActiveInterval,
                        }) => {
  const scrollRef = useRef(null);

  const { activeTheme, language } = useSelector(state => state.globalReducer);


  const setActiveInterval2 = (val, i) => {
    setActiveInterval(val);
    scrollRef.current.scrollTo({ x: (i - 1) * 40, y: 0, animated: true });
  };
  return (

    <View style={styles(activeTheme).container}>

      <ScrollView
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "76%" }}
        contentContainerStyle={styles(activeTheme).scroll}>

        {
          intervals.map((interval, i) => {
            return (
              <TouchableOpacity
                key={interval.value}
                onPress={() => setActiveInterval2(interval.value, i)}
                style={[styles(activeTheme).activeContainer, {
                  backgroundColor: interval.value === activeInterval ? activeTheme.backgroundApp : "transparent",
                }]}>
                <Text style={[{
                  color: activeTheme.appWhite,
                  fontSize: interval.value === activeInterval ? TITLE_FONTSIZE : TITLE_FONTSIZE - 1,
                  fontFamily: interval.value === activeInterval ? "CircularStd-Bold" : "CircularStd-Book",
                }]}>{getLang(language, interval.title)}</Text>
              </TouchableOpacity>

            );
          })
        }

      </ScrollView>

      <View style={styles(activeTheme).typeWrapper}>


        {
          activeChart === "candle" ? <TouchableOpacity
              activeOpacity={.8}
              onPress={() => setActiveChart("area")}
              style={styles(activeTheme).itemContainer}>
              <TinyImage parent={"rest/"} name={"area-chart"} style={styles(activeTheme).icon} />
            </TouchableOpacity>
            :
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => setActiveChart("candle")}
              style={styles(activeTheme).itemContainer}>
              <TinyImage parent={"rest/"} name={"candle-chart"} style={styles(activeTheme).icon} />
            </TouchableOpacity>

        }


        <TouchableOpacity activeOpacity={.8}
                          onPress={setFullscreen}
                          style={styles(activeTheme).itemContainer}>

          <TinyImage parent={"rest/"} name={"fullscreen"} style={styles(activeTheme).icon} />

        </TouchableOpacity>

      </View>
    </View>


  );

};


export default React.memo(ChartIntervals);

const styles = (props) => StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
  },
  container: {
    // paddingVertical: 6,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height:'10%'
  },
  scroll: {
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 8,
  },
  activeContainer: {
    marginRight: 12,
    backgroundColor: props.appwhite,
    borderRadius: 6,
    height: 24,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  typeWrapper: {
    height: "100%",
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 4,
  },
  itemContainer: {
    width: "50%",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 5,
  },
  image: {
    height: 24,
    width: 24,

  },


});
