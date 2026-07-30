import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

type IconProps = { size?: number };

/** Soft neutral palette — light shades only */
const L = {
  ink: '#94A3B8',
  mist: '#E2E8F0',
  cloud: '#F1F5F9',
  snow: '#F8FAFC',
  white: '#FFFFFF',
  softBlue: '#C7D7EE',
  softMint: '#C9E4D8',
  softPink: '#E8D0D8',
  softPeach: '#EBD9C8',
  softLav: '#D9D2E8',
  softSage: '#C5D9C8',
  softSand: '#E5DFD4',
  mid: '#A8B4C4',
  deep: '#7B8798',
};

function SoftShadow({ cx = 100, cy = 148, rx = 56, ry = 8 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(100,116,139,0.12)" />;
}

/** DualSense-style controller — Tech */
export function TechCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="techBody" x1="40" y1="40" x2="160" y2="130" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="0.5" stopColor={L.softBlue} />
          <Stop offset="1" stopColor={L.mist} />
        </LinearGradient>
        <LinearGradient id="techTop" x1="100" y1="38" x2="100" y2="72" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} />
          <Stop offset="1" stopColor={L.softBlue} />
        </LinearGradient>
        <RadialGradient id="techGloss" cx="78" cy="58" r="50" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} stopOpacity="0.55" />
          <Stop offset="1" stopColor={L.white} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow />
      <Path
        d="M28 78c-8 2-16 14-14 28 2 12 12 18 24 16 8-1 14-8 16-16l-8-22c-4-8-10-8-18-6Z"
        fill="url(#techBody)"
      />
      <Path
        d="M172 78c8 2 16 14 14 28-2 12-12 18-24 16-8-1-14-8-16-16l8-22c4-8 10-8 18-6Z"
        fill="url(#techBody)"
      />
      <Path
        d="M48 52c8-14 28-22 52-22s44 8 52 22c6 10 8 22 6 34-2 14-12 26-30 30H72c-18-4-28-16-30-30-2-12 0-24 6-34Z"
        fill="url(#techBody)"
      />
      <Path
        d="M58 56c6-10 22-16 42-16s36 6 42 16c4 7 5 16 4 24-1 10-8 18-20 21H74c-12-3-19-11-20-21-1-8 0-17 4-24Z"
        fill="url(#techTop)"
        opacity={0.7}
      />
      <Path
        d="M48 52c8-14 28-22 52-22s44 8 52 22c6 10 8 22 6 34-2 14-12 26-30 30H72c-18-4-28-16-30-30-2-12 0-24 6-34Z"
        fill="url(#techGloss)"
      />
      <Circle cx="72" cy="82" r="18" fill={L.mist} opacity={0.7} />
      <Circle cx="72" cy="82" r="14" fill={L.snow} />
      <Path d="M72 72v20M62 82h20" stroke={L.mid} strokeWidth={3.5} strokeLinecap="round" />
      <Circle cx="128" cy="82" r="18" fill={L.mist} opacity={0.45} />
      <Circle cx="128" cy="72" r="5.5" fill={L.softPink} />
      <Circle cx="118" cy="82" r="5.5" fill={L.softBlue} />
      <Circle cx="138" cy="82" r="5.5" fill={L.softMint} />
      <Circle cx="128" cy="92" r="5.5" fill={L.softSand} />
      <Rect x="86" y="58" width="28" height="16" rx="4" fill={L.snow} opacity={0.95} />
      <Rect x="88" y="60" width="24" height="12" rx="3" fill={L.mist} opacity={0.55} />
      <Ellipse cx="62" cy="48" rx="7" ry="3.5" fill={L.softBlue} />
      <Ellipse cx="138" cy="48" rx="7" ry="3.5" fill={L.softLav} />
    </Svg>
  );
}

/** Premium dress — Fashion */
export function FashionCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="dress" x1="70" y1="28" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="0.45" stopColor={L.softMint} />
          <Stop offset="1" stopColor={L.mist} />
        </LinearGradient>
        <LinearGradient id="dressShine" x1="90" y1="40" x2="110" y2="120" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} stopOpacity="0.55" />
          <Stop offset="1" stopColor={L.white} stopOpacity="0" />
        </LinearGradient>
        <RadialGradient id="hangerRing" cx="100" cy="30" r="10" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softSand} />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={48} />
      <Circle cx="100" cy="30" r="7" fill="url(#hangerRing)" />
      <Circle cx="100" cy="30" r="3.5" fill={L.white} />
      <Path
        d="M78 38c4 2 10 4 22 4s18-2 22-4l14 18-10 5v8c0 2-1 3-3 3H77c-2 0-3-1-3-3v-8l-10-5 14-18Z"
        fill="url(#dress)"
      />
      <Path
        d="M74 68h52c4 8 10 28 8 52-1 12-8 20-20 22H86c-12-2-19-10-20-22-2-24 4-44 8-52Z"
        fill="url(#dress)"
      />
      <Path
        d="M74 68h52c4 8 10 28 8 52-1 12-8 20-20 22H86c-12-2-19-10-20-22-2-24 4-44 8-52Z"
        fill="url(#dressShine)"
      />
      <Path d="M88 38c2 8 6 12 12 12s10-4 12-12" stroke={L.mid} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M90 88h20M92 102h16" stroke={L.white} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
      <Ellipse cx="148" cy="52" rx="14" ry="14" fill={L.softSand} />
      <Ellipse cx="148" cy="52" rx="8" ry="8" fill={L.cloud} />
      <Path d="M148 46v12M142 52h12" stroke={L.mid} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Blooming bouquet — Flowers */
