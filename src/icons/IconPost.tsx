import Svg, { Path } from "react-native-svg";

const IconPost = () => {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
        >
            <Path
                fill="#54408C"
                fillRule="evenodd"
                d="M11.208 4.067h2.559c3.075 0 4.575 1.642 4.566 5.008v4.059c0 3.216-1.983 5.2-5.208 5.2H6.867c-3.209 0-5.2-1.984-5.2-5.209V6.867c0-3.45 1.533-5.2 4.558-5.2h1.317a2.47 2.47 0 0 1 1.975.958l.733.975c.233.292.583.467.958.467Zm-5.067 8.675h7.717a.622.622 0 0 0 .617-.625.617.617 0 0 0-.617-.625H6.141a.619.619 0 0 0-.625.625c0 .342.276.625.625.625Z"
                clipRule="evenodd"
            />
        </Svg>
    );
}

export default IconPost;
