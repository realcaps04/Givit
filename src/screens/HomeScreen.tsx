import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type TextInput as TextInputType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { fonts } from '../theme';
import { ProductDetailScreen, type DetailProduct } from './ProductDetailScreen';

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.10)';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';
const GREEN = '#16A34A';
const PINK_CARD = '#F8E8EE';
const CREAM_CARD = '#F7F0E4';
const useNative = Platform.OS !== 'web';

const CATEGORIES = ['Gifts', 'Flowers', 'Fashion', 'Tech', 'Gourmet', 'Kids'];

const CATEGORY_CARDS = [
  { id: 'gifts', title: 'Gifts', subtitle: 'Curated boxes & surprises', tone: '#E8F0FE', image: require('../../assets/products/p01.jpg') },
  { id: 'flowers', title: 'Flowers', subtitle: 'Bouquets & fresh blooms', tone: '#F8E8EE', image: require('../../assets/products/p02.jpg') },
  { id: 'fashion', title: 'Fashion', subtitle: 'Style essentials to gift', tone: '#F7F0E4', image: require('../../assets/products/p09.jpg') },
  { id: 'tech', title: 'Tech', subtitle: 'Gadgets & smart picks', tone: '#EAF7F0', image: require('../../assets/products/r01.jpg') },
  { id: 'gourmet', title: 'Gourmet', subtitle: 'Treats & hampers', tone: '#FFF1E6', image: require('../../assets/products/p03.jpg') },
  { id: 'kids', title: 'Kids', subtitle: 'Playful gifts for little ones', tone: '#F0E8FF', image: require('../../assets/products/p05.jpg') },
] as const;

const SEARCH_PLACEHOLDER = 'Search Fashion, Tech, Gifts and much more';

const SEARCH_SUGGESTIONS = [
  'Fashion gifts',
  'Tech gadgets',
  'Gourmet hampers',
  'Personalized gifts',
  'Flowers & bouquets',
  'Kids toys',
  'Luxury gift boxes',
  'Birthday surprises',
  'Anniversary sets',
  'Home décor gifts',
];

type Product = {
  id: string;
  title: string;
  price?: string;
  freeShip?: boolean;
  image: ImageSourcePropType;
  tone?: string;
};

const HOT_SALES: Product[] = [
  { id: '1', title: 'Festive Gift Stack', price: '₹ 2,499', freeShip: true, image: require('../../assets/products/p01.jpg') },
  { id: '2', title: 'Pink Ribbon Box', price: '₹ 1,899', freeShip: true, image: require('../../assets/products/p02.jpg') },
  { id: '3', title: 'Artisan Chocolates', price: '₹ 1,299', freeShip: true, image: require('../../assets/products/p03.jpg') },
  { id: '4', title: 'Kraft & Bow Classic', price: '₹ 999', freeShip: true, image: require('../../assets/products/p04.jpg') },
  { id: '5', title: 'Wrapped Surprises', price: '₹ 2,199', freeShip: true, image: require('../../assets/products/p05.jpg') },
  { id: '6', title: 'Black Gold Luxe', price: '₹ 3,499', freeShip: true, image: require('../../assets/products/p06.jpg') },
];

const FEATURED: Product[] = [
  { id: 'f1', title: 'Editor’s Pick · Luxe Box', price: '₹ 4,299', freeShip: true, image: require('../../assets/products/p06.jpg') },
  { id: 'f2', title: 'Best for Her · Beauty Kit', price: '₹ 2,799', freeShip: true, image: require('../../assets/products/p07.jpg') },
  { id: 'f3', title: 'Tech Moments · Watch', price: '₹ 6,999', freeShip: true, image: require('../../assets/products/r01.jpg') },
  { id: 'f4', title: 'Gourmet Treat Tower', price: '₹ 1,599', freeShip: true, image: require('../../assets/products/p08.jpg') },
];

