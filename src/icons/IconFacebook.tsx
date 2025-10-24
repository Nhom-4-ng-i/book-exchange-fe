import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

function IconFacebook() {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
        >
            <G clipPath="url(#clip0)">
                <Path
                    d="M20 10.06C20 4.506 15.523 0 10 0 4.477 0 0 4.505 0 10.06c0 5.053 3.657 9.24 8.438 9.94v-7.03H5.898v-2.717h2.54V7.844c0-2.524 1.493-3.918 3.777-3.918 1.094 0 2.238.196 2.238.196v2.46h-1.26c-1.244 0-1.632.777-1.632 1.573v1.876h2.771l-.443 2.717h-2.328V20c4.78-.7 8.437-4.887 8.437-9.94z"
                    fill="#1877F2"
                />
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default IconFacebook;