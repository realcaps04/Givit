import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
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
const useNative = Platform.OS !== 'web';

export type ProductReview = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  accent?: string;
  avatar?: ImageSourcePropType;
};

export type RelatedProduct = {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType;
};

export type DetailProduct = {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  image: ImageSourcePropType;
  freeShip?: boolean;
  rating?: number;
  reviews?: number;
  colors?: string[];
  gallery?: ImageSourcePropType[];
  description?: string;
  packageIncludes?: string[];
  seller?: {
    name: string;
    location: string;
    rating: number;
    orders: string;
  };
  customerReviews?: ProductReview[];
  related?: RelatedProduct[];
};

type ProductDetailScreenProps = {
  product: DetailProduct;
  favorited?: boolean;
  inCart?: boolean;
  cartIds?: Set<string>;
  onBack: () => void;
  onToggleFavorite: () => void;
  onShare?: () => void;
  onAddToCart: () => void;
  onGoToCart?: () => void;
  onBuyNow: () => void;
  onOpenRelated?: (productId: string) => void;
  onAddRelatedToCart?: (productId: string) => void;
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

function RelatedCartIcon({ added = false }: { added?: boolean }) {
  const color = '#FFFFFF';
  if (added) {
    return (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 6h2l1.2 9.2a2 2 0 0 0 2 1.8h7.4a2 2 0 0 0 2-1.6L20 8H7"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="10" cy="20" r="1.3" fill={color} />
        <Circle cx="17" cy="20" r="1.3" fill={color} />
        <Path
          d="M9.2 12.2l2 2 3.8-4"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h2l1.2 9.2a2 2 0 0 0 2 1.8h7.4a2 2 0 0 0 2-1.6L20 8H7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10.5 12.5h5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="10" cy="20" r="1.3" fill={color} />
      <Circle cx="17" cy="20" r="1.3" fill={color} />
    </Svg>
  );
}

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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

function StarsRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={[styles.starGlyph, i < Math.round(rating) && styles.starGlyphOn]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function QuoteIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 8H5.5C4.7 8 4 8.7 4 9.5V13c0 .8.7 1.5 1.5 1.5H8V18H5.5A3.5 3.5 0 0 1 2 14.5v-5A3.5 3.5 0 0 1 5.5 6H9v2Zm11 0h-3.5C15.7 8 15 8.7 15 9.5V13c0 .8.7 1.5 1.5 1.5H19V18h-2.5A3.5 3.5 0 0 1 13 14.5v-5A3.5 3.5 0 0 1 16.5 6H20v2Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function ReviewAvatarFace({
  review,
  size = 52,
}: {
  review: ProductReview;
  size?: number;
}) {
  if (review.avatar) {
    return (
      <Image
        source={review.avatar}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.reviewAvatarFallback,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: review.accent ?? BLUE },
      ]}
    >
      <Text style={styles.reviewAvatarInitial}>{review.name.charAt(0)}</Text>
    </View>
  );
}

function ReviewBubbleSection({
  reviews,
  totalCount,
}: {
  reviews: ProductReview[];
  totalCount: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const openAnim = useRef(new Animated.Value(0)).current;
  const avatarLayouts = useRef<Record<number, { x: number; width: number }>>({});
  const [anchorX, setAnchorX] = useState(0);
  const rowWidth = useRef(0);

  const active = selected != null ? reviews[selected] : null;

  const placeAnchor = (index: number) => {
    const layout = avatarLayouts.current[index];
    if (!layout || !rowWidth.current) return;
    setAnchorX(layout.x + layout.width / 2);
  };

  const closeBubble = () => {
    Animated.timing(openAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: useNative,
    }).start(({ finished }) => {
      if (!finished) return;
      setVisible(false);
      setSelected(null);
    });
  };

  const openBubble = (index: number) => {
    setSelected(index);
    setVisible(true);
    placeAnchor(index);
    openAnim.setValue(0);
    requestAnimationFrame(() => {
      placeAnchor(index);
      Animated.spring(openAnim, {
        toValue: 1,
        friction: 7,
        tension: 88,
        useNativeDriver: useNative,
      }).start();
    });
  };

  const selectReview = (index: number) => {
    if (selected === index && visible) {
      closeBubble();
      return;
    }
    if (visible) {
      Animated.timing(openAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: useNative,
      }).start(({ finished }) => {
        if (finished) openBubble(index);
      });
      return;
    }
    openBubble(index);
  };

  const bubbleScale = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const bubbleOpacity = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const bubbleY = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const stemLeft = Math.max(0, anchorX - 38);

  return (
    <View style={[styles.section, styles.sectionLast]}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Customer reviews</Text>
        <Text style={styles.reviewsTotal}>{totalCount} reviews</Text>
      </View>
      <Text style={styles.reviewsHint}>Tap a shopper to read their review</Text>

      {visible && active ? (
        <Animated.View
          style={[
            styles.reviewBubbleFlow,
            {
              opacity: bubbleOpacity,
              transform: [{ translateY: bubbleY }, { scale: bubbleScale }],
            },
          ]}
        >
          <View style={styles.reviewBubbleCard}>
            <View style={styles.reviewBubbleTop}>
              <Text style={styles.reviewBubbleLabel}>Review</Text>
              <View style={styles.reviewBubblePill}>
                <View style={styles.reviewQuoteCircle}>
                  <QuoteIcon />
                </View>
                <StarsRow rating={active.rating} />
              </View>
            </View>
            <Text style={styles.reviewBubbleText}>{active.comment}</Text>
            <Text style={styles.reviewBubbleFooter}>
              — {active.name} · {active.date}
            </Text>
          </View>

          <View style={[styles.reviewStemWrap, { marginLeft: stemLeft }]}>
            <View style={styles.reviewStemNeck} />
            <View style={styles.reviewAvatarHalo}>
              <View style={styles.reviewAvatarHaloInner}>
                <ReviewAvatarFace review={active} size={52} />
              </View>
            </View>
          </View>
        </Animated.View>
      ) : null}

      <View
        style={styles.reviewAvatarsRow}
        onLayout={(e) => {
          rowWidth.current = e.nativeEvent.layout.width;
          if (selected != null) placeAnchor(selected);
        }}
      >
        {reviews.map((review, index) => {
          const isActive = selected === index && visible;
          return (
            <Pressable
              key={review.id}
              onPress={() => selectReview(index)}
              onLayout={(e) => {
                avatarLayouts.current[index] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
                if (selected === index) placeAnchor(index);
              }}
              style={styles.reviewAvatarBtn}
            >
              <View
                style={[
                  styles.reviewAvatarCircle,
                  isActive && styles.reviewAvatarCircleActive,
                  isActive && styles.reviewAvatarCircleDimmed,
                ]}
              >
                <ReviewAvatarFace review={review} size={50} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ProductDetailScreen({
  product,
  favorited = false,
  inCart = false,
  cartIds,
  onBack,
  onToggleFavorite,
  onShare,
  onAddToCart,
  onGoToCart,
  onBuyNow,
  onOpenRelated,
  onAddRelatedToCart,
}: ProductDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const gallery = useMemo(
    () => product.gallery ?? [product.image, product.image, product.image],
    [product],
  );
  const colors = product.colors ?? ['#2B2B2B', '#E8DCC8', '#D0D4DA'];
  const seller = product.seller ?? {
    name: 'Givit Official',
    location: 'Mumbai, India',
    rating: 4.9,
    orders: '2.4k+',
  };
  const description =
    product.description ??
    `A thoughtfully curated ${product.title} from Givit — premium materials, gift-ready packaging, and careful quality checks so every unboxing feels special. Perfect for birthdays, anniversaries, or a well-deserved surprise.`;
  const packageIncludes = product.packageIncludes ?? [
    `1 × ${product.title}`,
    'Premium gift box with ribbon',
    'Care & usage card',
    'Complimentary greeting note',
  ];
  const customerReviews = product.customerReviews ?? [
    {
      id: 'r1',
      name: 'Ananya S.',
      rating: 5,
      date: '12 Jul 2026',
      comment:
        'Beautiful packaging and arrived earlier than expected. The quality feels premium — gifting made easy.',
      avatar: {
        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
      },
    },
    {
      id: 'r2',
      name: 'Rahul M.',
      rating: 4,
      date: '3 Jul 2026',
      comment: 'Looks exactly like the photos. Would love more color options, but overall a great buy.',
      avatar: {
        uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
      },
    },
    {
      id: 'r3',
      name: 'Priya K.',
      rating: 5,
      date: '28 Jun 2026',
      comment: 'Seller was responsive and the product is lovely. Definitely ordering again from Givit.',
      avatar: {
        uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
      },
    },
    {
      id: 'r4',
      name: 'Dev A.',
      rating: 5,
      date: '20 Jun 2026',
      comment: 'Gifted this for an anniversary — they loved the unboxing experience. Highly recommend.',
      avatar: {
        uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
      },
    },
    {
      id: 'r5',
      name: 'Meera R.',
      rating: 4,
      date: '11 Jun 2026',
      comment: 'Soft, elegant finish and perfect size. Shipping was free and fast to Bangalore.',
      avatar: {
        uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
      },
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroSlide = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(1)).current;
  const switchingRef = useRef(false);

  const selectImage = (next: number) => {
    if (next === activeIndex || switchingRef.current) return;
    const dir = next > activeIndex ? 1 : -1;
    switchingRef.current = true;

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: useNative,
      }),
      Animated.timing(heroSlide, {
        toValue: -18 * dir,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: useNative,
      }),
      Animated.timing(heroScale, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: useNative,
      }),
    ]).start(() => {
      setActiveIndex(next);
      heroSlide.setValue(18 * dir);
      heroScale.setValue(1.02);
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
        Animated.spring(heroSlide, {
          toValue: 0,
          friction: 8,
          tension: 120,
          useNativeDriver: useNative,
        }),
        Animated.spring(heroScale, {
          toValue: 1,
          friction: 7,
          tension: 140,
          useNativeDriver: useNative,
        }),
      ]).start(() => {
        switchingRef.current = false;
      });
    });
  };

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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 28) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Animated.Image
            source={gallery[activeIndex]}
            style={[
              styles.hero,
              {
                opacity: heroOpacity,
                transform: [{ translateX: heroSlide }, { scale: heroScale }],
              },
            ]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.dots}>
          {gallery.map((_, i) => (
            <Pressable key={i} onPress={() => selectImage(i)} hitSlop={8}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <View style={styles.thumbs}>
          {gallery.map((img, i) => (
            <Pressable
              key={i}
              onPress={() => selectImage(i)}
              style={[styles.thumbWrap, i === activeIndex && styles.thumbActive]}
            >
              <Image source={img} style={styles.thumb} resizeMode="cover" />
            </Pressable>
          ))}
        </View>

        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceBlock}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            {product.originalPrice ? (
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            ) : null}
            {product.discountPercent ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discountPercent}%</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.tax}>Including taxes and duties</Text>
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
              <Text style={styles.reviewsCount}>({product.reviews ?? 231})</Text>
            </Text>
          </View>
        </View>

        {product.freeShip ? <Text style={styles.ship}>Free shipping available</Text> : null}

        {product.related && product.related.length > 0 ? (
          <View style={styles.relatedBlock}>
            <Text style={styles.relatedTitle}>Related products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {product.related.map((item) => {
                const relatedInCart = cartIds?.has(item.id) ?? false;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => onOpenRelated?.(item.id)}
                    style={({ pressed }) => [styles.relatedCard, pressed && styles.pressed]}
                  >
                    <View style={styles.relatedImgWrap}>
                      <Image source={item.image} style={styles.relatedImg} resizeMode="cover" />
                      <Pressable
                        onPress={(e) => {
                          if (typeof (e as { stopPropagation?: () => void }).stopPropagation === 'function') {
                            (e as { stopPropagation: () => void }).stopPropagation();
                          }
                          onAddRelatedToCart?.(item.id);
                        }}
                        hitSlop={6}
                        accessibilityRole="button"
                        accessibilityLabel={relatedInCart ? 'Added to cart' : 'Add to cart'}
                        style={({ pressed }) => [
                          styles.relatedCartBtn,
                          relatedInCart && styles.relatedCartBtnAdded,
                          pressed && styles.pressed,
                        ]}
                      >
                        <RelatedCartIcon added={relatedInCart} />
                      </Pressable>
                    </View>
                    <Text style={styles.relatedName} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.relatedPrice}>{item.price}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={inCart ? onGoToCart : onAddToCart}
            style={({ pressed }) => [
              styles.cartBtn,
              inCart && styles.cartBtnInCart,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.cartLabel}>{inCart ? 'Go to Cart' : 'Add to Cart'}</Text>
          </Pressable>
          <Pressable
            onPress={onBuyNow}
            style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}
          >
            <Text style={styles.buyLabel}>Buy Now</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What’s in the package</Text>
          <View style={styles.packageList}>
            {packageIncludes.map((item, index) => (
              <Text key={`${item}-${index}`} style={styles.packageItem}>
                •  {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller details</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{seller.name.charAt(0)}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <Text style={styles.sellerMeta}>{seller.location}</Text>
              <View style={styles.sellerStats}>
                <View style={styles.sellerStat}>
                  <StarIcon size={12} />
                  <Text style={styles.sellerStatText}>{seller.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.sellerDot}>·</Text>
                <Text style={styles.sellerStatText}>{seller.orders} orders</Text>
              </View>
            </View>
          </View>
        </View>

        <ReviewBubbleSection
          reviews={customerReviews}
          totalCount={product.reviews ?? 231}
        />
      </ScrollView>
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
  },
  heroWrap: {
    width: '100%',
    height: 280,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: FIELD,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    alignSelf: 'center',
    width: '100%',
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
  priceBlock: {
    marginBottom: 16,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: BLUE,
  },
  originalPrice: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: MUTED,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(220, 38, 38, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#DC2626',
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
  reviewsCount: {
    fontFamily: fonts.regular,
    color: MUTED,
  },
  ship: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#16A34A',
  },
  relatedBlock: {
    marginTop: 20,
  },
  relatedTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
    marginBottom: 12,
  },
  relatedRow: {
    gap: 12,
    paddingRight: 4,
  },
  relatedCard: {
    width: 124,
    borderRadius: 16,
    backgroundColor: FIELD,
    padding: 8,
  },
  relatedImgWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  relatedImg: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E8E8EE',
  },
  relatedCartBtn: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedCartBtnAdded: {
    backgroundColor: '#0F9D58',
  },
  relatedName: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: TEXT,
    marginBottom: 4,
    minHeight: 32,
  },
  relatedPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: BLUE,
  },
  actions: {
    marginTop: 18,
    gap: 10,
  },
  cartBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: TEXT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtnInCart: {
    backgroundColor: BLUE,
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
  section: {
    marginTop: 26,
    paddingTop: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EE',
  },
  sectionLast: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: TEXT,
    marginBottom: 10,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: '#4B4B55',
  },
  packageList: {
    gap: 4,
  },
  packageItem: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: '#4B4B55',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: FIELD,
    borderRadius: 16,
    padding: 14,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  sellerInfo: { flex: 1 },
  sellerName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 2,
  },
  sellerMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    marginBottom: 4,
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerStatText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: TEXT,
  },
  sellerDot: {
    color: MUTED,
    fontSize: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewsTotal: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
  },
  reviewsHint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    marginBottom: 10,
  },
  reviewBubbleFlow: {
    marginBottom: -28,
    zIndex: 2,
  },
  reviewBubbleCard: {
    backgroundColor: BLUE,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 14px 36px rgba(0, 76, 255, 0.26)' } as object)
      : {
          shadowColor: BLUE,
          shadowOpacity: 0.26,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }),
  },
  reviewBubbleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  reviewBubbleLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
  },
  reviewBubblePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
  },
  reviewQuoteCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBubbleText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    marginBottom: 14,
  },
  reviewBubbleFooter: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
  },
  reviewStemWrap: {
    width: 76,
    alignItems: 'center',
    marginTop: -2,
  },
  reviewStemNeck: {
    width: 20,
    height: 18,
    backgroundColor: BLUE,
  },
  reviewAvatarHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  reviewAvatarHaloInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
    zIndex: 1,
  },
  reviewAvatarBtn: {
    padding: 2,
  },
  reviewAvatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 12px rgba(15,23,42,0.12)' } as object)
      : {
          shadowColor: '#0F172A',
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        }),
  },
  reviewAvatarCircleActive: {
    borderColor: BLUE,
  },
  reviewAvatarCircleDimmed: {
    opacity: 0.25,
  },
  reviewAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarInitial: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  starsRow: { flexDirection: 'row', gap: 1 },
  starGlyph: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  starGlyphOn: {
    color: '#FDE68A',
  },
  pressed: { opacity: 0.88 },
});
