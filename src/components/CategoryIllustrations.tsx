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

function SoftShadow({ cx = 100, cy = 148, rx = 56, ry = 8 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(15,23,42,0.10)" />;
}

/** DualSense-style controller — Tech */
export function TechCategorySvg({ size = 160 }: IconProps) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 156" fill="none">
      <Defs>
        <LinearGradient id="techBody" x1="40" y1="40" x2="160" y2="130" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#7EB6FF" />
          <Stop offset="0.45" stopColor="#3B82F6" />
          <Stop offset="1" stopColor="#1D4ED8" />
        </LinearGradient>
        <LinearGradient id="techTop" x1="100" y1="38" x2="100" y2="72" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#BFDBFE" />
          <Stop offset="1" stopColor="#60A5FA" />
        </LinearGradient>
        <RadialGradient id="techGloss" cx="78" cy="58" r="50" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow />
      {/* left grip */}
      <Path
        d="M28 78c-8 2-16 14-14 28 2 12 12 18 24 16 8-1 14-8 16-16l-8-22c-4-8-10-8-18-6Z"
        fill="url(#techBody)"
      />
      {/* right grip */}
      <Path
        d="M172 78c8 2 16 14 14 28-2 12-12 18-24 16-8-1-14-8-16-16l8-22c4-8 10-8 18-6Z"
        fill="url(#techBody)"
      />
      {/* main body */}
      <Path
        d="M48 52c8-14 28-22 52-22s44 8 52 22c6 10 8 22 6 34-2 14-12 26-30 30H72c-18-4-28-16-30-30-2-12 0-24 6-34Z"
        fill="url(#techBody)"
      />
      <Path
        d="M58 56c6-10 22-16 42-16s36 6 42 16c4 7 5 16 4 24-1 10-8 18-20 21H74c-12-3-19-11-20-21-1-8 0-17 4-24Z"
        fill="url(#techTop)"
        opacity={0.55}
      />
      <Path
        d="M48 52c8-14 28-22 52-22s44 8 52 22c6 10 8 22 6 34-2 14-12 26-30 30H72c-18-4-28-16-30-30-2-12 0-24 6-34Z"
        fill="url(#techGloss)"
      />
      {/* d-pad */}
      <Circle cx="72" cy="82" r="18" fill="#0F172A" opacity={0.18} />
      <Circle cx="72" cy="82" r="14" fill="#F8FAFC" />
      <Path d="M72 72v20M62 82h20" stroke="#334155" strokeWidth={3.5} strokeLinecap="round" />
      {/* buttons */}
      <Circle cx="128" cy="82" r="18" fill="#0F172A" opacity={0.12} />
      <Circle cx="128" cy="72" r="5.5" fill="#F87171" />
      <Circle cx="118" cy="82" r="5.5" fill="#60A5FA" />
      <Circle cx="138" cy="82" r="5.5" fill="#4ADE80" />
      <Circle cx="128" cy="92" r="5.5" fill="#FBBF24" />
      {/* touchpad */}
      <Rect x="86" y="58" width="28" height="16" rx="4" fill="#E2E8F0" opacity={0.9} />
      <Rect x="88" y="60" width="24" height="12" rx="3" fill="#94A3B8" opacity={0.35} />
      {/* shoulder lights */}
      <Ellipse cx="62" cy="48" rx="7" ry="3.5" fill="#38BDF8" opacity={0.9} />
      <Ellipse cx="138" cy="48" rx="7" ry="3.5" fill="#A78BFA" opacity={0.9} />
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
          <Stop offset="0" stopColor="#6EE7B7" />
          <Stop offset="0.5" stopColor="#34D399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="dressShine" x1="90" y1="40" x2="110" y2="120" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
        <RadialGradient id="hangerRing" cx="100" cy="30" r="10" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FDE68A" />
          <Stop offset="1" stopColor="#D97706" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={48} />
      <Circle cx="100" cy="30" r="7" fill="url(#hangerRing)" />
      <Circle cx="100" cy="30" r="3.5" fill="#FFFBEB" />
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
      <Path d="M88 38c2 8 6 12 12 12s10-4 12-12" stroke="#047857" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M90 88h20M92 102h16" stroke="#A7F3D0" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      <Ellipse cx="148" cy="52" rx="14" ry="14" fill="#FBBF24" opacity={0.95} />
      <Ellipse cx="148" cy="52" rx="8" ry="8" fill="#FEF3C7" />
      <Path d="M148 46v12M142 52h12" stroke="#D97706" strokeWidth={2} strokeLinecap="round" />
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
          <Stop offset="0" stopColor="#FDA4AF" />
          <Stop offset="1" stopColor="#E11D48" />
        </RadialGradient>
        <RadialGradient id="petalB" cx="78" cy="58" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FBCFE8" />
          <Stop offset="1" stopColor="#DB2777" />
        </RadialGradient>
        <RadialGradient id="petalC" cx="122" cy="58" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FBCFE8" />
          <Stop offset="1" stopColor="#BE185D" />
        </RadialGradient>
        <RadialGradient id="center" cx="100" cy="58" r="10" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FEF08A" />
          <Stop offset="1" stopColor="#F59E0B" />
        </RadialGradient>
        <LinearGradient id="stem" x1="100" y1="70" x2="100" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#4ADE80" />
          <Stop offset="1" stopColor="#166534" />
        </LinearGradient>
        <LinearGradient id="wrap" x1="70" y1="100" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FEF3C7" />
          <Stop offset="1" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>
      <SoftShadow rx={44} />
      <Path d="M100 70v52" stroke="url(#stem)" strokeWidth={5} strokeLinecap="round" />
      <Path d="M100 108c-18-12-28-6-32 6" stroke="#22C55E" strokeWidth={4} strokeLinecap="round" />
      <Path d="M100 96c16-10 26-4 30 8" stroke="#16A34A" strokeWidth={4} strokeLinecap="round" />
      <Path d="M78 112c-8 2-14 10-12 16 6 2 14 0 18-6l-6-10Z" fill="#4ADE80" />
      <Path d="M122 104c8 0 14 8 12 14-6 2-14 2-18-4l6-10Z" fill="#22C55E" />
      <G>
        <Ellipse cx="100" cy="36" rx="16" ry="18" fill="url(#petalA)" />
        <Ellipse cx="78" cy="48" rx="16" ry="15" fill="url(#petalB)" transform="rotate(-28 78 48)" />
        <Ellipse cx="122" cy="48" rx="16" ry="15" fill="url(#petalC)" transform="rotate(28 122 48)" />
        <Ellipse cx="84" cy="68" rx="14" ry="13" fill="url(#petalB)" transform="rotate(-50 84 68)" />
        <Ellipse cx="116" cy="68" rx="14" ry="13" fill="url(#petalC)" transform="rotate(50 116 68)" />
        <Ellipse cx="100" cy="72" rx="13" ry="12" fill="url(#petalA)" />
        <Circle cx="100" cy="56" r="9" fill="url(#center)" />
        <Circle cx="97" cy="53" r="2.5" fill="#FFFBEB" opacity={0.8} />
      </G>
      <Path d="M72 118l28 22 28-22-8-8H80l-8 8Z" fill="url(#wrap)" />
      <Path d="M80 110h40l-4 8H84l-4-8Z" fill="#FDE68A" />
      <Path d="M100 110v30" stroke="#DC2626" strokeWidth={3} strokeLinecap="round" />
      <Path d="M86 122h28" stroke="#DC2626" strokeWidth={3} strokeLinecap="round" />
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
          <Stop offset="0" stopColor="#FB923C" />
          <Stop offset="1" stopColor="#C2410C" />
        </LinearGradient>
        <LinearGradient id="cakeMid" x1="55" y1="82" x2="145" y2="110" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FDBA74" />
          <Stop offset="1" stopColor="#EA580C" />
        </LinearGradient>
        <LinearGradient id="cakeTop" x1="62" y1="58" x2="138" y2="82" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FED7AA" />
          <Stop offset="1" stopColor="#F97316" />
        </LinearGradient>
        <LinearGradient id="frost" x1="60" y1="48" x2="140" y2="62" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFF7ED" />
          <Stop offset="1" stopColor="#FECACA" />
        </LinearGradient>
        <RadialGradient id="berry" cx="100" cy="42" r="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FB7185" />
          <Stop offset="1" stopColor="#BE123C" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={52} />
      <Ellipse cx="100" cy="136" rx="58" ry="10" fill="url(#cakeBase)" />
      <Path d="M42 112c0-6 8-10 18-10h80c10 0 18 4 18 10v16c0 8-12 14-36 14H78c-24 0-36-6-36-14v-16Z" fill="url(#cakeBase)" />
      <Path d="M50 88c0-5 8-9 16-9h68c8 0 16 4 16 9v18c0 6-10 11-32 11H82c-22 0-32-5-32-11V88Z" fill="url(#cakeMid)" />
      <Path d="M60 64c0-5 8-8 14-8h52c6 0 14 3 14 8v18c0 5-8 9-26 9H86c-18 0-26-4-26-9V64Z" fill="url(#cakeTop)" />
      <Path
        d="M58 62c4-8 14-12 42-12s38 4 42 12c-6 4-18 6-42 6s-36-2-42-6Z"
        fill="url(#frost)"
      />
      <Path d="M70 72c4 6 8 6 12 0M94 74c4 6 8 6 12 0M118 72c4 6 8 6 12 0" stroke="#FECACA" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx="100" cy="46" rx="16" ry="7" fill="url(#berry)" />
      <Path d="M100 28c0 0-3 10 0 16 3-6 0-16 0-16Z" fill="#16A34A" />
      <Path d="M100 32c6-2 12 2 10 8" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx="108" cy="36" r="5" fill="#E11D48" />
      <Circle cx="92" cy="40" r="3.5" fill="#FB7185" />
      <Rect x="78" y="118" width="44" height="7" rx="2" fill="#FFF7ED" opacity={0.55} />
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
          <Stop offset="0" stopColor="#DDD6FE" />
          <Stop offset="1" stopColor="#7C3AED" />
        </RadialGradient>
        <RadialGradient id="ear" cx="58" cy="48" r="18" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#E9D5FF" />
          <Stop offset="1" stopColor="#8B5CF6" />
        </RadialGradient>
        <RadialGradient id="snout" cx="100" cy="88" r="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F5F3FF" />
          <Stop offset="1" stopColor="#C4B5FD" />
        </RadialGradient>
        <RadialGradient id="blush" cx="68" cy="86" r="8" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FDA4AF" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#FDA4AF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={50} />
      {/* ears */}
      <Ellipse cx="58" cy="48" rx="20" ry="18" fill="url(#ear)" />
      <Ellipse cx="142" cy="48" rx="20" ry="18" fill="url(#ear)" />
      <Ellipse cx="58" cy="50" rx="10" ry="9" fill="#F5F3FF" opacity={0.85} />
      <Ellipse cx="142" cy="50" rx="10" ry="9" fill="#F5F3FF" opacity={0.85} />
      {/* head */}
      <Ellipse cx="100" cy="78" rx="42" ry="38" fill="url(#fur)" />
      {/* snout */}
      <Ellipse cx="100" cy="90" rx="24" ry="18" fill="url(#snout)" />
      <Ellipse cx="100" cy="86" rx="8" ry="6" fill="#1E1B4B" />
      <Path d="M100 90c0 6-4 10-8 10" stroke="#1E1B4B" strokeWidth={2.5} strokeLinecap="round" />
      {/* eyes */}
      <Circle cx="82" cy="72" r="5.5" fill="#1E1B4B" />
      <Circle cx="118" cy="72" r="5.5" fill="#1E1B4B" />
      <Circle cx="80" cy="70" r="2" fill="#FFFFFF" />
      <Circle cx="116" cy="70" r="2" fill="#FFFFFF" />
      {/* blush */}
      <Ellipse cx="68" cy="86" rx="9" ry="5" fill="url(#blush)" />
      <Ellipse cx="132" cy="86" rx="9" ry="5" fill="url(#blush)" />
      {/* smile */}
      <Path d="M90 98c4 5 16 5 20 0" stroke="#6D28D9" strokeWidth={2.5} strokeLinecap="round" />
      {/* paws / body hint */}
      <Path d="M62 118c10 18 56 18 76 0" stroke="#8B5CF6" strokeWidth={14} strokeLinecap="round" />
      <Circle cx="54" cy="116" r="12" fill="url(#ear)" />
      <Circle cx="146" cy="116" r="12" fill="url(#ear)" />
      <Circle cx="54" cy="116" r="6" fill="#F5F3FF" opacity={0.7} />
      <Circle cx="146" cy="116" r="6" fill="#F5F3FF" opacity={0.7} />
      {/* bow */}
      <Path d="M100 112c-10-8-18-2-18 6 8 2 14 0 18-4 4 4 10 6 18 4 0-8-8-14-18-6Z" fill="#F43F5E" />
      <Circle cx="100" cy="116" r="4" fill="#BE123C" />
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
          <Stop offset="0" stopColor="#3B82F6" />
          <Stop offset="1" stopColor="#1E3A8A" />
        </LinearGradient>
        <LinearGradient id="boxLid" x1="48" y1="52" x2="152" y2="78" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#60A5FA" />
          <Stop offset="1" stopColor="#1D4ED8" />
        </LinearGradient>
        <LinearGradient id="ribbon" x1="90" y1="40" x2="110" y2="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FDE68A" />
          <Stop offset="1" stopColor="#D97706" />
        </LinearGradient>
        <LinearGradient id="bowL" x1="60" y1="36" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FB7185" />
          <Stop offset="1" stopColor="#BE123C" />
        </LinearGradient>
        <LinearGradient id="bowR" x1="140" y1="36" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FDA4AF" />
          <Stop offset="1" stopColor="#E11D48" />
        </LinearGradient>
        <RadialGradient id="boxGloss" cx="80" cy="80" r="50" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <SoftShadow rx={54} />
      {/* box body */}
      <Path d="M48 74h104v52c0 8-8 14-18 14H66c-10 0-18-6-18-14V74Z" fill="url(#boxFront)" />
      <Path d="M48 74h104v52c0 8-8 14-18 14H66c-10 0-18-6-18-14V74Z" fill="url(#boxGloss)" />
      {/* lid */}
      <Path d="M42 58h116c4 0 6 3 6 6v14H36V64c0-3 2-6 6-6Z" fill="url(#boxLid)" />
      <Path d="M42 58h116c4 0 6 3 6 6v4H36v-4c0-3 2-6 6-6Z" fill="#93C5FD" opacity={0.35} />
      {/* ribbons */}
      <Rect x="92" y="58" width="16" height="82" fill="url(#ribbon)" />
      <Rect x="42" y="88" width="116" height="14" fill="url(#ribbon)" />
      {/* bow loops */}
      <Path
        d="M100 66C78 34 52 42 52 58c0 14 20 22 48 28 0 0-8-10-0-20Z"
        fill="url(#bowL)"
      />
      <Path
        d="M100 66c22-32 48-24 48-8 0 14-20 22-48 28 0 0 8-10 0-20Z"
        fill="url(#bowR)"
      />
      <Path d="M100 66c-6-14-18-16-24-8" stroke="#FDA4AF" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      <Path d="M100 66c6-14 18-16 24-8" stroke="#FECDD3" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      {/* bow tails */}
      <Path d="M100 88l-14 22 8 2 6-12 6 12 8-2-14-22Z" fill="#E11D48" />
      <Circle cx="100" cy="70" r="8" fill="#FBBF24" />
      <Circle cx="100" cy="70" r="4" fill="#FEF3C7" />
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
