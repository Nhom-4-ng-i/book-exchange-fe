import { Image } from "react-native";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";

const IconMessenger2 = () => {
  return (
    <Svg width={12} height={14} fill="none">
      <Path fill="url(#a)" d="M0 0h12v14H0z" />
      <Defs>
        <Pattern id="a" patternContentUnits="objectBoundingBox">
          <Use xlinkHref="#b" transform="matrix(.01 0 0 .00857 0 .071)" />
        </Pattern>
        <Image
          source={{
            uri: "data:image/png;base64,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",
          }}
          id="b"
          width={12}
          height={14}
        />
      </Defs>
    </Svg>
  );
};

export default IconMessenger2;
