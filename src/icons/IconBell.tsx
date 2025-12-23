import Svg, { Path } from "react-native-svg";

function IconBell() {
  return (
    <Svg width={143} height={165} fill="none">
      <Path
        stroke="#E8E8E8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={15}
        d="M89.487 148.929c-10.271 11.36-26.294 11.495-36.663 0"
      />
      <Path
        fill="#F5F5F5"
        fillRule="evenodd"
        stroke="#E8E8E8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={15}
        d="M71.5 126.356c42.46 0 62.103-5.426 64-27.203 0-21.763-13.695-20.363-13.695-47.065C121.805 31.23 101.958 7.5 71.5 7.5S21.195 31.23 21.195 52.088C21.195 78.79 7.5 77.39 7.5 99.153c1.905 21.86 21.547 27.203 64 27.203Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default IconBell;
