import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';

type CountryFlagProps = {
  code: string;
  width?: number;
  height?: number;
};

/** Realistic SVG country flags for the phone picker */
export function CountryFlag({ code, width = 24, height = 16 }: CountryFlagProps) {
  const upper = code.toUpperCase();
  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 60 40">
        {renderFlag(upper)}
      </Svg>
    </View>
  );
}

function renderFlag(code: string) {
  switch (code) {
    case 'IN':
      return (
        <>
          <Rect width="60" height="13.33" fill="#FF9933" />
          <Rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
          <Rect y="26.67" width="60" height="13.33" fill="#138808" />
          <Circle cx="30" cy="20" r="5.2" stroke="#000080" strokeWidth="1.2" fill="none" />
          <Circle cx="30" cy="20" r="1" fill="#000080" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <Line
                key={i}
                x1={30}
                y1={20}
                x2={30 + Math.cos(a) * 5}
                y2={20 + Math.sin(a) * 5}
                stroke="#000080"
                strokeWidth="0.6"
              />
            );
          })}
        </>
      );
    case 'US':
      return (
        <>
          {Array.from({ length: 13 }).map((_, i) => (
            <Rect
              key={i}
              y={i * (40 / 13)}
              width="60"
              height={40 / 13}
              fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'}
            />
          ))}
          <Rect width="24" height="21.5" fill="#3C3B6E" />
        </>
      );
    case 'GB':
      return (
        <>
          <Rect width="60" height="40" fill="#012169" />
          <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="8" />
          <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
          <Path d="M30 0 V40 M0 20 H60" stroke="#FFFFFF" strokeWidth="12" />
          <Path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
        </>
      );
    case 'AE':
      return (
        <>
          <Rect width="60" height="40" fill="#00732F" />
          <Rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
          <Rect y="26.67" width="60" height="13.33" fill="#000000" />
          <Rect width="16" height="40" fill="#FF0000" />
        </>
      );
    case 'AU':
      return (
        <>
          <Rect width="60" height="40" fill="#00008B" />
          <G transform="scale(0.45)">
            <Rect width="60" height="40" fill="#012169" />
            <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="8" />
            <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
            <Path d="M30 0 V40 M0 20 H60" stroke="#FFFFFF" strokeWidth="12" />
            <Path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
          </G>
          <Circle cx="42" cy="22" r="2.2" fill="#FFFFFF" />
          <Circle cx="48" cy="28" r="1.4" fill="#FFFFFF" />
          <Circle cx="36" cy="30" r="1.2" fill="#FFFFFF" />
          <Circle cx="52" cy="18" r="1.1" fill="#FFFFFF" />
          <Circle cx="44" cy="34" r="1" fill="#FFFFFF" />
        </>
      );
    case 'CA':
      return (
        <>
          <Rect width="60" height="40" fill="#FFFFFF" />
          <Rect width="15" height="40" fill="#FF0000" />
          <Rect x="45" width="15" height="40" fill="#FF0000" />
          <Polygon
            points="30,8 32,16 40,16 34,21 36,29 30,24 24,29 26,21 20,16 28,16"
            fill="#FF0000"
          />
        </>
      );
    case 'SG':
      return (
        <>
          <Rect width="60" height="20" fill="#EF3340" />
          <Rect y="20" width="60" height="20" fill="#FFFFFF" />
          <Circle cx="14" cy="10" r="6" fill="#FFFFFF" />
          <Circle cx="16.5" cy="10" r="5" fill="#EF3340" />
        </>
      );
    case 'DE':
      return (
        <>
          <Rect width="60" height="13.33" fill="#000000" />
          <Rect y="13.33" width="60" height="13.34" fill="#DD0000" />
          <Rect y="26.67" width="60" height="13.33" fill="#FFCE00" />
        </>
      );
    case 'FR':
      return (
        <>
          <Rect width="20" height="40" fill="#002395" />
          <Rect x="20" width="20" height="40" fill="#FFFFFF" />
          <Rect x="40" width="20" height="40" fill="#ED2939" />
        </>
      );
    case 'JP':
      return (
        <>
          <Rect width="60" height="40" fill="#FFFFFF" />
          <Circle cx="30" cy="20" r="9" fill="#BC002D" />
        </>
      );
    case 'KR':
      return (
        <>
          <Rect width="60" height="40" fill="#FFFFFF" />
          <Circle cx="30" cy="20" r="8" fill="#CD2E3A" />
          <Path d="M22 20 a8 8 0 0 1 16 0" fill="#0047A0" />
          <Circle cx="30" cy="16" r="4" fill="#CD2E3A" />
          <Circle cx="30" cy="24" r="4" fill="#0047A0" />
        </>
      );
    case 'SA':
      return (
        <>
          <Rect width="60" height="40" fill="#006C35" />
          <Rect x="42" y="10" width="2.5" height="20" fill="#FFFFFF" />
          <Path
            d="M12 18 h24 M12 22 h18"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case 'PK':
      return (
        <>
          <Rect width="60" height="40" fill="#01411C" />
          <Rect width="15" height="40" fill="#FFFFFF" />
          <Circle cx="36" cy="20" r="8" fill="#FFFFFF" />
          <Circle cx="39" cy="18" r="6.5" fill="#01411C" />
          <Polygon points="44,12 45.5,15.5 49,15.5 46.2,17.7 47.3,21 44,19 40.7,21 41.8,17.7 39,15.5 42.5,15.5" fill="#FFFFFF" />
        </>
      );
    case 'BD':
      return (
        <>
          <Rect width="60" height="40" fill="#006A4E" />
          <Circle cx="26" cy="20" r="10" fill="#F42A41" />
        </>
      );
    case 'LK':
      return (
        <>
          <Rect width="60" height="40" fill="#FFB719" />
          <Rect width="10" height="40" fill="#00534E" />
          <Rect x="10" width="8" height="40" fill="#DF7400" />
          <Rect x="22" y="4" width="34" height="32" fill="#8D153A" rx="2" />
        </>
      );
    case 'NP':
      return (
        <>
          <Defs>
            <ClipPath id="np">
              <Path d="M2 2 L38 20 L2 38 Z" />
            </ClipPath>
          </Defs>
          <Rect width="60" height="40" fill="#FFFFFF" />
          <Path d="M4 4 L36 20 L4 36 Z" fill="#003893" />
          <Path d="M6 6 L32 20 L6 34 Z" fill="#DC143C" clipPath="url(#np)" />
          <Circle cx="14" cy="14" r="3" fill="#FFFFFF" />
          <Circle cx="14" cy="26" r="3.5" fill="#FFFFFF" />
        </>
      );
    case 'MY':
      return (
        <>
          {Array.from({ length: 14 }).map((_, i) => (
            <Rect
              key={i}
              y={i * (40 / 14)}
              width="60"
              height={40 / 14 + 0.2}
              fill={i % 2 === 0 ? '#CC0001' : '#FFFFFF'}
            />
          ))}
          <Rect width="30" height="20" fill="#010066" />
          <Circle cx="15" cy="10" r="5.5" fill="#FFCC00" />
          <Circle cx="17" cy="10" r="4.5" fill="#010066" />
        </>
      );
    case 'NZ':
      return (
        <>
          <Rect width="60" height="40" fill="#00247D" />
          <G transform="scale(0.45)">
            <Rect width="60" height="40" fill="#012169" />
            <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="8" />
            <Path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
            <Path d="M30 0 V40 M0 20 H60" stroke="#FFFFFF" strokeWidth="12" />
            <Path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
          </G>
          <Polygon points="42,14 43.2,17 46.5,17 43.9,18.9 44.9,22 42,20.2 39.1,22 40.1,18.9 37.5,17 40.8,17" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.4" />
          <Polygon points="50,20 51,22.2 53.4,22.2 51.5,23.5 52.2,25.7 50,24.5 47.8,25.7 48.5,23.5 46.6,22.2 49,22.2" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.4" />
          <Polygon points="46,28 46.8,30 49,30 47.3,31.2 48,33.2 46,32.1 44,33.2 44.7,31.2 43,30 45.2,30" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.4" />
          <Polygon points="38,24 38.7,25.8 40.7,25.8 39.1,26.9 39.7,28.7 38,27.7 36.3,28.7 36.9,26.9 35.3,25.8 37.3,25.8" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.4" />
        </>
      );
    default:
      return <Rect width="60" height="40" fill="#D0D5E0" />;
  }
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#E8E8EE',
  },
});
