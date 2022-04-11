import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: animateTransform */

const LoadingSvg = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={50} height={36} {...props}>
    <G fill="#fff">
      <Path d="M4.54 4.846V.906a.674.674 0 0 0-1.348 0v3.94H.674A.672.672 0 0 0 0 5.52v15.039c0 .372.301.673.674.673h2.518v13.446a.673.673 0 0 0 1.346 0V21.232h2.519a.672.672 0 0 0 .672-.673V5.519a.674.674 0 0 0-.672-.673H4.539Z"></Path>
      <Path d="M35.131 4.846h-2.518V.906a.674.674 0 1 0-1.347 0v3.94h-2.518a.672.672 0 0 0-.674.674v15.039c0 .372.302.673.674.673h2.518v13.446a.673.673 0 1 0 1.346 0V21.232h2.52a.672.672 0 0 0 .671-.673V5.519a.674.674 0 0 0-.672-.673Z"></Path>
      <Path d="M21.252 12.386h-2.516v-7.14a.673.673 0 0 0-1.346 0v7.14h-2.52a.672.672 0 0 0-.673.674v10.89c0 .374.301.673.673.673h2.518v5.773a.673.673 0 0 0 1.346 0v-5.773h2.52a.672.672 0 0 0 .672-.672V13.06a.672.672 0 0 0-.672-.674h-.002Z"></Path>
      <Path d="M49.326 12.386H46.81v-7.14a.673.673 0 1 0-1.346 0v7.14h-2.52a.672.672 0 0 0-.673.674v10.89c0 .374.301.673.674.673h2.517v5.773a.673.673 0 0 0 1.346 0v-5.773h2.52a.672.672 0 0 0 .672-.672V13.06a.672.672 0 0 0-.672-.674h-.002Z"></Path>
    </G>
  </Svg>
)

export default LoadingSvg
