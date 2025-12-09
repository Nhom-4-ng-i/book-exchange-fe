import * as React from 'react';
import Svg, {
  Path,
  Defs,
  Pattern,
  Use,
  Image as SvgImage,
} from 'react-native-svg';

type LogoProps = React.ComponentProps<typeof Svg> & {
  size?: number;
};

const TrashIcon: React.FC<LogoProps> = ({ size = 14, ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      accessibilityRole="image"
      {...props}
    >
      <Defs>
        <Pattern
          id="trashPattern"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          {/* react-native-svg dùng href, không dùng xlinkHref */}
          <Use href="#trashImage" transform="scale(.01)" />
        </Pattern>

        <SvgImage
          id="trashImage"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZElEQVR4nO2dQWoUQRiFCy+gO6l/kEAk9XfwArrPUpdeIUsxKxcKZhWy0gPMDXKCsYrCC2QXs9RzZGVLGwJCYFpNd/rV433wdjNDffWtmhmYEIQQQgghhBBC3KKk1VHxeHanpdXR7U8W/0zxeFzc+ol2urRP05RpYygKYIyePsomxS6n+G7KFbf1jDFutp763MNdLN0jZF+9vofL61vYcBdL91AQV5AedQriWFMQx5qCONYUxLEGEaTs2UFJdn6z7HY5fnC7/PM9iMv/47FnBwGNuv/42ZjI8JoATiXxoBGpJB40IpXEg0akknjQiFQSDxqRSuJBI1JJPGhEKonHJCKli4dbH9w8no2d4/qHDVs+o4uHc3vwBPHtX9/mZN/GzjG8Zvs54vHcHhAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgsIhUEg8akUriQSNSSTxoRCqJB41IJfGgEakkHjQilcSDRqSSeITSWRoTKck2d/4rVZ95v8844tFZCuh83dl5NCrCst3dh6EFstv3xS/LZ9+P0ArF7TPAhfVzLnv8FFph89SeFI9XS19amW3xanAMLZFTfEsc5E1okZzsJLv9XP4CbZINLoNTaJkvbq/Gv5toYMkuSmcvAwMfQ3hQOntR3D5c/zU3wHOG/81snd3e5271fHBY+h6FEEIIIYQQIszAL4P73ExAqjcdAAAAAElFTkSuQmCC"
          width={100}
          height={100}
          preserveAspectRatio="none"
        />
      </Defs>

      <Path fill="url(#trashPattern)" d="M0 0h14v14H0z" />
    </Svg>
  );
};

export default React.memo(TrashIcon);
