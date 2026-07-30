import { useEffect, useMemo, useRef, useState } from 'react';
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
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type TextInput as TextInputType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { fonts } from '../theme';
import {
  CategoryIllustration,
  type CategoryIllustrationId,
} from '../components/CategoryIllustrations';
import { TransitionHost, type TransitionDirection } from '../components/ScreenTransition';
import { ProductDetailScreen, type DetailProduct } from './ProductDetailScreen';
import { CheckoutScreen, type CheckoutItem } from './CheckoutScreen';

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.10)';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';
const PINK_CARD = '#F8E8EE';
const CREAM_CARD = '#F7F0E4';
const useNative = Platform.OS !== 'web';

const CATEGORIES = ['Gifts', 'Flowers', 'Plants', 'Fashion', 'Tech', 'Gourmet', 'Kids'];

const CATEGORY_CARDS: {
  id: CategoryIllustrationId;
  title: string;
  tagline: string;
  colors: readonly [string, string, string];
  glow: string;
}[] = [
  {
    id: 'tech',
    title: 'Tech',
    tagline: 'Smart gifts that impress',
    colors: ['#F5F8FC', '#EEF3FA', '#FFFFFF'],
    glow: 'rgba(0, 76, 255, 0.10)',
  },
  {
    id: 'fashion',
    title: 'Fashion',
    tagline: 'Style they’ll love to wear',
    colors: ['#F4F9F6', '#EAF4EF', '#FFFFFF'],
    glow: 'rgba(45, 122, 90, 0.10)',
  },
  {
    id: 'flowers',
    title: 'Flowers',
    tagline: 'Blooms for every moment',
    colors: ['#FAF5F7', '#F4EBEE', '#FFFFFF'],
    glow: 'rgba(180, 100, 130, 0.10)',
  },
  {
    id: 'plants',
    title: 'Plants',
    tagline: 'Green gifts that grow',
    colors: ['#F4F8F5', '#EAF2EC', '#FFFFFF'],
    glow: 'rgba(70, 130, 90, 0.10)',
  },
  {
    id: 'gourmet',
    title: 'Gourmet',
    tagline: 'Treats worth celebrating',
    colors: ['#FAF7F3', '#F3ECE4', '#FFFFFF'],
    glow: 'rgba(160, 110, 70, 0.10)',
  },
  {
    id: 'kids',
    title: 'Kids',
    tagline: 'Playful joy for little ones',
    colors: ['#F6F4FA', '#EEEAF5', '#FFFFFF'],
    glow: 'rgba(110, 90, 180, 0.10)',
  },
  {
    id: 'gifts',
    title: 'Gifts',
    tagline: 'Signature Givit picks',
    colors: ['#F3F6FC', '#E8EEF8', '#FFFFFF'],
    glow: 'rgba(0, 76, 255, 0.12)',
  },
];

const CATEGORY_SEARCH_PLACEHOLDER = 'What you gonna buy today?';

type ExclusiveCard = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  kind: 'category' | 'soon';
  category?: string;
};

