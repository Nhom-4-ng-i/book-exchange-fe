import Svg, { Path } from "react-native-svg";

function IconBack() {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
        >
            <Path
                stroke="#121212"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={2}
                d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67"
            />
        </Svg>
    );
}

export default IconBack;
