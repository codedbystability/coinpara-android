import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Platform, Pressable, ActivityIndicator,
} from "react-native";
import SortableList from "react-native-sortable-list";
import { useDispatch, useSelector } from "react-redux";
import { NORMAL_FONTSIZE, PADDING_H, SCREEN_WIDTH, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import DynamicImage from "../../../components/dynamic-image";
import TinyImage from "../../../tiny-image";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import CustomButton from "../../../components/button";
import Loading from "../../../providers/Loading";
import marketServices from "../../../services/market-services";
import { setIsFavorite } from "../../../actions/market-actions";
import LocalStorage from "../../../providers/LocalStorage";
import EmptyContainer from "../../../components/empty-container";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";

const FavSort = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { initialMarkets } = useSelector(state => state.marketReducer);
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [removeds, setRemoveds] = useState([]);
  const [order, setOrder] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        const FavSort = LocalStorage.getObject("FavSort");
        const filtered = initialMarkets.filter(item => item.if === true);

        if (FavSort && FavSort.length >= 1) {
          const firstFiltered = [];
          const matched = filtered.filter(item => FavSort.includes(item.gd));
          for (const marketItemGD of FavSort) {
            const foundItem = matched.find(filtered => filtered.gd === marketItemGD);
            if (foundItem) {
              firstFiltered.push(foundItem);
            }
          }
          const nonMatched = filtered.filter(item => !FavSort.includes(item.gd));
          setData([...firstFiltered, ...nonMatched]);
          setLoading(false);
        } else {
          setData(filtered);
          setOrder(Object.keys(filtered));
          setLoading(false);
        }
      }, 500);
    }
  }, [initialMarkets, isFocused]);


  const handleAction = (item, key, index) => {
    if (key === "fav") {
      removeds.includes(item.gd) ? setRemoveds(removeds.filter(removed => removed !== item.gd)) : setRemoveds([...removeds, item.gd]);
    }
    /*
    else if (key === "up") {

      return;
      if (parseInt(index) === parseInt(order[0])) {
        console.log("en ustteki ");
        return;
      }
      const items = [];
      const newOrder = [];
      for (let i = 0; i < order.length; i++) {
        if (parseInt(order[i]) === parseInt(index)) {
          continue;
        }
        items.push(data[order[i]]);
        newOrder.push(order[i]);
      }
      const newItems = [item, ...items];
      console.log("set data - ", newItems);
      setData(newItems);
      setOrder([index, ...newOrder]);

    }
     */
  };

  const renderRow = ({ data, active, index }) => {
    return <Row
      item={data}
      index={index}
      activeTheme={activeTheme}
      handleAction={handleAction}
      active={active}
      isFav={!removeds.includes(data.gd)}
    />;
  };

  const onChangeOrder = (nextOrder) => setOrder(nextOrder);

  const handleUpdate = () => {
    Loading.show();

    for (let i = 0; i < removeds.length; i++) {
      // console.log("remove - ", removeds[i]);
      marketServices.removeFavorite({ MarketGuid: removeds[i] }).then((response) => {
        if (response && response.IsSuccess) {
          dispatch(setIsFavorite(false, removeds[i]));
        }
      });
    }


    const validOrder = [];
    for (const element of order) { // You can use `let` instead of `const` if you like
      if (data[element] && !removeds.includes(data[element].gd)) {
        console.log("data[element] - ", data[element].to, "-", data[element].fs);
        validOrder.push(data[element].gd);
      }
    }


    console.log("validOrder - ", validOrder);
    LocalStorage.setObject("FavSort", validOrder);


    setTimeout(() => {
      Loading.hide();
      navigation.goBack();
      route.params?.handleRefresh();
    }, 500);
  };

  return (
    <View style={styles(activeTheme).container}>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: getLang(language, "EDIT_FAVORITES", "Edit Favorites"),
        }}
      />
      {
        loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View> :
          data.length >= 1 ?
            <SortableList
              scrollEnabled={scrollEnabled}
              onActivateRow={() => setScrollEnabled(false)}
              onReleaseRow={() => setScrollEnabled(true)}
              style={styles(activeTheme).list}
              contentContainerStyle={styles(activeTheme).contentContainer}
              data={data}
              onChangeOrder={onChangeOrder}
              renderRow={renderRow} /> :

            <View style={{ flex: 1 }}>
              <EmptyContainer icon={"empty-orders"} text={getLang(language, "NO_FAV_FOUND")} />
            </View>
      }

      {
        data.length >= 1 &&
        <CustomButton text={getLang(language, "UPDATE")}
                      onPress={handleUpdate}
                      style={{
                        marginTop: 20,
                        backgroundColor: activeTheme.actionColor,
                      }} />
      }
    </View>
  );
};

