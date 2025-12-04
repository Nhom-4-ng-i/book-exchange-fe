import { Image } from "react-native";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";

interface IconEditProps {
  width?: number;
  height?: number;
  color?: string;
}

const IconEdit2 = ({
  width = 12,
  height = 14,
  color = "#000",
}: IconEditProps) => {
  return (
    <Svg width={width} height={height} fill="none">
      <Path fill="url(#a)" d="M0 0h12v14H0z" />
      <Defs>
        <Pattern
          id="a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <Use xlinkHref="#b" transform="matrix(.01 0 0 .00857 0 .071)" />
        </Pattern>
        <Image
          source={{
            uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADJ0lEQVR4nO3dPW7UQBjGcQM5CCAOgETP4Of1VtBaClLEBRCEAgFdUEBiC18DFJJr8NFQAh0nQLRQIDAaYaEA8WY/PONnPM9fmjKZXf8y9jiJ1kWhguac2zKzOYAvAD4B2A47o+qtrutzAJ6bWXts/DSzO/1fpWJiCIUQQyiEGEKJFYCDJTH+oAC4He0F5haAbTP7viqKVkrAzOwWgB+ropRleTPk68o6WwPF36eM/bqTv+mrqur6gCif476D6d2BH3Xn/7tDoAB4FvddTGhra2Yv/tkp7W54oT/yyIO9SDO76H8ayrK8D+BhSsM5d36NlXHS9nV3zZVyOBhGWZYA8HbFHQXTmA+AsQnKMBh7e3tn/TmP4IC2JBjroAy3MoRhm6IcDHqa6nYXuWAcrjHHQpRBy+yacbjBXB7lXlAMvyMhOKjtmqMJ9FvbhaOqqkfBQPz5j+DAtuQr47+VYmY3goD4fTvBwW0TwvB34C8Hvek7npk9JjjALftpKtgdeOIgzaQxEgNpJo+REEiTBUYiIE02GAmANFlhkIM02WEQgzRZYiwD4v9QX5bllVhjNptdnuxN30Ar5H1BWD21lZEySD1VjBRB6iljpAZSTx0jJRDn3Ja/4I55AXfOXQr7LhMBqQlWhpk99ceqyB2k5sHwX5c3SM2FkTdIzYeRNwhGvoD3/J9aviDGtTIEYiNhAHiy4HsJxOKepvZP+Z4CsUgro5vzg0B6io3RzSmQvmJjdHMKpK/YGN2cAukrNkY3p0D6io3RzSmQvmJjdHMKhCmBkCUQsgRClkDIEghZAiFLIGQJhCyBkCUQsgB8FAhRAiFLIGQJhCyBkCUQsgRClkDIEghZAiFLIGQJhCyBkCUQsgRClkDIEghZAiGLAmSJjxr/ambvMhnfFh0LAA+CgyT8Yfxt7AFgJzhI4o+raGOO2Wx2oYgRgDdjv1kjHwBeFbEys2uJP/KoDTz8c22vRgM55fM9NCzC7uqEznQoWin21zOn9v2xKcaqqipnZq8JDkY79jUj+mnqtN2X3+Z19ynzHAZ+P7p1Z5VHtyqllFJKKaWUUkopVUykX0ON/nvRl8fsAAAAAElFTkSuQmCC",
          }}
          id="b"
          width={12}
          height={14}
        />
      </Defs>
    </Svg>
  );
};

export default IconEdit2;
