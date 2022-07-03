import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import EmptyContainer from "../empty-container";
import { DIMENSIONS } from "../../../../utils/dimensions";

class CustomList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();
    this.state = {
      leftActionActivated: false,
      toggle: false,
      refreshing: false,
    };
  }


  layout = (data, index) => ({ length: this.props.itemHeight, offset: this.props.itemHeight * index, index });

  renderEmpty = () => <View style={{
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DIMENSIONS.PADDING_BH * 2,
    minHeight: DIMENSIONS.SCREEN_HEIGHT / 1.4,
  }}>
    <EmptyContainer icon={this.props.iconKey} text={this.props.emptyMessage} />
  </View>;

  scrollTop() {
    this.flatListRef.current.scrollToOffset({ animated: true, offset: this.props.hH || 160 });
  }

  handleRefresh() {
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }

  separator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: this.props.borderGray || "#bdbdbd",
        }}
      />
    );
  };


  render() {
    const {
      data, renderItem,
      onEndReached,
      keyExtractor,
      // emptyMessage,
      ListHeaderComponent,
      ListFooterComponent,
      showFooter = false,
      scrollEnabled = true,
      indicatorColor = "#bdbdbd",
      // iconKey = "empty-face",
      stickyHeaderIndices = [],
      contentStyle = {},
      style = {},
      refreshControl,
      onScrollBeginDrag,
      renderEmpty,
    } = this.props;


    // useEffect(() => {
    //   if (scrollTop) {
    //     this.flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    //   }
    // }, [scrollTop]);


    return (
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEnabled={scrollEnabled}
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
          onScrollBeginDrag={onScrollBeginDrag}
          layout={this.layout}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          rowShouldUpdate={false}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={this.separator}
          ListEmptyComponent={renderEmpty || this.renderEmpty}
          ListFooterComponent={showFooter && <>
            {
              ListFooterComponent ? ListFooterComponent :
                <ActivityIndicator style={{ height: DIMENSIONS.TITLE_FONTSIZE }} color={indicatorColor} />
            }
          </>}
          // ListEmptyComponent={<EmptyContainer icon={this.props.iconKey} text={this.props.emptyMessage} />}
          // ListFooterComponent={ListFooterComponent}

        />
      </View>
    );
  }
}

export default CustomList;
