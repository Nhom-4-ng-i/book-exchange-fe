import { Image } from "react-native";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";

const IconEdit = () => {
  return (
      <Svg
        width={12}
        height={14}
        fill="none"
      >
        <Path fill="url(#a)" d="M0 0h12v14H0z" />
        <Defs>
          <Pattern
            id="a"
            width={1}
            height={1}
            patternContentUnits="objectBoundingBox"
          >
            <Use xlinkHref="#b" transform="matrix(.01 0 0 .00857 0 .071)" />
          </Pattern>
          <Image
            source={{ uri: "data:image/png;base64,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" }}
            id="b"
            width={12}
            height={14}
          />
        </Defs>
      </Svg>
    );
}

export default IconEdit;
