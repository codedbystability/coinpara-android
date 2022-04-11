import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import EmptyContainer from "../empty-container";
import { LIST_ITEM_HEIGHT, PADDING_BH, SCREEN_HEIGHT } from "../../../utils/dimensions";

class CustomList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();
  }


  getItemLayout = (data, index) => ({ length: this.props.itemHeight, offset: this.props.itemHeight * index, index });

  renderEmpty = () => <View style={{
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: PADDING_BH * 2,
    minHeight: SCREEN_HEIGHT / 1.4,
  }}>
    <EmptyContainer icon={this.props.iconKey} text={this.props.emptyMessage} />
  </View>;


  scrollTop() {
    this.flatListRef.current.scrollToOffset({ animated: true, offset: this.props.hH || 160 });
  }

  render() {
    const {
      data, renderItem,
      onEndReached,
      keyExtractor,
      // emptyMessage,
      ListHeaderComponent,
      ListFooterComponent,
      showFooter = false,
      indicatorColor = "#bdbdbd",
      // iconKey = "empty-face",
      stickyHeaderIndices = [],
      contentStyle = {},
      style = {},
      refreshControl,
    } = this.props;


    // useEffect(() => {
    //   if (scrollTop) {
    //     this.flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    //   }
    // }, [scrollTop]);


    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref={this.flatListRef}
          refreshControl={refreshControl}
          stickyHeaderIndices={stickyHeaderIndices}
          style={style}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps={"always"}
          data={data}
          renderItem={renderItem}
          maxToRenderPerBatch={14}
          updateCellsBatchingPeriod={200}
          initialNumToRender={14}
          onEndReachedThreshold={0.2}
          getItemLayout={this.getItemLayout}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          rowShouldUpdate={false}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          // ListEmptyComponent={<EmptyContainer icon={this.props.iconKey} text={this.props.emptyMessage} />}
          ListEmptyComponent={this.renderEmpty}
          // ListFooterComponent={ListFooterComponent}
          ListFooterComponent={showFooter && <>
          {
            ListFooterComponent?ListFooterComponent:<ActivityIndicator style={{ height: LIST_ITEM_HEIGHT }} color={indicatorColor} />
          }
          </>}
        />
      </View>
    );
  }
}

export default CustomList;
