import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.10)';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';
const GREEN = '#16A34A';
const PINK_CARD = '#F8E8EE';
const CREAM_CARD = '#F7F0E4';

const CATEGORIES = ['Gifts', 'Flowers', 'Fashion', 'Tech', 'Gourmet', 'Kids'];

const HOT_SALES = [
  { id: '1', title: 'Luxury Gift Box', price: '₹ 2,499', freeShip: true, tone: '#EEF2FF' },
  { id: '2', title: 'Perfume Duo Set', price: '₹ 3,199', freeShip: true, tone: '#F3E8FF' },
  { id: '3', title: 'Chocolate Tower', price: '₹ 1,299', freeShip: true, tone: '#FFE8F0' },
];

const RECENT = [
  { id: 'r1', title: 'Smart Watch Gift', tone: PINK_CARD },
  { id: 'r2', title: 'Desk Lamp Set', tone: CREAM_CARD },
];

type TabKey = 'home' | 'bag' | 'favorites' | 'profile';

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
  if (name === 'bag') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 8h12l-1 12H7L6 8Z"
          stroke={c}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path d="M9 8a3 3 0 0 1 6 0" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
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

function GiftThumb({ tone }: { tone: string }) {
  return (
    <View style={[styles.thumb, { backgroundColor: tone }]}>
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Rect x="12" y="18" width="24" height="20" rx="3" fill={BLUE} opacity={0.85} />
        <Path d="M24 18v20M12 27h24" stroke="#FFF" strokeWidth={2} strokeOpacity={0.5} />
        <Path
          d="M24 18c-4-6-8-5.5-8 0 0 2.8 4 5 8 7.2 4-2.2 8-4.4 8-7.2 0-5.5-4-6-8 0Z"
          fill={BLUE}
        />
      </Svg>
    </View>
  );
}

export function HomeScreen({ onOpenProfile }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('home');
  const [category, setCategory] = useState('Gifts');
  const [query, setQuery] = useState('');

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {tab === 'home' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topRow}>
            <View style={styles.searchWrap}>
              <SearchIcon />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search gifts"
                placeholderTextColor={MUTED}
                style={styles.searchInput}
                underlineColorAndroid="transparent"
                {...(Platform.OS === 'web'
                  ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                  : null)}
              />
            </View>
            <Pressable style={styles.bellBtn} accessibilityRole="button" accessibilityLabel="Notifications">
              <BellIcon />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          <View style={styles.banner}>
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerEyebrow}>GIVIT WEEK</Text>
              <Text style={styles.bannerTitle}>40% OFF{'\n'}celebration gifts</Text>
              <View style={styles.bannerPill}>
                <Text style={styles.bannerPillText}>FREE SHIPPING</Text>
              </View>
            </View>
            <View style={styles.bannerArt}>
              <GiftThumb tone="rgba(255,255,255,0.2)" />
            </View>
            <Text style={styles.bannerFoot}>Valid this week · Selected gift sets</Text>
          </View>

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
              <View key={item.id} style={styles.saleCard}>
                <GiftThumb tone={item.tone} />
                <Text style={styles.salePrice}>{item.price}</Text>
                <Text style={styles.saleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.freeShip ? <Text style={styles.freeShip}>Free shipping</Text> : null}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.sectionHead, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Recently viewed</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {RECENT.map((item) => (
              <View key={item.id} style={[styles.recentCard, { backgroundColor: item.tone }]}>
                <Pressable style={styles.favBtn} accessibilityRole="button">
                  <HeartIcon filled color={BLUE} />
                </Pressable>
                <GiftThumb tone="rgba(255,255,255,0.55)" />
                <Text style={styles.recentTitle}>{item.title}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
        <View style={styles.placeholderTab}>
          <Text style={styles.placeholderTitle}>
            {tab === 'bag' ? 'Bag' : tab === 'favorites' ? 'Favorites' : 'Profile'}
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
            { key: 'bag', label: 'Bag' },
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
            >
              <TabIcon name={item.key} active={active} />
              {active ? <Text style={styles.tabLabel}>{item.label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
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
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: TEXT,
    padding: 0,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
  banner: {
    borderRadius: 22,
    backgroundColor: BLUE,
    padding: 18,
    minHeight: 168,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerCopy: { maxWidth: '62%', zIndex: 1 },
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
  bannerArt: {
    position: 'absolute',
    right: 8,
    top: 28,
    opacity: 0.95,
  },
  bannerFoot: {
    marginTop: 18,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
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
  thumb: {
    height: 96,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  favBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
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