export function FlowersCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <RadialGradient id="petalA" cx="100" cy="52" r="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softPink} />
        </RadialGradient>
        <RadialGradient id="petalB" cx="78" cy="58" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softLav} />
        </RadialGradient>
        <RadialGradient id="petalC" cx="122" cy="58" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softPink} />
        </RadialGradient>
        <RadialGradient id="center" cx="100" cy="58" r="10" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} />
          <Stop offset="1" stopColor={L.softSand} />
        </RadialGradient>
        <LinearGradient id="stem" x1="100" y1="70" x2="100" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softMint} />
          <Stop offset="1" stopColor={L.softSage} />
        </LinearGradient>
        <LinearGradient id="wrap" x1="70" y1="100" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softSand} />
        </LinearGradient>
      </Defs>
      <SoftShadow rx={44} />
      <Path d="M100 70v52" stroke="url(#stem)" strokeWidth={5} strokeLinecap="round" />
      <Path d="M100 108c-18-12-28-6-32 6" stroke={L.softSage} strokeWidth={4} strokeLinecap="round" />
      <Path d="M100 96c16-10 26-4 30 8" stroke={L.softMint} strokeWidth={4} strokeLinecap="round" />
      <Path d="M78 112c-8 2-14 10-12 16 6 2 14 0 18-6l-6-10Z" fill={L.softMint} />
      <Path d="M122 104c8 0 14 8 12 14-6 2-14 2-18-4l6-10Z" fill={L.softSage} />
      <G>
        <Ellipse cx="100" cy="36" rx="16" ry="18" fill="url(#petalA)" />
        <Ellipse cx="78" cy="48" rx="16" ry="15" fill="url(#petalB)" transform="rotate(-28 78 48)" />
        <Ellipse cx="122" cy="48" rx="16" ry="15" fill="url(#petalC)" transform="rotate(28 122 48)" />
        <Ellipse cx="84" cy="68" rx="14" ry="13" fill="url(#petalB)" transform="rotate(-50 84 68)" />
        <Ellipse cx="116" cy="68" rx="14" ry="13" fill="url(#petalC)" transform="rotate(50 116 68)" />
        <Ellipse cx="100" cy="72" rx="13" ry="12" fill="url(#petalA)" />
        <Circle cx="100" cy="56" r="9" fill="url(#center)" />
        <Circle cx="97" cy="53" r="2.5" fill={L.white} opacity={0.85} />
      </G>
      <Path d="M72 118l28 22 28-22-8-8H80l-8 8Z" fill="url(#wrap)" />
      <Path d="M80 110h40l-4 8H84l-4-8Z" fill={L.cloud} />
      <Path d="M100 110v30" stroke={L.softPink} strokeWidth={3} strokeLinecap="round" />
      <Path d="M86 122h28" stroke={L.softPink} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

