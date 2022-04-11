import React from "react";
import Svg, { Path, G } from "react-native-svg";

function ScanQrSvg(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="260"
      height={props.height || 260}
      viewBox="0 0 414 415"
    >
      <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <Path
          fill="#FFF"
          fillRule="nonzero"
          d="M24.903 88.102H1.934V0H84.24v22.969H24.903v65.133zm387.79 0h-22.969V22.969h-59.336V0h82.305v88.102zm-328.84 326.1H1.548V326.1h22.97v65.133h59.335v22.969zm328.51 0h-82.305v-22.969h59.336V326.1h22.97v88.102zM.243 196.002h413.44v22.969H.243v-22.969z"
        />
      </G>
    </Svg>
  );
}

export default ScanQrSvg;
