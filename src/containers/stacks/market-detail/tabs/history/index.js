import React, { useEffect,  useState } from "react";
import { ActivityIndicator, View } from "react-native";
import HistoryContentTabs from "./history-content-tabs";
import HistoryContent from "./history-content";
import { PADDING_H, PADDING_V } from "../../../../../../utils/dimensions";
import { useSelector } from "react-redux";


const HistoryContentIndex = ({ history,tdp,fdp }) => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(history.length <= 0);
  }, [history]);

  return (
    <View style={{ flex: 1, paddingVertical: PADDING_V, paddingHorizontal: PADDING_H}}>

      {
        loading ? <ActivityIndicator color={activeTheme.secondaryText}/> : <>
          <HistoryContentTabs
            {...{
              language,
              activeTheme,
            }} />
          <HistoryContent {...{
            history,
            tdp,
            fdp,
            language,
            activeTheme,
          }} />
        </>
      }

    </View>
  );

};


export default React.memo(HistoryContentIndex);