/** Layered celebration cake — Gourmet */
export function GourmetCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="cakeBase" x1="50" y1="110" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softPeach} />
          <Stop offset="1" stopColor={L.softSand} />
        </LinearGradient>
        <LinearGradient id="cakeMid" x1="55" y1="82" x2="145" y2="110" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softPeach} />
        </LinearGradient>
        <LinearGradient id="cakeTop" x1="62" y1="58" x2="138" y2="82" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softPink} />
        </LinearGradient>
        <LinearGradient id="frost" x1="60" y1="48" x2="140" y2="62" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} />
          <Stop offset="1" stopColor={L.cloud} />
        </LinearGradient>
        <RadialGradient id="berry" cx="100" cy="42" r="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softPink} />
          <Stop offset="1" stopColor={L.softLav} />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={52} />
      <Ellipse cx="100" cy="136" rx="58" ry="10" fill="url(#cakeBase)" />
      <Path
        d="M42 112c0-6 8-10 18-10h80c10 0 18 4 18 10v16c0 8-12 14-36 14H78c-24 0-36-6-36-14v-16Z"
        fill="url(#cakeBase)"
      />
      <Path
        d="M50 88c0-5 8-9 16-9h68c8 0 16 4 16 9v18c0 6-10 11-32 11H82c-22 0-32-5-32-11V88Z"
        fill="url(#cakeMid)"
      />
      <Path
        d="M60 64c0-5 8-8 14-8h52c6 0 14 3 14 8v18c0 5-8 9-26 9H86c-18 0-26-4-26-9V64Z"
        fill="url(#cakeTop)"
      />
      <Path d="M58 62c4-8 14-12 42-12s38 4 42 12c-6 4-18 6-42 6s-36-2-42-6Z" fill="url(#frost)" />
      <Path
        d="M70 72c4 6 8 6 12 0M94 74c4 6 8 6 12 0M118 72c4 6 8 6 12 0"
        stroke={L.softPink}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Ellipse cx="100" cy="46" rx="16" ry="7" fill="url(#berry)" />
      <Path d="M100 28c0 0-3 10 0 16 3-6 0-16 0-16Z" fill={L.softSage} />
      <Path d="M100 32c6-2 12 2 10 8" stroke={L.softMint} strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx="108" cy="36" r="5" fill={L.softPink} />
      <Circle cx="92" cy="40" r="3.5" fill={L.softLav} />
      <Rect x="78" y="118" width="44" height="7" rx="2" fill={L.white} opacity={0.55} />
    </Svg>
  );
}

/** Soft teddy — Kids */
export function KidsCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <RadialGradient id="fur" cx="90" cy="70" r="55" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softLav} />
        </RadialGradient>
        <RadialGradient id="ear" cx="58" cy="48" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softLav} />
        </RadialGradient>
        <RadialGradient id="snout" cx="100" cy="88" r="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} />
          <Stop offset="1" stopColor={L.mist} />
        </RadialGradient>
        <RadialGradient id="blush" cx="68" cy="86" r="8" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softPink} stopOpacity="0.85" />
          <Stop offset="1" stopColor={L.softPink} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={50} />
      <Ellipse cx="58" cy="48" rx="20" ry="18" fill="url(#ear)" />
      <Ellipse cx="142" cy="48" rx="20" ry="18" fill="url(#ear)" />
      <Ellipse cx="58" cy="50" rx="10" ry="9" fill={L.snow} opacity={0.9} />
      <Ellipse cx="142" cy="50" rx="10" ry="9" fill={L.snow} opacity={0.9} />
      <Ellipse cx="100" cy="78" rx="42" ry="38" fill="url(#fur)" />
      <Ellipse cx="100" cy="90" rx="24" ry="18" fill="url(#snout)" />
      <Ellipse cx="100" cy="86" rx="8" ry="6" fill={L.mid} />
      <Path d="M100 90c0 6-4 10-8 10" stroke={L.deep} strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx="82" cy="72" r="5.5" fill={L.deep} />
      <Circle cx="118" cy="72" r="5.5" fill={L.deep} />
      <Circle cx="80" cy="70" r="2" fill={L.white} />
      <Circle cx="116" cy="70" r="2" fill={L.white} />
      <Ellipse cx="68" cy="86" rx="9" ry="5" fill="url(#blush)" />
      <Ellipse cx="132" cy="86" rx="9" ry="5" fill="url(#blush)" />
      <Path d="M90 98c4 5 16 5 20 0" stroke={L.ink} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M62 118c10 18 56 18 76 0" stroke={L.softLav} strokeWidth={14} strokeLinecap="round" />
      <Circle cx="54" cy="116" r="12" fill="url(#ear)" />
      <Circle cx="146" cy="116" r="12" fill="url(#ear)" />
      <Circle cx="54" cy="116" r="6" fill={L.snow} opacity={0.75} />
      <Circle cx="146" cy="116" r="6" fill={L.snow} opacity={0.75} />
      <Path
        d="M100 112c-10-8-18-2-18 6 8 2 14 0 18-4 4 4 10 6 18 4 0-8-8-14-18-6Z"
        fill={L.softPink}
      />
      <Circle cx="100" cy="116" r="4" fill={L.softSand} />
    </Svg>
  );
}

