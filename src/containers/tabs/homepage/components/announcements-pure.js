import React, { useEffect, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import styles from "./styles";
import { useSelector } from "react-redux";
import userServices from "../../../../services/user-services";
import { navigationRef } from "../../../../providers/RootNavigation";
import * as Animatable from "react-native-animatable";
import { getLang } from "../../../../helpers/array-helper";
import TinyImage from "../../../../tiny-image";
import { useIsFocused } from "@react-navigation/native";


const Announcements2 = () => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const [words, setWords] = useState([]);
  const [theWord, setTheWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const savedCallback = useRef(null);
  const textRef = useRef(null);
  const isFocused = useIsFocused();


  useEffect(() => {
    if (!loading && isFocused && activeLanguage.Id) {
      setWords([]);
      setLoading(true);
      userServices.getAnnouncements(activeLanguage.Id).then((response) => {
        if (response.IsSuccess) {
          setTotal(response.Data.length);
          setWords(response.Data.map(o => o["Title"]));
          setLoading(false);
        }
      });
    }
  }, [isFocused, activeLanguage]);


  useEffect(() => {
    if (theWord) {
      textRef.current?.animate({ 0: { opacity: 0 }, 1: { opacity: 1 } });
    }
  }, [theWord]);


  function callback() {
    const nww = index + 1 >= total ? 0 : index + 1;
    setIndex(nww);
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (words.length >= 1) {
      function tick() {
        savedCallback.current();
      }

      tick();

      let id = setInterval(tick, 6000);
      return () => {
        clearInterval(id);
      };
    }
  }, [words]);


  useEffect(() => {
    setTheWord(words[index]);
  }, [index]);

  const handleAnnouncement = () => navigationRef.current.navigate("Notifications", { type: "announcements" });

  if (loading || !theWord)
    return null;

  return (

    <Pressable onPress={handleAnnouncement}
               style={styles(activeTheme).annWrapper}>
      <View style={styles(activeTheme).annIcon}>
        <TinyImage style={styles(activeLanguage).iconA}
                   parent={"rest/"} name={"announcements"} />
      </View>
      <View style={{ width: "90%" }}>
        <Animatable.Text
          ref={textRef}
          numberOfLines={2}
          style={styles(activeTheme).txtA}>

          {
            theWord
          }
        </Animatable.Text>
      </View>
    </Pressable>

  );
};


export default React.memo(Announcements2);
