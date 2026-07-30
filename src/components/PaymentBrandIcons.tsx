import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type SizeProps = { size?: number };

/** PhonePe — purple disc + white mark */
export function PhonePeIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="#5F259F" />
      <Path
        d="M18.2 14.5h7.8c4.6 0 7.6 2.6 7.6 6.6 0 3.1-1.7 5.4-4.4 6.3l4.8 7.6h-5.1l-4.4-7.1h-1.8v7.1h-4.5V14.5Zm4.5 3.5v5.6h2.9c2.1 0 3.3-1.1 3.3-2.8s-1.2-2.8-3.3-2.8h-2.9Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/** Google Pay — multicolor G */
export function GPayIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="#FFFFFF" />
      <Path
        d="M39.2 24.3c0-.9-.1-1.7-.2-2.5H24v4.7h8.5c-.4 1.9-1.4 3.5-3 4.5v3.6h4.9c2.9-2.6 4.8-6.5 4.8-10.3Z"
        fill="#4285F4"
      />
      <Path
        d="M24 40c4.1 0 7.5-1.3 10-3.6l-4.9-3.6c-1.3.9-3.1 1.5-5.1 1.5-3.9 0-7.3-2.6-8.5-6.2H10.4v3.7C12.9 36.8 18.1 40 24 40Z"
        fill="#34A853"
      />
      <Path
        d="M15.5 28.1c-.4-.9-.6-1.9-.6-2.9s.2-2 .6-2.9v-3.7H10.4C9.1 20.6 8.4 22.4 8.4 24.2c0 1.8.7 3.6 2 5.1l5.1-1.2Z"
        fill="#FBBC05"
      />
      <Path
        d="M24 14.8c2.2 0 4.2.8 5.8 2.2l4.3-4.3C31.5 10.4 28.1 9 24 9c-5.9 0-11.1 3.2-13.6 8.2l5.1 3.7c1.2-3.6 4.6-6.1 8.5-6.1Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

/** Paytm — blue rounded tile + wordmark */
export function PaytmIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect width="48" height="48" rx="12" fill="#00BAF2" />
      <Path
        d="M10.5 18.2h5.1c2.9 0 4.7 1.5 4.7 3.9 0 2.5-1.9 4-4.8 4h-2.5v5.7h-2.5V18.2Zm2.5 2.2v3.5h2.2c1.3 0 2.1-.6 2.1-1.8s-.8-1.7-2.1-1.7H13Z"
        fill="#FFFFFF"
      />
      <Path
        d="M21.2 18.2h2.6l3.3 8.2 3.3-8.2h2.6l-4.7 11.6h-2.4L21.2 18.2Z"
        fill="#FFFFFF"
      />
      <Path
        d="M34.2 18.2h2.5v11.6h-2.5V18.2Z"
        fill="#FFFFFF"
      />
      <Path
        d="M10.8 33.2h26.4"
        stroke="#002E6E"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Amazon Pay — dark tile + smile arrow */
export function AmazonPayIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect width="48" height="48" rx="12" fill="#232F3E" />
      <Path
        d="M13.5 19.2h3.8c2.2 0 3.6 1.1 3.6 2.9 0 1.8-1.4 3-3.6 3h-1.5v4.1h-2.3V19.2Zm2.3 1.9v2.2h1.3c.9 0 1.4-.4 1.4-1.1s-.5-1.1-1.4-1.1h-1.3Z"
        fill="#FFFFFF"
      />
      <Path
        d="M22.2 19.2h2.4l1.8 5.8 1.8-5.8h2.4L27.4 30h-2.5l-2.7-10.8Z"
        fill="#FFFFFF"
      />
      <Path
        d="M31.6 19.2h2.3l2.8 7.2V19.2h2.2V30h-2.4l-2.8-7.3V30h-2.1V19.2Z"
        fill="#FFFFFF"
      />
      <Path
        d="M11.8 34c4 2.2 9.2 3.5 14.2 3.5 5.6 0 10.8-1.5 14.6-4.1"
        stroke="#FF9900"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path d="M37.8 30.6 41.2 33.4 36.4 34.2Z" fill="#FF9900" />
    </Svg>
  );
}