/** Luxury gift box — Gifts */
export function GiftsCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="boxFront" x1="50" y1="70" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softBlue} />
        </LinearGradient>
        <LinearGradient id="boxLid" x1="48" y1="52" x2="152" y2="78" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.mist} />
        </LinearGradient>
        <LinearGradient id="ribbon" x1="90" y1="40" x2="110" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softSand} />
          <Stop offset="1" stopColor={L.softPeach} />
        </LinearGradient>
        <LinearGradient id="bowL" x1="60" y1="36" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softPink} />
        </LinearGradient>
        <LinearGradient id="bowR" x1="140" y1="36" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softLav} />
        </LinearGradient>
        <RadialGradient id="boxGloss" cx="80" cy="80" r="50" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.white} stopOpacity="0.45" />
          <Stop offset="1" stopColor={L.white} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={54} />
      <Path d="M48 74h104v52c0 8-8 14-18 14H66c-10 0-18-6-18-14V74Z" fill="url(#boxFront)" />
      <Path d="M48 74h104v52c0 8-8 14-18 14H66c-10 0-18-6-18-14V74Z" fill="url(#boxGloss)" />
      <Path d="M42 58h116c4 0 6 3 6 6v14H36V64c0-3 2-6 6-6Z" fill="url(#boxLid)" />
      <Path d="M42 58h116c4 0 6 3 6 6v4H36v-4c0-3 2-6 6-6Z" fill={L.white} opacity={0.4} />
      <Rect x="92" y="58" width="16" height="82" fill="url(#ribbon)" />
      <Rect x="42" y="88" width="116" height="14" fill="url(#ribbon)" />
      <Path d="M100 66C78 34 52 42 52 58c0 14 20 22 48 28 0 0-8-10-0-20Z" fill="url(#bowL)" />
      <Path d="M100 66c22-32 48-24 48-8 0 14-20 22-48 28 0 0 8-10 0-20Z" fill="url(#bowR)" />
      <Path
        d="M100 66c-6-14-18-16-24-8"
        stroke={L.softPink}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.6}
      />
      <Path
        d="M100 66c6-14 18-16 24-8"
        stroke={L.mist}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />
      <Path d="M100 88l-14 22 8 2 6-12 6 12 8-2-14-22Z" fill={L.softPink} />
      <Circle cx="100" cy="70" r="8" fill={L.softSand} />
      <Circle cx="100" cy="70" r="4" fill={L.snow} />
    </Svg>
  );
}

/** Potted plant — Plants */
export function PlantsCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="pot" x1="60" y1="100" x2="140" y2="145" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.softSand} />
          <Stop offset="1" stopColor={L.softPeach} />
        </LinearGradient>
        <LinearGradient id="potRim" x1="55" y1="92" x2="145" y2="108" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softSand} />
        </LinearGradient>
        <RadialGradient id="leafA" cx="100" cy="50" r="28" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softMint} />
        </RadialGradient>
        <RadialGradient id="leafB" cx="70" cy="60" r="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.cloud} />
          <Stop offset="1" stopColor={L.softSage} />
        </RadialGradient>
        <RadialGradient id="leafC" cx="130" cy="58" r="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={L.snow} />
          <Stop offset="1" stopColor={L.softSage} />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={48} />
      {/* foliage */}
      <Ellipse cx="100" cy="48" rx="26" ry="32" fill="url(#leafA)" />
      <Ellipse cx="72" cy="62" rx="22" ry="26" fill="url(#leafB)" transform="rotate(-22 72 62)" />
      <Ellipse cx="128" cy="60" rx="22" ry="26" fill="url(#leafC)" transform="rotate(22 128 60)" />
      <Ellipse cx="88" cy="36" rx="14" ry="18" fill={L.softMint} opacity={0.85} transform="rotate(-12 88 36)" />
      <Ellipse cx="114" cy="34" rx="13" ry="17" fill={L.softSage} opacity={0.8} transform="rotate(14 114 34)" />
      <Path d="M100 78v18" stroke={L.softSage} strokeWidth={4} strokeLinecap="round" />
      <Path d="M100 70c-14-6-22 2-24 12" stroke={L.softMint} strokeWidth={3} strokeLinecap="round" />
      <Path d="M100 66c12-4 20 4 22 12" stroke={L.softSage} strokeWidth={3} strokeLinecap="round" />
      {/* pot */}
      <Path d="M62 104h76l-8 36c-2 8-8 12-18 12H88c-10 0-16-4-18-12l-8-36Z" fill="url(#pot)" />
      <Path d="M56 94h88c4 0 6 3 6 6v6H50v-6c0-3 2-6 6-6Z" fill="url(#potRim)" />
      <Ellipse cx="100" cy="100" rx="42" ry="6" fill={L.softSage} opacity={0.35} />
      <Path d="M78 118h44" stroke={L.white} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    </Svg>
  );
}

const ILLUSTRATIONS = {
  tech: TechCategorySvg,
  fashion: FashionCategorySvg,
  flowers: FlowersCategorySvg,
  gourmet: GourmetCategorySvg,
  kids: KidsCategorySvg,
  gifts: GiftsCategorySvg,
  plants: PlantsCategorySvg,
} as const;

export type CategoryIllustrationId = keyof typeof ILLUSTRATIONS;

export function CategoryIllustration({
  id,
  size = 160,
}: {
  id: CategoryIllustrationId;
  size?: number;
}) {
  const Comp = ILLUSTRATIONS[id];
  return <Comp size={size} />;
}
