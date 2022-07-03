/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import generalServices from "../../../services/general-services";
import { DIMENSIONS } from "../../../../utils/dimensions";
import LinksSection from "../../tabs/settings/components/sections/links";
import Loading from "../../../components/page-components/loading";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import FloatingAction from "../../../components/page-components/floating-action";

const AboutInner = (props) => {

  const scrollRef = useRef(null);
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const [loading, setLoading] = useState(true);
  const [statics, setStatics] = useState([]);

  useEffect(() => {
    if (activeLanguage && activeLanguage.Id) {
      generalServices.getStaticContents(activeLanguage.Id).then((response) => {
        if (response && response.IsSuccess) {
          setLoading(false);
          const statics1 = [
            {
              id: 4,
              key: "agreement",
              type: "navigation",
              page: "Static",
              name: "End User License Agreement",
              code: "ff3f0022-2840-45fc-940f-517991439eaf",
              code2: "c1009d89-30fb-452d-a1ed-24484cdce428",
              content: "",
            },
            {
              id: 5,
              key: "privacy",
              type: "navigation",
              page: "Static",
              name: "Privacy Policy",
              code: "c496fa92-7206-4251-af44-b18fd11e216f",
              code2: "0556244d-59c2-4e44-bc87-3908000ed592",
              content: "",
            },
            {
              id: 6,
              key: "terms",
              type: "navigation",
              page: "Static",
              name: "Terms of Service",
              code: "199d9523-4cc2-48da-87c1-92cfeb3852d6",
              code2: "a8a406d5-714b-443f-a331-a78784294e62",
              content: "",
            },
            {
              id: 7,
              key: "about",
              type: "navigation",
              page: "Static",
              name: "About",
              code: "bda816f0-3031-4c6f-bc37-5615ea186080",
              code2: "5f10d2cf-1faa-4bfc-9c07-fc3477e03b79",
              content: "",
            },

            {
              id: 8,
              key: "cookie",
              type: "navigation",
              page: "Static",
              name: "Cookıe Policy",
              code: "af521dda-4d7c-4eba-91fa-446b184a28c2",
              code2: "01df1d7a-01ee-4464-90e7-c7b5df69e8c9",
              content: "",
            },
            {
              id: 9,
              key: "kvkk",
              type: "navigation",
              page: "Static",
              name: "KVKK",
              code: "5025a5b3-083e-4e2f-b551-c769bcdeb84f",
              code2: "a6aced85-e4d6-4e32-8aa9-3ddd05f45786",
              content: "",
            },


          ];
          setStatics(statics1.map(stat => {
            let res;
            if (activeLanguage.Id === 1) {
              res = response.Data.find(itm => itm.ContentCode === stat.code);
            } else {
              res = response.Data.find(itm => itm.ContentCode === stat.code2);
            }
            if (!res) {
              return stat;
            }
            stat["content"] = res.LongDesc;
            stat["Title"] = res.Title;
            return stat;
          }));
        }
      });
    }
  }, [activeTheme, activeLanguage]);


  return (

    <>

      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          title: getLang(language, "ABOUT_US"),
        }}
      />

      <View style={styles(activeTheme).wrapper}>

        {
          loading ? <Loading /> :
            <ScrollView showsVerticalScrollIndicator={false}
                        ref={scrollRef}
                        contentContainerStyle={styles(activeTheme).scroll}>

              <LinksSection statics={statics}/>

            </ScrollView>
        }


      </View>
      <FloatingAction />

    </>

  );
};

const SettingsScreen = styledHigherOrderComponents(AboutInner);

export default SettingsScreen;


const styles = props => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: props.backgroundApp, paddingTop: 12 },
  scroll: { paddingHorizontal: DIMENSIONS.PADDING_H, paddingTop: 12, paddingBottom: 120 },
});
