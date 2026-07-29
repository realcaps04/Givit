import Svg, { Path } from 'react-native-svg';

type ArrowRightProps = {
  color?: string;
  size?: number;
};

export function ArrowRight({ color = '#FFFFFF', size = 16 }: ArrowRightProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
