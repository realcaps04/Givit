import { useMemo, useState, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';

export type DetailProduct = {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType;
  freeShip?: boolean;
  rating?: number;
  reviews?: number;
  colors?: string[];
  gallery?: ImageSourcePropType[];
};

type ProductDetailScreenProps = {
  product: DetailProduct;
  favorited?: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onShare?: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={TEXT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        fill={filled ? BLUE : 'none'}
        stroke={BLUE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShareIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="2.5" stroke={TEXT} strokeWidth={1.7} />
      <Circle cx="6" cy="12" r="2.5" stroke={TEXT} strokeWidth={1.7} />
      <Circle cx="18" cy="19" r="2.5" stroke={TEXT} strokeWidth={1.7} />
      <Path d="M8.3 11l7.4-5M8.3 13l7.4 5" stroke={TEXT} strokeWidth={1.7} />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5l2.6 5.4 6 .9-4.3 4.2 1 5.9L12 17.8 6.7 20l1-5.9L3.4 9.8l6-.9L12 3.5Z"
        fill="#F5B400"
      />
    </Svg>
  );
}

function RoundBtn({ onPress, children }: { onPress: () => void; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export function ProductDetailScreen({
  product,
  favorited = false,
  onBack,
  onToggleFavorite,
  onShare,
  onAddToCart,
  onBuyNow,
}: ProductDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const gallery = useMemo(
    () => product.gallery ?? [product.image, product.image, product.image],
    [product],
  );
  const colors = product.colors ?? ['#2B2B2B', '#E8DCC8', '#D0D4DA'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.topBar}>
        <RoundBtn onPress={onBack}>
          <BackIcon />
        </RoundBtn>
        <View style={styles.topRight}>
          <RoundBtn onPress={onToggleFavorite}>
            <HeartIcon filled={favorited} />
          </RoundBtn>
          <RoundBtn onPress={onShare ?? (() => undefined)}>
            <ShareIcon />
          </RoundBtn>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={gallery[activeIndex]} style={styles.hero} resizeMode="cover" />

        <View style={styles.dots}>
          {gallery.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
        >
          {gallery.map((img, i) => (
            <Pressable
              key={i}
              onPress={() => setActiveIndex(i)}
              style={[styles.thumbWrap, i === activeIndex && styles.thumbActive]}
            >
              <Image source={img} style={styles.thumb} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.tax}>| Including taxes and duties</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.colors}>
            {colors.map((c, i) => (
              <Pressable
                key={c + i}
                onPress={() => setColorIndex(i)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  i === colorIndex && styles.colorDotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.rating}>
            <StarIcon />
            <Text style={styles.ratingText}>
              {(product.rating ?? 4.8).toFixed(1)}{' '}
              <Text style={styles.reviews}>({product.reviews ?? 231})</Text>
            </Text>
          </View>
        </View>

        {product.freeShip ? <Text style={styles.ship}>Free shipping available</Text> : null}
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable
          onPress={onAddToCart}
          style={({ pressed }) => [styles.cartBtn, pressed && styles.pressed]}
        >
          <Text style={styles.cartLabel}>Add to Cart</Text>
        </Pressable>
        <Pressable
          onPress={onBuyNow}
          style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}
        >
          <Text style={styles.buyLabel}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topRight: { flexDirection: 'row', gap: 10 },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  hero: {
    width: '100%',
    height: 280,
    borderRadius: 22,
    backgroundColor: FIELD,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D8D8DE',
  },
  dotActive: {
    width: 18,
    backgroundColor: BLUE,
  },
  thumbs: {
    gap: 10,
    marginBottom: 18,
  },
  thumbWrap: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbActive: {
    borderColor: BLUE,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: FIELD,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: TEXT,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: BLUE,
  },
  tax: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colors: { flexDirection: 'row', gap: 10 },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderColor: TEXT,
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: TEXT,
  },
  reviews: {
    fontFamily: fonts.regular,
    color: MUTED,
  },
  ship: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#16A34A',
  },
  actions: {
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EE',
    backgroundColor: '#FFFFFF',
  },
  cartBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: TEXT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  buyBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  pressed: { opacity: 0.88 },
});
