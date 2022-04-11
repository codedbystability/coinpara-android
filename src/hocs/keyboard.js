import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = (e) => setKeyboardHeight(e.endCoordinates.height);
  const onKeyboardDidHide = () => setKeyboardHeight(0);


  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
    Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    return () => {
      Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
      Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    };
  }, []);

  return keyboardHeight;
};


export default useKeyboard;
