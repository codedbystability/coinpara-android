import React from "react";
import NavigationListItem from "../../../../../components/navigation-list-item";


const LinksSection = (props) => {
  const { statics } = props;


  return (
    <>
          {
            statics.map(item => <NavigationListItem isStatic={true} key={item.id}
                                                    item={item} />)
          }
    </>

  );
};


export default LinksSection;