export default FavSort;

const Row = ({ active, activeTheme, item, handleAction, isFav, index }) => {
  const _active = new Animated.Value(0);
  const _style = {
    ...Platform.select({
      ios: {
        transform: [{
          scale: _active.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
            useNativeDriver: false,
          }),
        }],
        shadowRadius: _active.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 10],
          useNativeDriver: false,
        }),
      },
      android: {
        transform: [{
          scale: _active.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.07],
            useNativeDriver: false,
          }),
        }],
        elevation: _active.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 6],
          useNativeDriver: false,

        }),
      },
    }),
  };

  // useEffect(() => {
  //   console.log("active - ", active);
  //   if (active) {
  // Animated.timing(_active, {
  //   duration: 300,
  //   easing: Easing.bounce,
  //   toValue: Number(active),
  //   useNativeDriver: false,
  // }).start(active);
  // }
  // }, [active]);
  return (
    <Animated.View style={[
      styles(activeTheme).row,
      _style,
      active && {
        borderColor: activeTheme.appWhite,
      },
    ]}>
      <View style={styles(activeTheme).left}>
        <TinyImage parent={"rest/"} name={isFav ? "tick-active" : "tick"} style={{
          width: 22,
          height: 22,
          marginRight: 12,
        }} />

        <DynamicImage market={item.to} style={styles(activeTheme).image} />
        <View>
          <Text style={styles(activeTheme).text}>{item.to} / {item.fs}</Text>
        </View>
      </View>
      <View style={styles(active).right}>
        <Pressable onPress={() => handleAction(item, "fav", index)}>
          <TinyImage parent={"rest/"} name={isFav ? "fav-active" : "fav"} style={styles(activeTheme).icon} />
        </Pressable>


        {/*<Pressable onPress={() => handleAction(item, "up", index)}>*/}
        {/*  <TinyImage parent={"rest/"} name={"list-up"} style={{*/}
        {/*    width: 22,*/}
        {/*    height: 22,*/}
        {/*  }} />*/}
        {/*</Pressable>*/}


        <Pressable onPress={() => handleAction(item, "up", index)}>
          <TinyImage parent={"rest/"} name={"list-hold"} style={{
            width: 22,
            height: 22,
          }} />
        </Pressable>
      </View>
    </Animated.View>
  );
};


const styles = props => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.backgroundApp,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  left: {
    flexDirection: "row",
    width: "70%",
    height: "100%",
    alignItems: "center",
  },
  right: {
    flexDirection: "row", width: "30%",
    justifyContent: "space-around",
    height: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: TITLE_FONTSIZE,
    paddingVertical: 20,
    color: "#999999",
  },
  list: {
    flex: 1,
  },

  contentContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: PADDING_H,
    paddingBottom: 120,
  },

  row: {
    borderColor: props.borderGray,
    borderWidth: 2,
    marginTop: PADDING_H,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: props.darkBackground,
    padding: PADDING_H,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        width: SCREEN_WIDTH - PADDING_H * 2,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },

      android: {
        width: SCREEN_WIDTH - PADDING_H * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    }),
  },

  image: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  icon: {
    width: 18,
    height: 18,
  },

  text: {
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
  },
  text2: {
    fontSize: NORMAL_FONTSIZE,
    color: props.secondaryText,
  },
});
