import Svg, { Path } from "react-native-svg";

function IconNotification() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <Path
        stroke="#121212"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.5 16.848c5.64 0 8.248-.724 8.5-3.627 0-2.902-1.819-2.716-1.819-6.276C16.181 4.165 13.545 1 9.5 1S2.819 4.164 2.819 6.945C2.819 10.505 1 10.32 1 13.22c.253 2.915 2.862 3.628 8.5 3.628Z"
        clipRule="evenodd"
      />
      <Path
        stroke="#121212"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.889 19.857c-1.364 1.515-3.492 1.533-4.87 0"
      />
    </Svg>
  );
}

export default IconNotification;