const MORE_GIFTS: Product[] = [
  { id: 'm1', title: 'Beauty Gift Kit', price: '₹ 2,799', freeShip: true, image: require('../../assets/products/p07.jpg') },
  { id: 'm2', title: 'Celebration Cake', price: '₹ 1,599', freeShip: false, image: require('../../assets/products/p08.jpg') },
  { id: 'm3', title: 'Style Essentials', price: '₹ 4,299', freeShip: true, image: require('../../assets/products/p09.jpg') },
  { id: 'm4', title: 'Weekend Treat Box', price: '₹ 1,149', freeShip: true, image: require('../../assets/products/p10.jpg') },
  { id: 'm5', title: 'Soft Knit Gift', price: '₹ 1,999', freeShip: true, image: require('../../assets/products/p11.jpg') },
  { id: 'm6', title: 'Travel Companion', price: '₹ 3,299', freeShip: true, image: require('../../assets/products/p12.jpg') },
  { id: 'm7', title: 'Skincare Duo', price: '₹ 2,249', freeShip: true, image: require('../../assets/products/more01.jpg') },
  { id: 'm8', title: 'Everyday Classic', price: '₹ 1,799', freeShip: false, image: require('../../assets/products/more02.jpg') },
  { id: 'm9', title: 'Fragrance Mini', price: '₹ 2,599', freeShip: true, image: require('../../assets/products/more03.jpg') },
  { id: 'm10', title: 'Camera Moments', price: '₹ 5,499', freeShip: true, image: require('../../assets/products/more04.jpg') },
  { id: 'm11', title: 'Glow Essentials', price: '₹ 1,899', freeShip: true, image: require('../../assets/products/more05.jpg') },
  { id: 'm12', title: 'Smart Watch Gift', price: '₹ 6,999', freeShip: true, image: require('../../assets/products/r01.jpg') },
];

const RECENT: Product[] = [
  { id: 'r1', title: 'Smart Watch Gift', image: require('../../assets/products/r01.jpg'), tone: PINK_CARD },
  { id: 'r2', title: 'Studio Headphones', image: require('../../assets/products/r02.jpg'), tone: CREAM_CARD },
  { id: 'r3', title: 'Sneaker Drop', image: require('../../assets/products/r03.jpg'), tone: '#E8F0FE' },
];

const BANNER_IMG = require('../../assets/products/banner.jpg');

type TabKey = 'home' | 'categories' | 'favorites' | 'profile';

const ALL_PRODUCTS: Product[] = [...FEATURED, ...HOT_SALES, ...MORE_GIFTS, ...RECENT];

function toDetailProduct(product: Product): DetailProduct {
  const others = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);
  const gallery = [product.image, ...others.map((p) => p.image)];
  while (gallery.length < 3) gallery.push(product.image);
  return {
    id: product.id,
    title: product.title,
    price: product.price ?? '₹ —',
    image: product.image,
    freeShip: product.freeShip,
    rating: 4.8,
    reviews: 231,
    colors: ['#2B2B2B', '#E8DCC8', '#D0D4DA'],
    gallery,
  };
}

type HomeScreenProps = {
  onOpenProfile?: () => void;
};

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={MUTED} strokeWidth={1.8} />
      <Path d="M20 20l-3.5-3.5" stroke={MUTED} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function CartIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h2l1.2 9.2a2 2 0 0 0 2 1.8h7.4a2 2 0 0 0 2-1.6L20 8H7"
        stroke={TEXT}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="10" cy="20" r="1.4" fill={TEXT} />
      <Circle cx="17" cy="20" r="1.4" fill={TEXT} />
    </Svg>
  );
}

