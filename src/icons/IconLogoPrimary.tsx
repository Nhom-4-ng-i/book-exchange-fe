import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";



function IconLogoPrimary() { 
    return (
  <Svg
    width={286}
    height={317}
    fill="none"
  >
    <Path
      fill="url(#a)"
      fillOpacity={0.06}
      d="M179.335 316.609s-29.726-77.755 0-107.275c29.519-29.314 106.529 0 106.529 0V106.53c-58.852 0-106.529-47.678-106.529-106.53H76.53s29.417 77.112 0 106.53c-29.418 29.417-106.53 0-106.53 0v102.804c58.852 0 106.53 48.423 106.53 107.275h102.805Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={333}
        x2={78.5}
        y1={-204.695}
        y2={245}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#54408C" stopOpacity={0.7} />
        <Stop offset={0.591} stopColor="#54408C" stopOpacity={0.7} />
        <Stop offset={0.765} stopColor="#54408C" stopOpacity={0.3} />
        <Stop offset={1} stopColor="#54408C" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
)
}
export default IconLogoPrimary
