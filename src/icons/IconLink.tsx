import Svg, { Path } from "react-native-svg";

const IconLink = () => {
    return (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={8}
          height={14}
          fill="none"
        >
          <Path
            stroke="#A6A6A6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 1 6 6-6 6"
          />
        </Svg>
    );
}

export default IconLink;