function HeartIcon({ filled = false, color = BLUE }: { filled?: boolean; color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TabIcon({ name, active }: { name: TabKey; active: boolean }) {
  const c = active ? BLUE : '#A0A0AA';
  if (name === 'home') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
          stroke={c}
          strokeWidth={1.8}
          strokeLinejoin="round"
          fill={active ? BLUE_SOFT : 'none'}
        />
      </Svg>
    );
  }
  if (name === 'categories') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="7" height="7" rx="1.5" stroke={c} strokeWidth={1.8} fill={active ? BLUE_SOFT : 'none'} />
        <Rect x="13" y="4" width="7" height="7" rx="1.5" stroke={c} strokeWidth={1.8} fill={active ? BLUE_SOFT : 'none'} />
        <Rect x="4" y="13" width="7" height="7" rx="1.5" stroke={c} strokeWidth={1.8} fill={active ? BLUE_SOFT : 'none'} />
        <Rect x="13" y="13" width="7" height="7" rx="1.5" stroke={c} strokeWidth={1.8} fill={active ? BLUE_SOFT : 'none'} />
      </Svg>
    );
  }
  if (name === 'favorites') {
    return <HeartIcon color={c} />;
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth={1.8} />
      <Path
        d="M5 19c1.5-3.2 4-5 7-5s5.5 1.8 7 5"
        stroke={c}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProductImage({ source, style }: { source: ImageSourcePropType; style?: object }) {
  return <Image source={source} style={[styles.productImg, style]} resizeMode="cover" />;
}

function FavButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={(e) => {
        if (typeof (e as { stopPropagation?: () => void }).stopPropagation === 'function') {
          (e as { stopPropagation: () => void }).stopPropagation();
        }
        onPress();
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
      style={({ pressed }) => [styles.favBtn, pressed && styles.pressed]}
    >
      <HeartIcon filled={active} color={BLUE} />
    </Pressable>
  );
}

export function HomeScreen({ onOpenProfile }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('home');
  const [category, setCategory] = useState('Gifts');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const inputRef = useRef<TextInputType>(null);
  const iconPulse = useRef(new Animated.Value(1)).current;

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const addToCart = () => {
    setCartCount((n) => n + 1);
    Alert.alert('Added to cart', 'Item added to your cart.');
  };

  const buyNow = () => {
    setCartCount((n) => n + 1);
    Alert.alert('Buy Now', 'Checkout flow coming next.');
  };

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_SUGGESTIONS;
    return SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  const openSearch = () => {
    Animated.sequence([
      Animated.timing(iconPulse, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: useNative,
      }),
      Animated.spring(iconPulse, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: useNative,
      }),
    ]).start();
    setSearchOpen(true);
  };

  const closeSearch = () => {
    Keyboard.dismiss();
    setSearchOpen(false);
  };

  const pickSuggestion = (value: string) => {
    setQuery(value);
    closeSearch();
  };

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={toDetailProduct(selectedProduct)}
        favorited={!!favorites[selectedProduct.id]}
        onBack={() => setSelectedProduct(null)}
        onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
        onShare={() => Alert.alert('Share', 'Sharing coming soon.')}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {tab === 'home' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!searchOpen}
        >
          <View style={styles.topRow}>
            <Pressable onPress={openSearch} style={styles.searchWrap}>
              <Animated.View style={[styles.searchIconBtn, { transform: [{ scale: iconPulse }] }]}>
                <SearchIcon />
              </Animated.View>
              <Text style={styles.placeholderText} numberOfLines={1} ellipsizeMode="tail">
                {query.trim() || SEARCH_PLACEHOLDER}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cartBtn}
              accessibilityRole="button"
              accessibilityLabel="Cart"
              onPress={() => Alert.alert('Cart', cartCount ? `${cartCount} item(s) in cart` : 'Your cart is empty')}
            >
              <CartIcon />
              {cartCount > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          <ImageBackground source={BANNER_IMG} style={styles.banner} imageStyle={styles.bannerImage}>
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerEyebrow}>GIVIT WEEK</Text>
              <Text style={styles.bannerTitle}>40% OFF{'\n'}celebration gifts</Text>
              <View style={styles.bannerPill}>
                <Text style={styles.bannerPillText}>FREE SHIPPING</Text>
              </View>
            </View>
            <Text style={styles.bannerFoot}>Valid this week · Selected gift sets</Text>
          </ImageBackground>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cats}
          >
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.catChip, active && styles.catChipActive]}
                >
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>{c}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {FEATURED.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => openProduct(item)}
                style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}
              >
                <View style={styles.imageWrap}>
                  <ProductImage source={item.image} style={styles.featuredImg} />
                  <FavButton
                    active={!!favorites[item.id]}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
                <Text style={styles.salePrice}>{item.price}</Text>
                <Text style={styles.saleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.freeShip ? <Text style={styles.freeShip}>Free shipping</Text> : null}
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Hot sales</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {HOT_SALES.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => openProduct(item)}
                style={({ pressed }) => [styles.saleCard, pressed && styles.pressed]}
              >
                <View style={styles.imageWrap}>
                  <ProductImage source={item.image} />
                  <FavButton
                    active={!!favorites[item.id]}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
                <Text style={styles.salePrice}>{item.price}</Text>
                <Text style={styles.saleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.freeShip ? <Text style={styles.freeShip}>Free shipping</Text> : null}
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.sectionHead, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>More gifts</Text>
          </View>

          <View style={styles.moreGrid}>
            {MORE_GIFTS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => openProduct(item)}
                style={({ pressed }) => [styles.moreCard, pressed && styles.pressed]}
              >
                <View style={styles.imageWrap}>
                  <ProductImage source={item.image} style={styles.moreImg} />
                  <FavButton
                    active={!!favorites[item.id]}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
                <Text style={styles.salePrice}>{item.price}</Text>
                <Text style={styles.saleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.freeShip ? <Text style={styles.freeShip}>Free shipping</Text> : null}
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionHead, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Recently viewed</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {RECENT.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => openProduct(item)}
                style={({ pressed }) => [
                  styles.recentCard,
                  { backgroundColor: item.tone },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.imageWrap}>
                  <ProductImage source={item.image} style={styles.recentImg} />
                  <FavButton
                    active={!!favorites[item.id]}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
                <Text style={styles.recentTitle}>{item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </ScrollView>
      ) : tab === 'categories' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.categoriesTitle}>Categories</Text>
          <Text style={styles.categoriesSub}>Browse gifts by occasion and style</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_CARDS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  setCategory(item.title);
                  setTab('home');
                }}
                style={({ pressed }) => [
                  styles.categoryCard,
                  { backgroundColor: item.tone },
                  pressed && styles.pressed,
                ]}
              >
                <Image source={item.image} style={styles.categoryImg} resizeMode="cover" />
                <Text style={styles.categoryCardTitle}>{item.title}</Text>
                <Text style={styles.categoryCardSub}>{item.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.placeholderTab}>
          <Text style={styles.placeholderTitle}>
            {tab === 'favorites' ? 'Favorites' : 'Profile'}
          </Text>
          <Text style={styles.placeholderSub}>Coming next</Text>
          {tab === 'profile' && onOpenProfile ? (
            <Pressable onPress={onOpenProfile} style={styles.linkBtn}>
              <Text style={styles.linkText}>Account settings</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {(
          [
            { key: 'home', label: 'Home' },
            { key: 'categories', label: 'Categories' },
            { key: 'favorites', label: 'Favorites' },
            { key: 'profile', label: 'Profile' },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setTab(item.key)}
              style={[styles.tabItem, active && styles.tabItemActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              disabled={searchOpen}
            >
              <TabIcon name={item.key} active={active} />
              {active ? <Text style={styles.tabLabel}>{item.label}</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Modal
        visible={searchOpen}
        transparent
        animationType="fade"
        onRequestClose={closeSearch}
        statusBarTranslucent
      >
        <View style={[styles.searchModal, { paddingTop: Math.max(insets.top, 10) }]}>
          <Pressable style={styles.searchBackdrop} onPress={closeSearch} />

          <View style={styles.searchSheet}>
            <View style={styles.topRow}>
              <View style={[styles.searchWrap, styles.searchWrapExpanded]}>
                <Pressable onPress={() => inputRef.current?.focus()} style={styles.searchIconBtn}>
                  <SearchIcon />
                </Pressable>
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder={SEARCH_PLACEHOLDER}
                  placeholderTextColor={MUTED}
                  style={styles.searchInput}
                  underlineColorAndroid="transparent"
                  returnKeyType="search"
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
              </View>
              <Pressable onPress={closeSearch} style={styles.cancelSearchBtn} hitSlop={8}>
                <Text style={styles.cancelSearchText}>Cancel</Text>
              </Pressable>
            </View>

            <Text style={styles.suggestHeading}>Suggestions</Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.suggestList}
            >
              {filteredSuggestions.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => pickSuggestion(item)}
                  style={({ pressed }) => [styles.suggestRow, pressed && styles.pressed]}
                >
                  <SearchIcon />
                  <Text style={styles.suggestText}>{item}</Text>
                </Pressable>
              ))}
              {filteredSuggestions.length === 0 ? (
                <Text style={styles.suggestEmpty}>No suggestions found</Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchWrap: {
    width: '68%',
    height: 44,
    borderRadius: 22,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    overflow: 'hidden',
  },
  searchWrapExpanded: {
    flex: 1,
    width: undefined,
  },
  searchIconBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: TEXT,
    padding: 0,
    minWidth: 0,
  },
  placeholderText: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
  },
  cancelSearchBtn: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  cancelSearchText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: BLUE,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: FIELD,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  categoriesTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: TEXT,
    marginBottom: 4,
  },
  categoriesSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
    marginBottom: 18,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47.5%',
    borderRadius: 18,
    padding: 12,
    overflow: 'hidden',
  },
  categoryImg: {
    width: '100%',
    height: 96,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  categoryCardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
    marginBottom: 2,
  },
  categoryCardSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
  },
  searchModal: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 30, 0.35)',
  },
  searchBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  searchSheet: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 18,
    paddingBottom: 16,
    maxHeight: '72%',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 16px 40px rgba(0,0,0,0.12)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }),
  },
  suggestHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: MUTED,
    marginBottom: 8,
    marginTop: 4,
  },
  suggestList: {
    maxHeight: 320,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8EE',
  },
  suggestText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: TEXT,
  },
  suggestEmpty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
    paddingVertical: 18,
    textAlign: 'center',
  },
  banner: {
    borderRadius: 22,
    minHeight: 168,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 18,
    justifyContent: 'space-between',
  },
  bannerImage: {
    borderRadius: 22,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 40, 140, 0.55)',
  },
  bannerCopy: { maxWidth: '72%', zIndex: 1 },
  bannerEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 30,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bannerPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bannerPillText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: BLUE,
  },
  bannerFoot: {
    marginTop: 18,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    zIndex: 1,
  },
  cats: {
    gap: 8,
    paddingBottom: 8,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4E4EA',
    backgroundColor: '#FFFFFF',
  },
  catChipActive: {
    borderColor: BLUE,
    backgroundColor: BLUE_SOFT,
  },
  catLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: MUTED,
  },
  catLabelActive: {
    color: BLUE,
    fontFamily: fonts.semiBold,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: TEXT,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D8D8DE',
  },
  dotActive: { backgroundColor: BLUE, width: 14 },
  cardsRow: { gap: 12, paddingRight: 8 },
  featuredCard: {
    width: 210,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 8px 22px rgba(0,0,0,0.06)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }),
  },
  featuredImg: {
    height: 148,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    marginTop: -6,
    marginBottom: 8,
    backgroundColor: BLUE_SOFT,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  featuredBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: BLUE,
  },
  saleCard: {
    width: 148,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 12,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 8px 22px rgba(0,0,0,0.06)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }),
  },
  productImg: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: FIELD,
  },
  imageWrap: {
    position: 'relative',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }),
  },
  pressed: {
    opacity: 0.85,
  },
  moreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  moreCard: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 10,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 8px 22px rgba(0,0,0,0.06)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }),
  },
  moreImg: {
    height: 132,
  },
  salePrice: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: TEXT,
  },
  saleTitle: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
  },
  freeShip: {
    marginTop: 6,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: GREEN,
  },
  recentCard: {
    width: 190,
    borderRadius: 20,
    padding: 14,
    minHeight: 190,
  },
  recentImg: {
    height: 120,
    marginBottom: 0,
  },
  recentTitle: {
    marginTop: 12,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EE',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    minWidth: 56,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
  },
  tabItemActive: {
    backgroundColor: BLUE_SOFT,
  },
  tabLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: BLUE,
  },
  placeholderTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: TEXT,
  },
  placeholderSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
  },
  linkBtn: { marginTop: 12 },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
  },
});
