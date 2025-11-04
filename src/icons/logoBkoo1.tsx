import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type LogoProps = React.ComponentProps<typeof Svg> & {
  size?: number;
};

const LogoBKoo1: React.FC<LogoProps> = ({ size = 44, ...props }) => {
  const width = (158 / 44) * size;
  return (
    <Svg
      width={width}
      height={size}
      viewBox="0 0 158 44"
      fill="none"
      accessibilityRole="image"
      {...props}
    >
      <Path
        fill="#6750A4"
        d="M42.851 40.972s-3.562-9.319 0-12.856c3.538-3.514 12.767 0 12.767 0V15.795c-7.053 0-12.767-5.714-12.767-12.767h-12.32s3.525 9.242 0 12.767c-3.526 3.526-12.767 0-12.767 0v12.32c7.053 0 12.767 5.804 12.767 12.857h12.32Z"
      />
      {/* ... phần path còn lại giữ nguyên ... */}
    </Svg>
  );
};

export default React.memo(LogoBKoo1);
