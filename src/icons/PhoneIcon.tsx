import Svg, { Path } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

function IconPhone({ size = 24, color = "#A6A6A6" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.76587 6.23619C7.76041 8.23018 8.21289 5.92336 9.48282 7.19241C10.7071 8.41638 11.4108 8.6616 9.85962 10.2124C9.66532 10.3685 8.43081 12.2471 4.0923 7.90983C-0.246739 3.572 1.63079 2.33622 1.78698 2.14197C3.34193 0.586923 3.58293 1.29469 4.80725 2.51866C6.07718 3.78825 3.77133 4.24221 5.76587 6.23619Z"
        stroke={color}
        strokeWidth={1.5} // Bạn có thể chỉnh lại 1.5 hoặc 2 cho phù hợp độ dày
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconPhone;