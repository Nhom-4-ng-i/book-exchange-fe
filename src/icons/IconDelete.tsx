import { Image } from "react-native";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";

const IconDelete = () => {
  return (
    <Svg width={12} height={14} fill="none">
      <Path fill="url(#a)" d="M0 0h12v14H0z" />
      <Defs>
        <Pattern id="a" patternContentUnits="objectBoundingBox">
          <Use xlinkHref="#b" transform="matrix(.01 0 0 .00857 0 .071)" />
        </Pattern>
        <Image
          source={{
            uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZElEQVR4nO2dQWoUQRiFCy+gO6l/kEAk9XfwArrPUpdeIUsxKxcKZhWy0gPMDXKCsYrCC2QXs9RzZGVLGwJCYFpNd/rV433wdjNDffWtmhmYEIQQQgghhBBC3KKk1VHxeHanpdXR7U8W/0zxeFzc+ol2urRP05RpYygKYIyePsomxS6n+G7KFbf1jDFutp763MNdLN0jZF+9vofL61vYcBdL91AQV5AedQriWFMQx5qCONYUxLEGEaTs2UFJdn6z7HY5fnC7/PM9iMv/47FnBwGNuv/42ZjI8JoATiXxoBGpJB40IpXEg0akknjQiFQSDxqRSuJBI1JJPGhEKonHJCKli4dbH9w8no2d4/qHDVs+o4uHc3vwBPHtX9/mZN/GzjG8Zvs54vHcHhAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgKAgYCgKGgoChIGAoCBgKAoaCgKEgYCgIGAoChoKAoSBgsIhUEg8akUriQSNSSTxoRCqJB41IJfGgEakkHjQilcSDRqSSeITSWRoTKck2d/4rVZ95v8844tFZCuh83dl5NCrCst3dh6EFstv3xS/LZ9+P0ArF7TPAhfVzLnv8FFph89SeFI9XS19amW3xanAMLZFTfEsc5E1okZzsJLv9XP4CbZINLoNTaJkvbq/Gv5toYMkuSmcvAwMfQ3hQOntR3D5c/zU3wHOG/81snd3e5271fHBY+h6FEEIIIYQQIszAL4P73ExAqjcdAAAAAElFTkSuQmCC",
          }}
          id="b"
          width={12}
          height={14}
        />
      </Defs>
    </Svg>
  );
};

export default IconDelete;
