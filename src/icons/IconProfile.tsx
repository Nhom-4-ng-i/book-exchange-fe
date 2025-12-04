import { FC } from "react";
import Svg, { Path } from "react-native-svg";

interface IconHomeProps {
  color?: string;
  size?: number;
}

const IconProfile: FC<IconHomeProps> = ({ color = "#A6A6A6", size = 24 }) => {
    return (
        <Svg
            width={size}
            height={size}
            fill="none"
        >
            <Path
                fill={color}
                d="M12 15.174c4.338 0 8 .705 8 3.425C20 21.319 16.315 22 12 22c-4.338 0-8-.705-8-3.425 0-2.72 3.685-3.401 8-3.401ZM12 2a5.273 5.273 0 0 1 5.294 5.291A5.274 5.274 0 0 1 12 12.583a5.275 5.275 0 0 1-5.294-5.292A5.274 5.274 0 0 1 12 2Z"
            />
        </Svg>
    );
}

export default IconProfile;
