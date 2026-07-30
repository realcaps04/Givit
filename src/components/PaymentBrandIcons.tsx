import { Image, StyleSheet, View } from 'react-native';

type SizeProps = { size?: number };

const ICONS = {
  phonepe: require('../../assets/brands/upi/phonepe.png'),
  gpay: require('../../assets/brands/upi/gpay.png'),
  paytm: require('../../assets/brands/upi/paytm.png'),
  amazonpay: require('../../assets/brands/upi/amazonpay.png'),
  whatsapp: require('../../assets/brands/upi/whatsapp.png'),
  jiopay: require('../../assets/brands/upi/jiopay.png'),
  mobikwik: require('../../assets/brands/upi/mobikwik.png'),
  upi: require('../../assets/brands/upi/bhim-upi.png'),
} as const;

export type PaymentBrandId = keyof typeof ICONS;

const WIDE: Partial<Record<PaymentBrandId, number>> = {
  paytm: 1.35,
  amazonpay: 1.35,
  gpay: 1.35,
  mobikwik: 1.35,
  upi: 2.4,
};

export function PaymentBrandIcon({
  id,
  size = 28,
}: {
  id: PaymentBrandId;
  size?: number;
}) {
  const ratio = WIDE[id] ?? 1;
  const width = Math.round(size * ratio);
  const height = size;

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Image
        source={ICONS[id]}
        style={styles.img}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

export function PhonePeIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="phonepe" size={size} />;
}

export function GPayIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="gpay" size={size} />;
}

export function PaytmIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="paytm" size={size} />;
}

export function AmazonPayIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="amazonpay" size={size} />;
}

export function WhatsAppPayIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="whatsapp" size={size} />;
}

export function JioPayIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="jiopay" size={size} />;
}

export function MobiKwikIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="mobikwik" size={size} />;
}

export function UpiIcon({ size = 28 }: SizeProps) {
  return <PaymentBrandIcon id="upi" size={size} />;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
