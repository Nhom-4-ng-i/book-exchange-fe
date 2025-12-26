import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
  width?: number;
  height?: number;
}

const IconArrowDown = ({ color = "#9CA3AF", size = 20, ...props }: IconProps) => (
  <Svg
    width={size || props.width}
    height={size || props.height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M7 10L12 15L17 10"
      stroke={color} // Sử dụng màu từ props truyền vào
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconArrowDown;