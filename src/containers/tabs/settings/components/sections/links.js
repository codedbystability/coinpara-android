import React from "react";
import NavigationListItem from "../../../../../components/navigation-list-item";


const LinksSection = (props) => {
  const { statics, isStatic = true, isWrap = false, handleOnPress = null } = props;


  return (
    <>
      {
        statics.map(item => <NavigationListItem isStatic={isStatic}
                                                handleOnPress={handleOnPress}
                                                isWrap={isWrap}
                                                key={item.id || item.Id}
                                                item={item} />)
      }
    </>

  );
};


export default LinksSection;