const EXCLUSIVE_CARDS: ExclusiveCard[] = [
  {
    id: 'coming',
    title: 'Coming Soon',
    image: {
      uri: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'soon',
  },
  {
    id: 'mobiles',
    title: 'Mobiles',
    image: {
      uri: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Tech',
  },
  {
    id: 'fashion',
    title: 'Fashion',
    image: {
      uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Fashion',
  },
  {
    id: 'electronics',
    title: 'Electronics',
    image: {
      uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Tech',
  },
  {
    id: 'travel',
    title: 'Travel',
    image: {
      uri: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'soon',
  },
  {
    id: 'deals',
    title: 'Deals',
    image: {
      uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'soon',
  },
  {
    id: 'home',
    title: 'Home',
    image: {
      uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Gifts',
  },
  {
    id: 'beauty',
    title: 'Everyday Beauty',
    image: {
      uri: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Fashion',
  },
  {
    id: 'appliances',
    title: 'Appliances',
    image: {
      uri: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'soon',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    image: {
      uri: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'soon',
  },
  {
    id: 'kids',
    title: 'Kids & Toys',
    image: {
      uri: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop&crop=center&q=80',
    },
    kind: 'category',
    category: 'Kids',
  },
];

const SEARCH_PLACEHOLDER = 'Search Fashion, Tech, Gifts and much more';

const SEARCH_SUGGESTIONS = [
  'Fashion gifts',
  'Tech gadgets',
  'Gourmet hampers',
  'Personalized gifts',
  'Flowers & bouquets',
  'Indoor plants',
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
  categories: string[];
};

const HOT_SALES: Product[] = [
  { id: '1', title: 'Festive Gift Stack', price: '₹ 2,499', freeShip: true, image: require('../../assets/products/p01.jpg'), categories: ['Gifts'] },
  { id: '2', title: 'Pink Ribbon Box', price: '₹ 1,899', freeShip: true, image: require('../../assets/products/p02.jpg'), categories: ['Gifts', 'Flowers', 'Kids'] },
  { id: '3', title: 'Artisan Chocolates', price: '₹ 1,299', freeShip: true, image: require('../../assets/products/p03.jpg'), categories: ['Gourmet', 'Gifts'] },
  { id: '4', title: 'Kraft & Bow Classic', price: '₹ 999', freeShip: true, image: require('../../assets/products/p04.jpg'), categories: ['Gifts'] },
  { id: '5', title: 'Wrapped Surprises', price: '₹ 2,199', freeShip: true, image: require('../../assets/products/p05.jpg'), categories: ['Gifts', 'Kids', 'Flowers'] },
  { id: '6', title: 'Black Gold Luxe', price: '₹ 3,499', freeShip: true, image: require('../../assets/products/p06.jpg'), categories: ['Gifts', 'Fashion'] },
];

const FEATURED: Product[] = [
  { id: 'f1', title: 'Editor’s Pick · Luxe Box', price: '₹ 4,299', freeShip: true, image: require('../../assets/products/p06.jpg'), categories: ['Gifts', 'Fashion'] },
  { id: 'f2', title: 'Best for Her · Beauty Kit', price: '₹ 2,799', freeShip: true, image: require('../../assets/products/p07.jpg'), categories: ['Fashion', 'Gifts'] },
  { id: 'f3', title: 'Tech Moments · Watch', price: '₹ 6,999', freeShip: true, image: require('../../assets/products/r01.jpg'), categories: ['Tech', 'Gifts'] },
  { id: 'f4', title: 'Gourmet Treat Tower', price: '₹ 1,599', freeShip: true, image: require('../../assets/products/p08.jpg'), categories: ['Gourmet', 'Gifts'] },
];

const MORE_GIFTS: Product[] = [
  { id: 'm1', title: 'Beauty Gift Kit', price: '₹ 2,799', freeShip: true, image: require('../../assets/products/p07.jpg'), categories: ['Fashion', 'Gifts'] },
  { id: 'm2', title: 'Celebration Cake', price: '₹ 1,599', freeShip: false, image: require('../../assets/products/p08.jpg'), categories: ['Gourmet', 'Kids'] },
  { id: 'm3', title: 'Style Essentials', price: '₹ 4,299', freeShip: true, image: require('../../assets/products/p09.jpg'), categories: ['Fashion'] },
  { id: 'm4', title: 'Weekend Treat Box', price: '₹ 1,149', freeShip: true, image: require('../../assets/products/p10.jpg'), categories: ['Gourmet', 'Kids', 'Gifts'] },
  { id: 'm5', title: 'Soft Knit Gift', price: '₹ 1,999', freeShip: true, image: require('../../assets/products/p11.jpg'), categories: ['Fashion', 'Kids'] },
  { id: 'm6', title: 'Travel Companion', price: '₹ 3,299', freeShip: true, image: require('../../assets/products/p12.jpg'), categories: ['Tech', 'Fashion'] },
  { id: 'm7', title: 'Skincare Duo', price: '₹ 2,249', freeShip: true, image: require('../../assets/products/more01.jpg'), categories: ['Fashion', 'Plants'] },
  { id: 'm8', title: 'Everyday Classic', price: '₹ 1,799', freeShip: false, image: require('../../assets/products/more02.jpg'), categories: ['Fashion', 'Plants'] },
  { id: 'm9', title: 'Fragrance Mini', price: '₹ 2,599', freeShip: true, image: require('../../assets/products/more03.jpg'), categories: ['Flowers', 'Fashion'] },
  { id: 'm10', title: 'Camera Moments', price: '₹ 5,499', freeShip: true, image: require('../../assets/products/more04.jpg'), categories: ['Tech'] },
  { id: 'm11', title: 'Glow Essentials', price: '₹ 1,899', freeShip: true, image: require('../../assets/products/more05.jpg'), categories: ['Plants', 'Fashion'] },
  { id: 'm12', title: 'Smart Watch Gift', price: '₹ 6,999', freeShip: true, image: require('../../assets/products/r01.jpg'), categories: ['Tech', 'Gifts'] },
];

const RECENT: Product[] = [
  { id: 'r1', title: 'Smart Watch Gift', image: require('../../assets/products/r01.jpg'), tone: PINK_CARD, categories: ['Tech', 'Gifts'] },
  { id: 'r2', title: 'Studio Headphones', image: require('../../assets/products/r02.jpg'), tone: CREAM_CARD, categories: ['Tech'] },
  { id: 'r3', title: 'Sneaker Drop', image: require('../../assets/products/r03.jpg'), tone: '#E8F0FE', categories: ['Fashion'] },
];

const BANNER_IMG = require('../../assets/products/banner.jpg');

const PROMO_BANNERS: {
  id: string;
  eyebrow: string;
  title: string;
  pill: string;
  foot: string;
  image: ImageSourcePropType;
  overlay: string;
}[] = [
  {
    id: 'b1',
    eyebrow: 'GIVIT WEEK',
    title: '40% OFF\ncelebration gifts',
    pill: 'FREE SHIPPING',
    foot: 'Valid this week · Selected gift sets',
    image: BANNER_IMG,
    overlay: 'rgba(0, 40, 140, 0.55)',
  },
  {
    id: 'b2',
    eyebrow: 'TECH DROP',
    title: 'Smart gifts\nup to 35% off',
    pill: 'NEW ARRIVALS',
    foot: 'Watches, audio & more',
    image: require('../../assets/products/r01.jpg'),
    overlay: 'rgba(20, 30, 70, 0.58)',
  },
  {
    id: 'b3',
    eyebrow: 'FOR HER',
    title: 'Beauty kits\nfrom ₹1,899',
    pill: 'LIMITED',
    foot: 'Curated self-care sets',
    image: require('../../assets/products/p07.jpg'),
    overlay: 'rgba(90, 30, 70, 0.52)',
  },
  {
    id: 'b4',
    eyebrow: 'GOURMET',
    title: 'Treat towers\n25% off',
    pill: 'TASTE MORE',
    foot: 'Chocolates, cakes & hampers',
    image: require('../../assets/products/p08.jpg'),
    overlay: 'rgba(80, 45, 20, 0.55)',
  },
  {
    id: 'b5',
    eyebrow: 'LUXE BOXES',
    title: 'Premium wraps\nstarting ₹999',
    pill: 'EDITOR PICKS',
    foot: 'Gift-ready in every size',
    image: require('../../assets/products/p06.jpg'),
    overlay: 'rgba(25, 25, 35, 0.58)',
  },
  {
    id: 'b6',
    eyebrow: 'STYLE WEEK',
    title: 'Fashion gifts\nworth gifting',
    pill: 'SHOP STYLE',
    foot: 'Essentials they’ll actually use',
    image: require('../../assets/products/p09.jpg'),
    overlay: 'rgba(25, 55, 45, 0.55)',
  },
  {
    id: 'b7',
    eyebrow: 'WEEKEND',
    title: 'Surprise stacks\nready to ship',
    pill: 'EXPRESS',
    foot: 'Same-week delivery on select sets',
    image: require('../../assets/products/p01.jpg'),
    overlay: 'rgba(40, 25, 90, 0.55)',
  },
];

type TabKey = 'home' | 'categories' | 'exclusives' | 'profile';

const TAB_ORDER: TabKey[] = ['home', 'categories', 'exclusives', 'profile'];

const ALL_PRODUCTS: Product[] = [...FEATURED, ...HOT_SALES, ...MORE_GIFTS, ...RECENT];

function parsePriceAmount(price?: string): number | null {
  if (!price) return null;
  const n = Number(price.replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatInr(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

function toDetailProduct(product: Product): DetailProduct {
  const others = ALL_PRODUCTS.filter((p) => p.id !== product.id);
  // Prefer unique titles / images for related picks
  const seen = new Set<string>();
  const relatedPool = others.filter((p) => {
    if (!p.price) return false;
    if (seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });
  // Deterministic rotate based on id so each product gets a varied set
  const offset = product.id.charCodeAt(0) % Math.max(relatedPool.length, 1);
  const rotated = [...relatedPool.slice(offset), ...relatedPool.slice(0, offset)];
  const related = rotated.slice(0, 6).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? '₹ —',
    image: p.image,
  }));

  const gallerySources = others.slice(0, 2);
  const gallery = [product.image, ...gallerySources.map((p) => p.image)];
  while (gallery.length < 3) gallery.push(product.image);

  const sale = parsePriceAmount(product.price);
  const discountPool = [15, 20, 25, 30, 35, 40];
  const discountPercent = discountPool[product.id.charCodeAt(product.id.length - 1) % discountPool.length];
  const originalAmount = sale ? Math.round(sale / (1 - discountPercent / 100)) : null;
  const originalRounded =
    originalAmount != null ? Math.ceil(originalAmount / 50) * 50 : null;

  return {
    id: product.id,
    title: product.title,
    price: product.price ?? '₹ —',
    originalPrice: originalRounded != null ? formatInr(originalRounded) : undefined,
    discountPercent: originalRounded != null ? discountPercent : undefined,
    image: product.image,
    freeShip: product.freeShip,
    rating: 4.8,
    reviews: 231,
    colors: ['#2B2B2B', '#E8DCC8', '#D0D4DA'],
    gallery,
    related,
    description: `Make every occasion memorable with ${product.title}. Carefully selected for quality and presentation, it arrives gift-ready with premium finishing details. Designed to delight — whether you’re surprising someone special or treating yourself.`,
    packageIncludes: [
      `1 × ${product.title}`,
      'Premium gift box with ribbon',
      'Protective inner padding',
      'Care & usage card',
      'Complimentary greeting note',
    ],
    seller: {
      name: 'Givit Official',
      location: 'Mumbai, India',
      rating: 4.9,
      orders: '2.4k+',
    },
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

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z"
        stroke={TEXT}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M10 18.5a2 2 0 0 0 4 0" stroke={TEXT} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={BLUE} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CategoryChipIcon({ name, active }: { name: string; active: boolean }) {
  const c = active ? BLUE : MUTED;
  if (name === 'Gifts') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Z" stroke={c} strokeWidth={1.7} />
        <Path d="M3 7h18v3H3V7Z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
        <Path d="M12 7v14" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M12 7c-2.2-3.2-5.5-2.4-5.5-.6C6.5 8.2 9 9 12 10" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M12 7c2.2-3.2 5.5-2.4 5.5-.6C17.5 8.2 15 9 12 10" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === 'Flowers') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="10" r="2.2" fill={c} />
        <Path d="M12 8c0-2.4 1.6-4 3.2-4-0.2 2-1.4 3.4-3.2 4Z" stroke={c} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M12 8c0-2.4-1.6-4-3.2-4 0.2 2 1.4 3.4 3.2 4Z" stroke={c} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M14 10c2.2-.8 4 .4 4.2 2.2-2 .2-3.4-.8-4.2-2.2Z" stroke={c} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M10 10c-2.2-.8-4 .4-4.2 2.2 2 .2 3.4-.8 4.2-2.2Z" stroke={c} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M12 12.2V19" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M12 16c-1.6 1-3 1.2-4 .8" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === 'Plants') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path d="M12 20V11" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M12 12c-3.2-1-5.5.2-6.5 2.8 2.8.4 5-.6 6.5-2.8Z" stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M12 10c3-2.2 5.8-1.6 7 .6-2.6 1.2-5 .6-7-.6Z" stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M9 20h6" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === 'Fashion') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M8 5.5 12 8l4-2.5 2.5 2L16 10v10H8V10L5.5 7.5 8 5.5Z"
          stroke={c}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
        <Path d="M12 8v12" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === 'Tech') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Rect x="6" y="3.5" width="12" height="17" rx="2.5" stroke={c} strokeWidth={1.7} />
        <Path d="M10 17.5h4" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === 'Gourmet') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path d="M8 3.5v7a2.5 2.5 0 0 0 5 0v-7" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M10.5 3.5v6" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M10.5 13.5V20" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M16 4v5.5c0 1.4.8 2.2 2 2.5V20" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    );
  }
  // Kids
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="3.2" stroke={c} strokeWidth={1.7} />
      <Path d="M7 19c.6-2.8 2.4-4.2 5-4.2s4.4 1.4 5 4.2" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M8.5 7.2 7 5.5M15.5 7.2 17 5.5" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
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
  if (name === 'exclusives') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3.5 13.9 9h5.6l-4.5 3.4 1.7 5.6L12 14.8 7.3 18l1.7-5.6L4.5 9h5.6L12 3.5Z"
          stroke={c}
          strokeWidth={1.7}
          strokeLinejoin="round"
          fill={active ? BLUE_SOFT : 'none'}
        />
      </Svg>
    );
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

function CartMiniIcon({ color = '#FFFFFF', added = false }: { color?: string; added?: boolean }) {
  if (added) {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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

function stopCardNav(e: unknown) {
  if (typeof (e as { stopPropagation?: () => void }).stopPropagation === 'function') {
    (e as { stopPropagation: () => void }).stopPropagation();
  }
}

function VerifiedIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={BLUE} />
      <Path
        d="M7.5 12.2l3 3 6-6.5"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function VerifiedBadge() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.verifiedWrap}>
      <Pressable
        onPress={(e) => {
          stopCardNav(e);
          setOpen((v) => !v);
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Givit verified"
        style={({ pressed }) => [styles.verifiedBtn, pressed && styles.pressed]}
      >
        <VerifiedIcon />
      </Pressable>

      {open ? (
        <Pressable
          onPress={(e) => {
            stopCardNav(e);
            setOpen(false);
          }}
          style={styles.verifiedTip}
        >
          <Text style={styles.verifiedTipText}>Givit verified</Text>
        </Pressable>
      ) : null}
    </View>
  );
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
        stopCardNav(e);
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

function PriceCartPill({
  price,
  compact,
  inCart,
  onAdd,
}: {
  price: string;
  compact?: boolean;
  inCart?: boolean;
  onAdd: () => void;
}) {
  return (
    <View style={[styles.pricePill, compact && styles.pricePillCompact]}>
      <View style={styles.pricePillInfo}>
        <Text style={[styles.pricePillAmount, compact && styles.pricePillAmountCompact]} numberOfLines={1}>
          {price}
        </Text>
        {!compact ? (
          <Text style={styles.pricePillTax} numberOfLines={1} ellipsizeMode="tail">
            Inclu. of all taxes
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={(e) => {
          stopCardNav(e);
          onAdd();
        }}
        accessibilityRole="button"
        accessibilityLabel={inCart ? 'Added to cart' : 'Add to cart'}
        style={({ pressed }) => [
          styles.pricePillCart,
          inCart && styles.pricePillCartAdded,
          pressed && styles.pressed,
        ]}
      >
        <CartMiniIcon added={!!inCart} />
      </Pressable>
    </View>
  );
}

function PromoBannerCarousel() {
  const [width, setWidth] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(0);
  const listRef = useRef<ScrollView>(null);
  const activeRef = useRef(0);
  const draggingRef = useRef(false);
  const autoPausedUntil = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (width <= 0) return;

    const tick = () => {
      if (draggingRef.current || Date.now() < autoPausedUntil.current) return;
      const next = (activeRef.current + 1) % PROMO_BANNERS.length;
      listRef.current?.scrollTo({ x: next * width, animated: true });
      activeRef.current = next;
      setActive(next);
    };

    const id = setInterval(tick, 3800);
    return () => clearInterval(id);
  }, [width]);

  const pauseAuto = () => {
    draggingRef.current = true;
    autoPausedUntil.current = Date.now() + 5000;
  };

  const resumeAuto = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
    draggingRef.current = false;
    autoPausedUntil.current = Date.now() + 4500;
    if (e && width > 0) {
      const i = Math.round(e.nativeEvent.contentOffset.x / width);
      const clamped = Math.max(0, Math.min(PROMO_BANNERS.length - 1, i));
      activeRef.current = clamped;
      setActive(clamped);
    }
  };

  return (
    <View
      style={styles.bannerCarousel}
      onLayout={(e) => {
        const next = Math.round(e.nativeEvent.layout.width);
        if (next > 0 && next !== width) setWidth(next);
      }}
    >
      {width > 0 ? (
        <Animated.ScrollView
          ref={listRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
          disableIntervalMomentum
          bounces={false}
          overScrollMode="never"
          scrollEventThrottle={16}
          onScrollBeginDrag={pauseAuto}
          onScrollEndDrag={resumeAuto}
          onMomentumScrollEnd={resumeAuto}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
        >
          {PROMO_BANNERS.map((banner, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.94, 1, 0.94],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.72, 1, 0.72],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={banner.id}
                style={[styles.bannerSlide, { width, opacity, transform: [{ scale }] }]}
              >
                <ImageBackground
                  source={banner.image}
                  style={styles.banner}
                  imageStyle={styles.bannerImage}
                >
                  <View style={[styles.bannerOverlay, { backgroundColor: banner.overlay }]} />
                  <View style={styles.bannerCopy}>
                    <Text style={styles.bannerEyebrow}>{banner.eyebrow}</Text>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <View style={styles.bannerPill}>
                      <Text style={styles.bannerPillText}>{banner.pill}</Text>
                    </View>
                  </View>
                  <Text style={styles.bannerFoot}>{banner.foot}</Text>
                </ImageBackground>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      ) : (
        <View style={[styles.banner, styles.bannerPlaceholder]} />
      )}

      <View style={styles.bannerDots}>
        {PROMO_BANNERS.map((banner, i) => (
          <View
            key={banner.id}
            style={[styles.bannerDot, i === active && styles.bannerDotActive]}
          />
        ))}
      </View>
    </View>
  );
}

export function HomeScreen({ onOpenProfile }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('home');
  const [tabDirection, setTabDirection] = useState<TransitionDirection>('none');
  const [category, setCategory] = useState('Gifts');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [exclusiveDetail, setExclusiveDetail] = useState<ExclusiveCard | null>(null);
  const inputRef = useRef<TextInputType>(null);
  const iconPulse = useRef(new Animated.Value(1)).current;
  const switchingRef = useRef(false);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  const cartIdSet = useMemo(() => new Set(cartItems.map((i) => i.id)), [cartItems]);

  const featuredItems = useMemo(() => {
    const fromFeatured = FEATURED.filter((p) => p.categories.includes(category));
    if (fromFeatured.length >= 2) return fromFeatured;
    return ALL_PRODUCTS.filter((p) => p.categories.includes(category) && p.price).slice(0, 4);
  }, [category]);

  const hotItems = useMemo(() => {
    const used = new Set(featuredItems.map((p) => p.id));
    const fromHot = HOT_SALES.filter((p) => p.categories.includes(category) && !used.has(p.id));
    if (fromHot.length >= 2) return fromHot;
    return ALL_PRODUCTS.filter(
      (p) => p.categories.includes(category) && p.price && !used.has(p.id),
    ).slice(0, 6);
  }, [category, featuredItems]);

  const moreItems = useMemo(() => {
    const used = new Set([...featuredItems, ...hotItems].map((p) => p.id));
    const fromMore = MORE_GIFTS.filter((p) => p.categories.includes(category) && !used.has(p.id));
    if (fromMore.length > 0) return fromMore;
    return ALL_PRODUCTS.filter(
      (p) => p.categories.includes(category) && p.price && !used.has(p.id),
    );
  }, [category, featuredItems, hotItems]);

  const recentItems = useMemo(
    () => RECENT.filter((p) => p.categories.includes(category)),
    [category],
  );

  const homeScrollRef = useRef<ScrollView>(null);

  const switchTab = (next: TabKey) => {
    if (next === tab || searchOpen || switchingRef.current) return;
    const from = TAB_ORDER.indexOf(tab);
    const to = TAB_ORDER.indexOf(next);
    setTabDirection(to > from ? 'forward' : 'back');
    switchingRef.current = true;
    setTab(next);
    if (next !== 'exclusives') setExclusiveDetail(null);
    setTimeout(() => {
      switchingRef.current = false;
    }, 320);
  };

  const openExclusiveCard = (card: ExclusiveCard) => {
    if (card.kind === 'category' && card.category) {
      setCategory(card.category);
      setExclusiveDetail(null);
      switchTab('home');
      setTimeout(() => {
        homeScrollRef.current?.scrollTo({ y: 0, animated: false });
      }, 40);
      return;
    }
    setExclusiveDetail(card);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const addToCart = (product?: Product | string) => {
    const resolved =
      typeof product === 'string'
        ? ALL_PRODUCTS.find((p) => p.title === product)
        : product;
    if (!resolved) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === resolved.id);
      if (existing) {
        return prev.map((i) => (i.id === resolved.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: resolved.id,
          title: resolved.title,
          price: resolved.price ?? '₹ —',
          image: resolved.image,
          qty: 1,
        },
      ];
    });
  };

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_SUGGESTIONS;
    const fromSuggestions = SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
    const fromProducts = ALL_PRODUCTS.map((p) => p.title).filter(
      (title) => title.toLowerCase().includes(q) && !fromSuggestions.some((s) => s.toLowerCase() === title.toLowerCase()),
    );
    return [...fromSuggestions, ...fromProducts];
  }, [query]);

  const noSearchMatch = query.trim().length > 0 && filteredSuggestions.length === 0;

  const submitSearchRequest = (type: 'add' | 'ask') => {
    const term = query.trim();
    if (!term) return;
    if (type === 'add') {
      Alert.alert(
        'Request submitted',
        `We’ll look into adding “${term}” to Givit. Thanks for the suggestion!`,
      );
    } else {
      Alert.alert(
        'Availability check',
        `We’ve noted your interest in “${term}”. We’ll let you know if it becomes available.`,
      );
    }
    closeSearch();
  };

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

  const buyNow = () => {
    if (selectedProduct) addToCart(selectedProduct);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  if (cartOpen) {
    return (
      <CheckoutScreen
        items={cartItems}
        onBack={() => setCartOpen(false)}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        onChangeQty={(id, qty) =>
          setCartItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
          )
        }
        onFinalize={() => {
          Alert.alert('Order placed', 'Thanks! Your Givit order is confirmed.');
          setCartItems([]);
          setCartOpen(false);
        }}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        key={selectedProduct.id}
        product={toDetailProduct(selectedProduct)}
        favorited={!!favorites[selectedProduct.id]}
        inCart={cartIdSet.has(selectedProduct.id)}
        cartIds={cartIdSet}
        onBack={() => setSelectedProduct(null)}
        onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
        onShare={() => Alert.alert('Share', 'Sharing coming soon.')}
        onAddToCart={() => addToCart(selectedProduct)}
        onGoToCart={() => {
          setSelectedProduct(null);
          setCartOpen(true);
        }}
        onBuyNow={buyNow}
        onOpenRelated={(productId) => {
          const next = ALL_PRODUCTS.find((p) => p.id === productId);
          if (next) setSelectedProduct(next);
        }}
        onAddRelatedToCart={(productId) => {
          const next = ALL_PRODUCTS.find((p) => p.id === productId);
          if (next) addToCart(next);
        }}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.tabContent}>
        <TransitionHost routeKey={tab} direction={tabDirection}>
          {tab === 'home' ? (
            <ScrollView
              ref={homeScrollRef}
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

                <View style={styles.topActions}>
                  <Pressable
                    style={styles.cartBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Cart"
                    onPress={() => setCartOpen(true)}
                  >
                    <CartIcon />
                    {cartCount > 0 ? (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                  <Pressable
                    style={styles.bellBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Notifications"
                    onPress={() => Alert.alert('Notifications', 'You’re all caught up.')}
                  >
                    <BellIcon />
                    <View style={styles.bellDot} />
                  </Pressable>
                </View>
              </View>

              <PromoBannerCarousel />

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
                      onPress={() => {
                        setCategory(c);
                        homeScrollRef.current?.scrollTo({ y: 0, animated: true });
                      }}
                      style={[styles.catChip, active && styles.catChipActive]}
                    >
                      <CategoryChipIcon name={c} active={active} />
                      <Text style={[styles.catLabel, active && styles.catLabelActive]}>{c}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  {category === 'Gifts' ? 'Featured' : `Featured in ${category}`}
                </Text>
                <View style={styles.dots}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>

              {featuredItems.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
              >
                {featuredItems.map((item) => (
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
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.saleTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                      <VerifiedBadge />
                    </View>
                    <PriceCartPill
                      price={item.price ?? '₹ —'}
                      inCart={cartIdSet.has(item.id)}
                      onAdd={() => addToCart(item)}
                    />
                  </Pressable>
                ))}
              </ScrollView>
              ) : (
                <Text style={styles.categoryEmptyHint}>No featured picks in this category yet.</Text>
              )}

              {hotItems.length > 0 ? (
              <>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  {category === 'Gifts' ? 'Hot sales' : `${category} picks`}
                </Text>
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
                {hotItems.map((item) => (
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
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.saleTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                      <VerifiedBadge />
                    </View>
                    <PriceCartPill
                      price={item.price ?? '₹ —'}
                      compact
                      inCart={cartIdSet.has(item.id)}
                      onAdd={() => addToCart(item)}
                    />
                  </Pressable>
                ))}
              </ScrollView>
              </>
              ) : null}

              {moreItems.length > 0 ? (
              <>
              <View style={[styles.sectionHead, { marginTop: 22 }]}>
                <Text style={styles.sectionTitle}>
                  {category === 'Gifts' ? 'More gifts' : `More ${category}`}
                </Text>
              </View>

              <View style={styles.moreGrid}>
                {moreItems.map((item) => (
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
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.saleTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                      <VerifiedBadge />
                    </View>
                    <PriceCartPill
                      price={item.price ?? '₹ —'}
                      compact
                      inCart={cartIdSet.has(item.id)}
                      onAdd={() => addToCart(item)}
                    />
                  </Pressable>
                ))}
              </View>
              </>
              ) : null}

              {recentItems.length > 0 ? (
              <>
              <View style={[styles.sectionHead, { marginTop: 22 }]}>
                <Text style={styles.sectionTitle}>Recently viewed</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
              >
                {recentItems.map((item) => (
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
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.recentTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                      <VerifiedBadge />
                    </View>
                    <PriceCartPill
                      price={
                        ALL_PRODUCTS.find((p) => p.title === item.title && p.price)?.price ?? '₹ —'
                      }
                      compact
                      inCart={cartIdSet.has(item.id)}
                      onAdd={() => addToCart(item)}
                    />
                  </Pressable>
                ))}
              </ScrollView>
              </>
              ) : null}
            </ScrollView>
          ) : tab === 'categories' ? (
            <LinearGradient colors={['#F7F8FC', '#FFFFFF']} style={styles.categoriesPage}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.categoriesContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.categoriesHeader}>
                  <Text style={styles.categoriesEyebrow}>EXPLORE</Text>
                  <Text style={styles.categoriesHeading}>Categories</Text>
                  <Text style={styles.categoriesLead}>
                    Discover thoughtfully curated gifts by mood and moment
                  </Text>
                </View>

                <Pressable onPress={openSearch} style={styles.categorySearchBar}>
                  <View style={styles.categorySearchIcon}>
                    <SearchIcon />
                  </View>
                  <Text style={styles.categorySearchText} numberOfLines={1}>
                    {query.trim() || CATEGORY_SEARCH_PLACEHOLDER}
                  </Text>
                </Pressable>

                <View style={styles.categoryList}>
                  {CATEGORY_CARDS.map((item, index) => (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setCategory(item.title);
                        switchTab('home');
                        setTimeout(() => {
                          homeScrollRef.current?.scrollTo({ y: 0, animated: false });
                        }, 40);
                      }}
                      style={({ pressed }) => [
                        styles.categoryHeroCard,
                        pressed && styles.categoryHeroPressed,
                      ]}
                    >
                      <LinearGradient
                        colors={[...item.colors]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.categoryGradient}
                      >
                        <View style={[styles.categoryGlow, { backgroundColor: item.glow }]} />
                        <View style={styles.categoryCopy}>
                          <Text style={styles.categoryHeroTitle}>{item.title}</Text>
                          <Text style={styles.categoryTagline}>{item.tagline}</Text>
                          <View style={styles.categoryCta}>
                            <Text style={styles.categoryCtaText}>Shop now</Text>
                            <ChevronRightIcon />
                          </View>
                        </View>
                        <View style={styles.categoryHeroArt}>
                          <CategoryIllustration id={item.id} size={index % 2 === 0 ? 148 : 138} />
                        </View>
                      </LinearGradient>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </LinearGradient>
          ) : tab === 'exclusives' ? (
            exclusiveDetail ? (
              <View style={styles.exclusiveDetail}>
                <Pressable
                  onPress={() => setExclusiveDetail(null)}
                  style={styles.exclusiveBack}
                  hitSlop={8}
                >
                  <Text style={styles.exclusiveBackText}>← Back</Text>
                </Pressable>
                <Image source={exclusiveDetail.image} style={styles.exclusiveDetailLogo} />
                <Text style={styles.exclusiveDetailTitle}>{exclusiveDetail.title}</Text>
                <Text style={styles.exclusiveDetailSub}>
                  This exclusive section is coming soon. We’re curating the best picks for you.
                </Text>
                <Pressable
                  onPress={() => setExclusiveDetail(null)}
                  style={({ pressed }) => [styles.exclusiveSoonBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.exclusiveSoonBtnText}>Browse exclusives</Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.exclusivesContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.exclusivesEyebrow}>GIVIT ONLY</Text>
                <Text style={styles.exclusivesHeading}>Exclusives</Text>
                <Text style={styles.exclusivesLead}>
                  Jump into special stores, deals, and curated collections
                </Text>
                <View style={styles.exclusiveGrid}>
                  {EXCLUSIVE_CARDS.map((card) => (
                    <Pressable
                      key={card.id}
                      onPress={() => openExclusiveCard(card)}
                      style={({ pressed }) => [styles.exclusiveCard, pressed && styles.pressed]}
                    >
                      <View style={styles.exclusiveLogoWrap}>
                        <Image source={card.image} style={styles.exclusiveLogo} resizeMode="cover" />
                      </View>
                      <Text style={styles.exclusiveCardTitle} numberOfLines={2}>
                        {card.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )
          ) : (
            <View style={styles.placeholderTab}>
              <Text style={styles.placeholderTitle}>Profile</Text>
              <Text style={styles.placeholderSub}>Coming next</Text>
              {onOpenProfile ? (
                <Pressable onPress={onOpenProfile} style={styles.linkBtn}>
                  <Text style={styles.linkText}>Account settings</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </TransitionHost>
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {(
          [
            { key: 'home', label: 'Home' },
            { key: 'categories', label: 'Categories' },
            { key: 'exclusives', label: 'Exclusives' },
            { key: 'profile', label: 'Profile' },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => switchTab(item.key)}
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
        <View style={styles.searchModal}>
          <View style={[styles.searchSheet, { paddingTop: Math.max(insets.top, 10) }]}>
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
                    ? ({
                        outlineStyle: 'none',
                        outlineWidth: 0,
                        outlineColor: 'transparent',
                        boxShadow: 'none',
                      } as object)
                    : null)}
                />
              </View>
              <Pressable onPress={closeSearch} style={styles.cancelSearchBtn} hitSlop={8}>
                <Text style={styles.cancelSearchText}>Cancel</Text>
              </Pressable>
            </View>

            <Text style={styles.suggestHeading}>
              {noSearchMatch ? 'No matches' : 'Suggestions'}
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.suggestList}
              contentContainerStyle={styles.suggestListContent}
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
              {noSearchMatch ? (
                <View style={styles.requestPanel}>
                  <Text style={styles.requestTitle}>Can’t find “{query.trim()}”?</Text>
                  <Text style={styles.requestSub}>
                    Request we add it to the app, or ask us to check if it’s available.
                  </Text>
                  <Pressable
                    onPress={() => submitSearchRequest('add')}
                    style={({ pressed }) => [styles.requestPrimaryBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.requestPrimaryText}>Request to add</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => submitSearchRequest('ask')}
                    style={({ pressed }) => [styles.requestSecondaryBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.requestSecondaryText}>Ask if available</Text>
                  </Pressable>
                </View>
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
  tabContent: {
    flex: 1,
    overflow: 'hidden',
  },
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
    flex: 1,
    minWidth: 0,
    height: 44,
    borderRadius: 22,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    overflow: 'hidden',
    borderWidth: 0,
  },
  searchWrapExpanded: {
    flex: 1,
    width: undefined,
    borderWidth: 0,
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
    borderWidth: 0,
    backgroundColor: 'transparent',
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
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FIELD,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FIELD,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
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
  categoriesPage: {
    flex: 1,
  },
  categoriesContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 4,
  },
  categoriesHeader: {
    marginBottom: 18,
  },
  categoriesEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: BLUE,
    marginBottom: 6,
  },
  categoriesHeading: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: TEXT,
    marginBottom: 8,
  },
  categoriesLead: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    maxWidth: 280,
  },
  categorySearchBar: {
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 10px 28px rgba(20, 30, 60, 0.07)' } as object)
      : {
          shadowColor: '#14203C',
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
        }),
  },
  categorySearchText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: MUTED,
  },
  categorySearchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryList: {
    gap: 14,
  },
  categoryHeroCard: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 14px 36px rgba(20, 30, 60, 0.08)' } as object)
      : {
          shadowColor: '#0F172A',
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
        }),
  },
  categoryHeroPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  categoryGradient: {
    minHeight: 148,
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryGlow: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  categoryCopy: {
    flex: 1,
    paddingRight: 8,
    zIndex: 1,
  },
  categoryHeroTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: TEXT,
    marginBottom: 4,
  },
  categoryTagline: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
    marginBottom: 14,
    maxWidth: 150,
  },
  categoryCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 76, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  categoryCtaText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: BLUE,
  },
  categoryHeroArt: {
    width: 132,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  searchModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  suggestHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: MUTED,
    marginBottom: 8,
    marginTop: 4,
  },
  suggestList: {
    flex: 1,
  },
  suggestListContent: {
    paddingBottom: 24,
    flexGrow: 1,
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
  requestPanel: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'stretch',
  },
  requestTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
    textAlign: 'center',
    marginBottom: 6,
  },
  requestSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  requestPrimaryBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  requestPrimaryText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  requestSecondaryBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestSecondaryText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: BLUE,
  },
  bannerCarousel: {
    marginBottom: 16,
  },
  bannerSlide: {
    justifyContent: 'center',
  },
  bannerPlaceholder: {
    backgroundColor: FIELD,
    marginBottom: 0,
  },
  banner: {
    borderRadius: 22,
    minHeight: 168,
    overflow: 'hidden',
    marginBottom: 0,
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
  bannerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D8D8DE',
  },
  bannerDotActive: {
    width: 16,
    backgroundColor: BLUE,
  },
  cats: {
    gap: 8,
    paddingBottom: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
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
    marginBottom: 12,
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
    marginBottom: 12,
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
  verifiedBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  verifiedWrap: {
    position: 'relative',
    zIndex: 5,
    flexShrink: 0,
  },
  verifiedTip: {
    position: 'absolute',
    right: 0,
    top: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E4EA',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 12px rgba(20, 30, 60, 0.08)' } as object)
      : {
          shadowColor: '#14203C',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        }),
  },
  verifiedTipText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: BLUE,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    overflow: 'visible',
    zIndex: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  moreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 0,
  },
  moreCard: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 12,
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
  pricePill: {
    marginTop: 8,
    marginBottom: 2,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    gap: 6,
  },
  pricePillCompact: {
    minHeight: 36,
    paddingLeft: 10,
    borderRadius: 10,
  },
  pricePillInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  pricePillAmount: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: TEXT,
    flexShrink: 0,
  },
  pricePillAmountCompact: {
    fontSize: 13,
  },
  pricePillTax: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    color: MUTED,
    flexShrink: 1,
    minWidth: 0,
  },
  pricePillCart: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricePillCartAdded: {
    backgroundColor: '#0F9D58',
  },
  saleTitle: {
    flex: 1,
    minWidth: 0,
    marginTop: 0,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: TEXT,
  },
  categoryEmptyHint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
    paddingVertical: 12,
  },
  recentCard: {
    width: 190,
    borderRadius: 20,
    padding: 14,
    minHeight: 190,
    marginBottom: 12,
  },
  recentImg: {
    height: 120,
    marginBottom: 0,
  },
  recentTitle: {
    flex: 1,
    minWidth: 0,
    marginTop: 0,
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
  exclusivesContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 8,
  },
  exclusivesEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: BLUE,
    marginBottom: 6,
  },
  exclusivesHeading: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: TEXT,
    marginBottom: 6,
  },
  exclusivesLead: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 20,
  },
  exclusiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 8,
    rowGap: 10,
  },
  exclusiveCard: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  exclusiveLogoWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#F4F4F6',
  },
  exclusiveLogo: {
    width: '100%',
    height: '100%',
  },
  exclusiveCardTitle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: TEXT,
    textAlign: 'center',
    lineHeight: 14,
  },
  exclusiveDetail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  exclusiveBack: {
    position: 'absolute',
    top: 12,
    left: 18,
  },
  exclusiveBackText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: BLUE,
  },
  exclusiveDetailLogo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 18,
    backgroundColor: FIELD,
  },
  exclusiveDetailTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: TEXT,
    textAlign: 'center',
    marginBottom: 10,
  },
  exclusiveDetailSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  exclusiveSoonBtn: {
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exclusiveSoonBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  linkBtn: { marginTop: 12 },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
  },
});