/** WhatsApp Pay */
export function WhatsAppPayIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="#25D366" />
      <Path
        d="M24.1 11.2c-7 0-12.7 5.6-12.7 12.6 0 2.2.6 4.3 1.7 6.2L11.5 36.8l6.9-1.8c1.8 1 3.9 1.5 5.7 1.5 7 0 12.7-5.6 12.7-12.6S31.1 11.2 24.1 11.2Z"
        fill="#FFFFFF"
      />
      <Path
        d="M24.1 13.4c5.8 0 10.5 4.6 10.5 10.4s-4.7 10.4-10.5 10.4c-1.8 0-3.6-.5-5.1-1.3l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.8 4.7-10.4 10.3-10.4Z"
        fill="#25D366"
      />
      <Path
        d="M20.1 18.6c-.3-.6-.5-.6-.8-.6h-.7c-.2 0-.6.1-.9.5s-1.1 1.1-1.1 2.7 1.2 3.1 1.3 3.3c.2.2 2.3 3.7 5.7 5 3 .1.1 1.9 2.2 1.5.9-.2 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.4-.1-.2-.4-.3-.8-.5s-1.9-.9-2.2-1c-.3-.1-.5-.1-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.2-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.8-1-2.4Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/** JioPay */
export function JioPayIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="#0A2885" />
      <Path
        d="M14.8 18.2h3.2c.9 0 1.4.3 1.7.9.2.4.2.9 0 1.4-.2.5-.7.8-1.5.8h-1.1v5.9c0 1.5.7 2.2 2.1 2.2.5 0 1-.1 1.4-.2v2.4c-.6.2-1.3.3-2.1.3-3 0-4.5-1.6-4.5-4.5v-9.2h.8Z"
        fill="#FFFFFF"
      />
      <Path
        d="M21.2 18.2h2.6v13.6h-2.6V18.2Z"
        fill="#FFFFFF"
      />
      <Path
        d="M25.8 25c0-4.2 2.8-7.1 6.8-7.1 1.4 0 2.6.3 3.5.8v2.7c-.9-.6-1.9-.9-3.2-.9-2.4 0-4 1.6-4 4.4s1.6 4.4 4 4.4c1.3 0 2.4-.3 3.3-.9v2.7c-1 .5-2.2.8-3.6.8-4 0-6.8-2.9-6.8-7Z"
        fill="#FFFFFF"
      />
      <Circle cx="34.8" cy="15.6" r="1.6" fill="#FFFFFF" />
    </Svg>
  );
}

/** MobiKwik */
export function MobiKwikIcon({ size = 28 }: SizeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="mk" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#3B82F6" />
          <Stop offset="1" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      <Rect width="48" height="48" rx="12" fill="url(#mk)" />
      <Path
        d="M12.5 30.5c2.8-6.8 6.8-11.4 11.5-13.4 4.7-2 9.2-1.5 12.5.8"
        stroke="#FFFFFF"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <Path
        d="M14.8 18.2c2.2 6.6 6 11.2 10.4 13.4 4.4 2.1 8.8 1.8 12.3-.2"
        stroke="#93C5FD"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <Circle cx="24" cy="24.2" r="3.2" fill="#FFFFFF" />
    </Svg>
  );
}

/** UPI / BHIM fast-forward */
export function UpiIcon({ size = 28 }: SizeProps) {
  const w = size;
  const h = Math.round(size * 0.72);
  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={w} height={h} viewBox="0 0 54 36" fill="none">
        <Path d="M2 4 18 18 2 32 7.5 32 23.5 18 7.5 4Z" fill="#FF671F" />
        <Path
          d="M15 4 31 18 15 32 20.5 32 36.5 18 20.5 4Z"
          fill="#FFFFFF"
          stroke="#D0D4DC"
          strokeWidth={1}
        />
        <Path d="M28 4 44 18 28 32 33.5 32 49.5 18 33.5 4Z" fill="#097A4B" />
      </Svg>
    </View>
  );
}

export type PaymentBrandId =
  | 'phonepe'
  | 'gpay'
  | 'paytm'
  | 'amazonpay'
  | 'whatsapp'
  | 'jiopay'
  | 'mobikwik'
  | 'upi';

export function PaymentBrandIcon({
  id,
  size = 28,
}: {
  id: PaymentBrandId;
  size?: number;
}) {
  switch (id) {
    case 'phonepe':
      return <PhonePeIcon size={size} />;
    case 'gpay':
      return <GPayIcon size={size} />;
    case 'paytm':
      return <PaytmIcon size={size} />;
    case 'amazonpay':
      return <AmazonPayIcon size={size} />;
    case 'whatsapp':
      return <WhatsAppPayIcon size={size} />;
    case 'jiopay':
      return <JioPayIcon size={size} />;
    case 'mobikwik':
      return <MobiKwikIcon size={size} />;
    case 'upi':
    default:
      return <UpiIcon size={size} />;
  }
}
