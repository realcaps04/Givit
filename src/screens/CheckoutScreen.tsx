import { useMemo, useState, type ReactNode } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';

export type CheckoutItem = {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType;
  qty: number;
};

type CheckoutScreenProps = {
  items: CheckoutItem[];
  onBack: () => void;
  onFinalize?: () => void;
};

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={TEXT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l5 5L19 7" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function VerifiedMini() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={BLUE} />
      <Path d="M7.5 12.2l3 3 6-6.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
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

function parseAmount(price: string): number {
  const n = Number(price.replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatInr(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

const CARDS = [
  { id: 'c1', brand: 'VISA', last4: '1921', expiry: '07/25', colors: ['#5B8CFF', '#004CFF'] as const },
  { id: 'c2', brand: 'VISA', last4: '5632', expiry: '07/25', colors: ['#A78BFA', '#6366F1'] as const },
];

export function CheckoutScreen({ items, onBack, onFinalize }: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [shipping, setShipping] = useState<'home' | 'pickup'>('home');
  const [cardId, setCardId] = useState(CARDS[0].id);
  const [payExtra, setPayExtra] = useState<'gpay' | 'apple' | 'paypal' | null>(null);
  const [verifiedTip, setVerifiedTip] = useState<string | null>(null);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parseAmount(i.price) * i.qty, 0),
    [items],
  );

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.topBar}>
        <RoundBtn onPress={onBack}>
          <BackIcon />
        </RoundBtn>
        <Text style={styles.topTitle}>Checkout</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add gifts from Home to checkout</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image source={item.image} style={styles.productImg} resizeMode="cover" />
              <View style={styles.productInfo}>
                <View style={styles.productTitleRow}>
                  <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                  <Pressable
                    onPress={() => setVerifiedTip(verifiedTip === item.id ? null : item.id)}
                    hitSlop={8}
                    style={styles.verifiedBtn}
                  >
                    <VerifiedMini />
                  </Pressable>
                </View>
                {verifiedTip === item.id ? (
                  <View style={styles.verifiedTip}>
                    <Text style={styles.verifiedTipText}>Givit verified</Text>
                  </View>
                ) : null}
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <Text style={styles.priceTax}>Including taxes and duties</Text>
                </View>
                {item.qty > 1 ? <Text style={styles.qtyText}>Qty {item.qty}</Text> : null}
              </View>
            </View>
          ))
        )}

        <Text style={styles.sectionLabel}>Shipping method</Text>
        <View style={styles.shipToggle}>
          <Pressable
            onPress={() => setShipping('home')}
            style={[styles.shipOption, shipping === 'home' && styles.shipOptionActive]}
          >
            <Text style={[styles.shipOptionText, shipping === 'home' && styles.shipOptionTextActive]}>
              Home delivery
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShipping('pickup')}
            style={[styles.shipOption, shipping === 'pickup' && styles.shipOptionActive]}
          >
            <Text style={[styles.shipOptionText, shipping === 'pickup' && styles.shipOptionTextActive]}>
              Pick up in store
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Select your payment method</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {CARDS.map((card) => {
            const active = cardId === card.id && !payExtra;
            return (
              <Pressable key={card.id} onPress={() => { setCardId(card.id); setPayExtra(null); }}>
                <LinearGradient
                  colors={[...card.colors]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.payCard, active && styles.payCardActive]}
                >
                  {active ? (
                    <View style={styles.payCardCheck}>
                      <CheckIcon />
                    </View>
                  ) : null}
                  <Text style={styles.payBrand}>{card.brand}</Text>
                  <Text style={styles.payNumber}>**** **** **** {card.last4}</Text>
                  <Text style={styles.payExpiry}>{card.expiry}</Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable style={styles.addNewBtn} onPress={() => undefined}>
          <Text style={styles.addNewText}>+ Add new</Text>
        </Pressable>

        <View style={styles.walletRow}>
          {(
            [
              { id: 'gpay' as const, label: 'G Pay' },
              { id: 'apple' as const, label: 'Apple Pay' },
              { id: 'paypal' as const, label: 'PayPal' },
            ]
          ).map((w) => {
            const active = payExtra === w.id;
            return (
              <Pressable
                key={w.id}
                onPress={() => setPayExtra(active ? null : w.id)}
                style={[styles.walletBtn, active && styles.walletBtnActive]}
              >
                <Text style={[styles.walletText, active && styles.walletTextActive]}>{w.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
            </Text>
            <Text style={styles.summaryValue}>{formatInr(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping cost</Text>
            <Text style={styles.summaryValue}>
              {shipping === 'home' ? 'Free' : '—'}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatInr(subtotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable
          disabled={items.length === 0}
          onPress={onFinalize}
          style={({ pressed }) => [
            styles.finalizeBtn,
            items.length === 0 && styles.finalizeDisabled,
            pressed && items.length > 0 && styles.pressed,
          ]}
        >
          <Text style={styles.finalizeText}>FINALIZE PURCHASE</Text>
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
    marginBottom: 8,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: TEXT,
  },
  topSpacer: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
  },
  productRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
    marginTop: 8,
  },
  productImg: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: FIELD,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  productTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
  },
  verifiedBtn: {
    flexShrink: 0,
  },
  verifiedTip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E4EA',
    marginBottom: 6,
  },
  verifiedTipText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: BLUE,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 8,
  },
  productPrice: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: BLUE,
  },
  priceTax: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
  },
  qtyText: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: MUTED,
  },
  sectionLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: MUTED,
    marginBottom: 10,
    marginTop: 8,
  },
  shipToggle: {
    flexDirection: 'row',
    backgroundColor: FIELD,
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  shipOption: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shipOptionActive: {
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 14px rgba(20,30,60,0.08)' } as object)
      : {
          shadowColor: '#14203C',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }),
  },
  shipOptionText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: MUTED,
  },
  shipOptionTextActive: {
    color: TEXT,
    fontFamily: fonts.semiBold,
  },
  cardsRow: {
    gap: 12,
    paddingRight: 8,
    marginBottom: 12,
  },
  payCard: {
    width: 210,
    height: 118,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
  },
  payCardActive: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  payCardCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBrand: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  payNumber: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
  },
  payExpiry: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  addNewBtn: {
    marginBottom: 12,
  },
  addNewText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
  },
  walletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  walletBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E4E4EA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  walletBtnActive: {
    borderColor: BLUE,
    backgroundColor: 'rgba(0, 76, 255, 0.06)',
  },
  walletText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: TEXT,
  },
  walletTextActive: {
    color: BLUE,
  },
  summary: {
    marginTop: 4,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
  },
  summaryValue: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: TEXT,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8EE',
    marginVertical: 6,
  },
  totalLabel: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: TEXT,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: TEXT,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EE',
    backgroundColor: '#FFFFFF',
  },
  finalizeBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalizeDisabled: {
    opacity: 0.45,
  },
  finalizeText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  pressed: { opacity: 0.88 },
});
