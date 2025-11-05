import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

function IconSearch() {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
        >
            <G
                stroke="#121212"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                clipPath="url(#a)"
            >
                <Path d="M11.55 20.1a8.55 8.55 0 1 0 0-17.1 8.55 8.55 0 0 0 0 17.1ZM21 21l-1.8-1.8" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h24v24H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default IconSearch;
