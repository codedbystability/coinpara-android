/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import * as React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { MemoizedOrderItem } from "./item";


const renderItem = (item,activeType) => <MemoizedOrderItem
  item={item.item}
  cancelAble={activeType === 'open'}
/>;

const OrderList = (props) => {
  const { data, loading,activeType, onScroll, onEndReached } = props;


  return (

    <View style={{
      paddingTop: 10,
      flex: 1,
    }}>

      <FlatList
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        data={data}
        renderItem={item => renderItem(item,activeType)}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        onEndReached={onEndReached}
        onEndReachedThreshold={0}


        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={null}
            tintColor={"#fff"}
          />
        }


        // ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
        // ListFooterComponent={<Text>LOADING</Text>}
      />
    </View>


  );
};

export const MemoizedOrderList = React.memo(OrderList);

