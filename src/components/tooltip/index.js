import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./style";
import type { Step } from "./types";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";

type Props = {
  isFirstStep: boolean,
  isLastStep: boolean,
  handleNext: func,
  handlePrev: func,
  handleStop: func,
  currentStep: Step,
  labels: Object,
};

const Tooltip = ({
                   isFirstStep,
                   isLastStep,
                   handleNext,
                   handlePrev,
                   handleStop,
                   currentStep,
                 }: Props) => {
  const { language } = useSelector(state => state.globalReducer);
  return (
    <View>
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>{currentStep.text}</Text>
      </View>
      <View style={[styles.bottomBar]}>

        {
          !isFirstStep ?
            <TouchableOpacity style={{
              paddingVertical: 10,
              marginRight: 12,

            }} onPress={handlePrev}>
              <Text style={[styles.buttonText]}>{getLang(language, "BACK")}</Text>
            </TouchableOpacity>
            : null
        }
        {
          !isLastStep ?
            <TouchableOpacity style={{
              paddingVertical: 10,
              paddingHorizontal: 6,
            }} onPress={handleNext}>
              <Text style={[styles.buttonText, {
                borderWidth: .4,
                borderColor: "#fff",
                color: "#fff",
                borderRadius: 12,
              }]}>{getLang(language, "NEXT")}</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={{
              paddingVertical: 10,
              position: "absolute",
              right: 0,
            }} onPress={handleStop}>
              <Text style={[styles.buttonText, {
                borderWidth: .4,
                borderRadius: 12,
                borderColor: "rgb(0,122,255)",
                color: "rgb(0,122,255)",
              }]}>{getLang(language, "FINISH")}</Text>
            </TouchableOpacity>


        }

        {
          !isLastStep ?
            <TouchableOpacity style={{
              paddingVertical: 10,
              position: "absolute",
              right: 0,
            }} onPress={handleStop}>
              <Text style={[styles.buttonText, {
                borderWidth: .4,
                borderRadius: 12,
                borderColor: "rgb(0,122,255)",
                color: "rgb(0,122,255)",
              }]}>{getLang(language, "FINISH")}</Text>
            </TouchableOpacity>
            : null
        }
      </View>
    </View>
  );
};

export default Tooltip;
