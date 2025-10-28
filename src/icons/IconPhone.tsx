import Svg, { Path } from "react-native-svg";

function IconPhone() {
    return (
        <Svg
            width={21}
            height={21}
            fill="none"
        >
            <Path
                stroke="#54408C"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.032 10.973c3.989 3.987 4.894-.626 7.434 1.912 2.448 2.448 3.856 2.938.753 6.04-.388.312-2.857 4.07-11.534-4.605C-1.993 5.644 1.762 3.173 2.074 2.784c3.11-3.11 3.592-1.694 6.04.754 2.54 2.539-2.071 3.447 1.918 7.435Z"
                clipRule="evenodd"
            />
        </Svg>
    );
}

export default IconPhone;
