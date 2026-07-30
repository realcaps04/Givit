import { useMemo, useState, type ReactNode } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const TEXT = '#1A1A1A';
const MUTED = '#8A8A96';
const FIELD = '#F3F4F8';
const DANGER = '#E11D48';

export type CheckoutItem = {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType;
  qty: number;
};

type CheckoutStep = 0 | 1 | 2 | 3;

type CheckoutScreenProps = {
  items: CheckoutItem[];
  onBack: () => void;
  onFinalize?: () => void;
  onRemoveItem?: (id: string) => void;
  onChangeQty?: (id: string, qty: number) => void;
};

type Voucher = {
  id: string;
  title: string;
  subtitle: string;
  validUntil: string;
  discountPercent: number;
  icon: 'bag' | 'gift';
};

const STEPS = ['Cart', 'Shipping', 'Payment', 'Review'] as const;

const CARDS = [
  { id: 'c1', brand: 'VISA', last4: '1921', expiry: '07/25', colors: ['#5B8CFF', '#004CFF'] as const },
  { id: 'c2', brand: 'VISA', last4: '5632', expiry: '07/25', colors: ['#A78BFA', '#6366F1'] as const },
];

const VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    title: 'First Purchase',
    subtitle: '5% off for your next order',
    validUntil: 'Valid Until 24 Nov 2026',
    discountPercent: 5,
    icon: 'bag',
  },
  {
    id: 'v2',
    title: 'Gift From Customer Care',
    subtitle: '15% off your entire order',
    validUntil: 'Valid Until 24 Nov 2026',
    discountPercent: 15,
    icon: 'gift',
  },
];

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={TEXT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16" stroke={DANGER} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={DANGER} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M6.5 7l.8 12a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7"
        stroke={DANGER}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M10 11v6M14 11v6" stroke={DANGER} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function MinusIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12h12" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path d="M12 6v12M6 12h12" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" />
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

function BagHeartIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"
        stroke={BLUE}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path d="M9 8V7a3 3 0 0 1 6 0v1" stroke={BLUE} strokeWidth={1.7} strokeLinecap="round" />
      <Path
        d="M12 17.2s-2.4-1.5-2.4-3.3a1.4 1.4 0 0 1 2.4-.9 1.4 1.4 0 0 1 2.4.9c0 1.8-2.4 3.3-2.4 3.3Z"
        fill={BLUE}
      />
    </Svg>
  );
}

function GiftBoxIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="9" width="16" height="11" rx="2" stroke={BLUE} strokeWidth={1.7} />
      <Path d="M3 9h18v3H3V9Z" stroke={BLUE} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M12 9v11" stroke={BLUE} strokeWidth={1.7} />
      <Path d="M12 9c-2-2.8-4.8-2.2-4.8-.6C7.2 10 9.4 10.6 12 11.4" stroke={BLUE} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M12 9c2-2.8 4.8-2.2 4.8-.6C16.8 10 14.6 10.6 12 11.4" stroke={BLUE} strokeWidth={1.6} strokeLinecap="round" />
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

function StepProgress({ step }: { step: CheckoutStep }) {
  return (
    <View style={styles.stepRow}>
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, (active || done) && styles.stepDotOn]}>
              {done ? <CheckIcon /> : <Text style={[styles.stepNum, active && styles.stepNumOn]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, (active || done) && styles.stepLabelOn]} numberOfLines={1}>
              {label}
            </Text>
            {i < STEPS.length - 1 ? <View style={[styles.stepLine, done && styles.stepLineOn]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

function VoucherCard({
  voucher,
  applied,
  onApply,
}: {
  voucher: Voucher;
  applied: boolean;
  onApply: () => void;
}) {
  return (
    <View style={styles.voucherCard}>
      <View style={styles.voucherNotchLeft} />
      <View style={styles.voucherNotchRight} />
      <View style={styles.voucherTop}>
        <Text style={styles.voucherEyebrow}>Voucher</Text>
        <View style={styles.voucherValid}>
          <Text style={styles.voucherValidText}>{voucher.validUntil}</Text>
        </View>
      </View>
      <View style={styles.voucherDash} />
      <View style={styles.voucherBody}>
        <View style={styles.voucherIcon}>
          {voucher.icon === 'bag' ? <BagHeartIcon /> : <GiftBoxIcon />}
        </View>
        <View style={styles.voucherCopy}>
          <Text style={styles.voucherTitle}>{voucher.title}</Text>
          <Text style={styles.voucherSub}>{voucher.subtitle}</Text>
        </View>
        <Pressable
          onPress={onApply}
          style={({ pressed }) => [
            styles.voucherApply,
            applied && styles.voucherApplied,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.voucherApplyText}>{applied ? 'Applied' : 'Apply'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CheckoutScreen({
  items,
  onBack,
  onFinalize,
  onRemoveItem,
  onChangeQty,
}: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<CheckoutStep>(0);
  const [shipping, setShipping] = useState<'home' | 'pickup'>('home');
  const [fullName, setFullName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('12 Palm Grove, Bandra West');
  const [city, setCity] = useState('Mumbai, 400050');
  const [cardId, setCardId] = useState(CARDS[0].id);
  const [payExtra, setPayExtra] = useState<'gpay' | 'apple' | 'paypal' | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parseAmount(i.price) * i.qty, 0),
    [items],
  );

  const appliedVoucher = VOUCHERS.find((v) => v.id === appliedVoucherId) ?? null;
  const discount = appliedVoucher
    ? Math.round((subtotal * appliedVoucher.discountPercent) / 100)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const selectedCard = CARDS.find((c) => c.id === cardId);
  const payLabel = payExtra
    ? payExtra === 'gpay'
      ? 'G Pay'
      : payExtra === 'apple'
        ? 'Apple Pay'
        : 'PayPal'
    : selectedCard
      ? `${selectedCard.brand} •••• ${selectedCard.last4}`
      : 'Card';

  const titles: Record<CheckoutStep, string> = {
    0: 'Confirm cart',
    1: 'Shipping details',
    2: 'Payment & coupons',
    3: 'Review order',
  };

  const footerLabel: Record<CheckoutStep, string> = {
    0: 'CONFIRM PRODUCTS',
    1: 'CONFIRM SHIPPING',
    2: 'CONTINUE TO REVIEW',
    3: 'FINALIZE PURCHASE',
  };

  const canContinue =
    items.length > 0 &&
    (step !== 1 ||
      (shipping === 'pickup'
        ? fullName.trim().length > 1 && phone.trim().length > 5
        : fullName.trim().length > 1 &&
          phone.trim().length > 5 &&
          address.trim().length > 3 &&
          city.trim().length > 2));

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep((s) => (s - 1) as CheckoutStep);
  };

  const handlePrimary = () => {
    if (!canContinue) return;
    if (step < 3) setStep((s) => (s + 1) as CheckoutStep);
    else onFinalize?.();
  };

  const applyCouponCode = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Enter a coupon code');
      return;
    }
    const match = VOUCHERS.find(
      (v) =>
        v.title.replace(/\s+/g, '').toUpperCase().includes(code) ||
        code === 'GIVIT5' ||
        code === 'GIVIT15' ||
        (code === 'FIRST5' && v.id === 'v1') ||
        (code === 'CARE15' && v.id === 'v2'),
    );
    if (code === 'GIVIT5' || code === 'FIRST5') {
      setAppliedVoucherId('v1');
      setCouponMessage('Coupon applied · 5% off');
      return;
    }
    if (code === 'GIVIT15' || code === 'CARE15') {
      setAppliedVoucherId('v2');
      setCouponMessage('Coupon applied · 15% off');
      return;
    }
    if (match) {
      setAppliedVoucherId(match.id);
      setCouponMessage(`Coupon applied · ${match.discountPercent}% off`);
      return;
    }
    setCouponMessage('Invalid coupon code');
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.topBar}>
        <RoundBtn onPress={handleBack}>
          <BackIcon />
        </RoundBtn>
        <Text style={styles.topTitle}>{titles[step]}</Text>
        <View style={styles.topSpacer} />
      </View>

      <StepProgress step={step} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add gifts from Home to checkout</Text>
          </View>
        ) : null}

        {items.length > 0 && step === 0 ? (
          <>
            <Text style={styles.sectionLead}>Check your items before continuing</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.productRow}>
                <Image source={item.image} style={styles.productImg} resizeMode="cover" />
                <View style={styles.productInfo}>
                  <View style={styles.productTitleRow}>
                    <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <Pressable
                      onPress={() => onRemoveItem?.(item.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Remove from cart"
                      style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                    >
                      <TrashIcon />
                    </Pressable>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <Text style={styles.priceTax}>Incl. taxes</Text>
                  </View>
                  <View style={styles.qtyRow}>
                    <Pressable
                      onPress={() => onChangeQty?.(item.id, Math.max(1, item.qty - 1))}
                      disabled={item.qty <= 1}
                      style={({ pressed }) => [
                        styles.qtyBtn,
                        item.qty <= 1 && styles.qtyBtnDisabled,
                        pressed && item.qty > 1 && styles.pressed,
                      ]}
                    >
                      <MinusIcon />
                    </Pressable>
                    <Text style={styles.qtyValue}>{item.qty}</Text>
                    <Pressable
                      onPress={() => onChangeQty?.(item.id, item.qty + 1)}
                      style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
                    >
                      <PlusIcon />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.miniSummary}>
              <Text style={styles.miniSummaryLabel}>
                Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
              </Text>
              <Text style={styles.miniSummaryValue}>{formatInr(subtotal)}</Text>
            </View>
          </>
        ) : null}

        {items.length > 0 && step === 1 ? (
          <>
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

            <Text style={styles.sectionLabel}>Contact</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor={MUTED}
              style={styles.field}
              {...(Platform.OS === 'web'
                ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                : null)}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={MUTED}
              keyboardType="phone-pad"
              style={styles.field}
              {...(Platform.OS === 'web'
                ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                : null)}
            />

            {shipping === 'home' ? (
              <>
                <Text style={styles.sectionLabel}>Delivery address</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street address"
                  placeholderTextColor={MUTED}
                  style={styles.field}
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="City, PIN"
                  placeholderTextColor={MUTED}
                  style={styles.field}
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
              </>
            ) : (
              <View style={styles.pickupBox}>
                <Text style={styles.pickupTitle}>Givit Store · Bandra</Text>
                <Text style={styles.pickupSub}>Ready in 2–4 hours · Free pickup</Text>
              </View>
            )}
          </>
        ) : null}

        {items.length > 0 && step === 2 ? (
          <>
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

            <Text style={styles.vouchersHeading}>Active Vouchers</Text>
            <View style={styles.couponRow}>
              <TextInput
                value={couponCode}
                onChangeText={(t) => {
                  setCouponCode(t);
                  setCouponMessage(null);
                }}
                placeholder="Enter coupon code"
                placeholderTextColor={MUTED}
                autoCapitalize="characters"
                style={styles.couponInput}
                {...(Platform.OS === 'web'
                  ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                  : null)}
              />
              <Pressable
                onPress={applyCouponCode}
                style={({ pressed }) => [styles.couponBtn, pressed && styles.pressed]}
              >
                <Text style={styles.couponBtnText}>Apply</Text>
              </Pressable>
            </View>
            {couponMessage ? (
              <Text
                style={[
                  styles.couponMsg,
                  couponMessage.startsWith('Invalid') || couponMessage.startsWith('Enter')
                    ? styles.couponMsgErr
                    : styles.couponMsgOk,
                ]}
              >
                {couponMessage}
              </Text>
            ) : (
              <Text style={styles.couponHint}>Try GIVIT5 or GIVIT15</Text>
            )}

            {VOUCHERS.map((v) => (
              <VoucherCard
                key={v.id}
                voucher={v}
                applied={appliedVoucherId === v.id}
                onApply={() => {
                  setAppliedVoucherId(v.id);
                  setCouponCode('');
                  setCouponMessage(`Coupon applied · ${v.discountPercent}% off`);
                }}
              />
            ))}
          </>
        ) : null}

        {items.length > 0 && step === 3 ? (
          <>
            <Text style={styles.sectionLead}>Review everything before you pay</Text>

            <View style={styles.reviewBlock}>
              <Text style={styles.reviewBlockTitle}>Products</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.reviewProduct}>
                  <Image source={item.image} style={styles.reviewImg} />
                  <View style={styles.reviewProductInfo}>
                    <Text style={styles.reviewProductTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.reviewProductMeta}>
                      Qty {item.qty} · {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.reviewBlock}>
              <Text style={styles.reviewBlockTitle}>Shipping</Text>
              <Text style={styles.reviewLine}>
                {shipping === 'home' ? 'Home delivery' : 'Pick up in store'}
              </Text>
              <Text style={styles.reviewMuted}>{fullName} · {phone}</Text>
              {shipping === 'home' ? (
                <Text style={styles.reviewMuted}>
                  {address}, {city}
                </Text>
              ) : (
                <Text style={styles.reviewMuted}>Givit Store · Bandra</Text>
              )}
            </View>

            <View style={styles.reviewBlock}>
              <Text style={styles.reviewBlockTitle}>Payment</Text>
              <Text style={styles.reviewLine}>{payLabel}</Text>
              {appliedVoucher ? (
                <Text style={styles.reviewMuted}>
                  Coupon · {appliedVoucher.title} (−{appliedVoucher.discountPercent}%)
                </Text>
              ) : (
                <Text style={styles.reviewMuted}>No coupon applied</Text>
              )}
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
                </Text>
                <Text style={styles.summaryValue}>{formatInr(subtotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>{shipping === 'home' ? 'Free' : '—'}</Text>
              </View>
              {discount > 0 ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>−{formatInr(discount)}</Text>
                </View>
              ) : null}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatInr(total)}</Text>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable
          disabled={!canContinue}
          onPress={handlePrimary}
          style={({ pressed }) => [
            styles.finalizeBtn,
            !canContinue && styles.finalizeDisabled,
            pressed && canContinue && styles.pressed,
          ]}
        >
          <Text style={styles.finalizeText}>{footerLabel[step]}</Text>
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
    marginBottom: 6,
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
    fontSize: 18,
    color: TEXT,
  },
  topSpacer: { width: 40 },
  stepRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    zIndex: 1,
  },
  stepDotOn: {
    backgroundColor: BLUE,
  },
  stepNum: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: MUTED,
  },
  stepNumOn: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: MUTED,
  },
  stepLabelOn: {
    color: BLUE,
  },
  stepLine: {
    position: 'absolute',
    top: 11,
    left: '55%',
    right: '-45%',
    height: 2,
    backgroundColor: '#E4E4EA',
    zIndex: 0,
  },
  stepLineOn: {
    backgroundColor: BLUE,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
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
  sectionLead: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    marginBottom: 14,
    marginTop: 4,
  },
  sectionLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: MUTED,
    marginBottom: 10,
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
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
    gap: 4,
    marginBottom: 4,
  },
  productTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: TEXT,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  productPrice: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: BLUE,
  },
  priceTax: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: MUTED,
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FEE2E8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  qtyRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyValue: {
    minWidth: 18,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: TEXT,
  },
  miniSummary: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EE',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniSummaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
  },
  miniSummaryValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
  },
  shipToggle: {
    flexDirection: 'row',
    backgroundColor: FIELD,
    borderRadius: 999,
    padding: 4,
    marginBottom: 14,
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
  field: {
    height: 48,
    borderRadius: 14,
    backgroundColor: FIELD,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: TEXT,
    marginBottom: 10,
    borderWidth: 0,
  },
  pickupBox: {
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 76, 255, 0.06)',
  },
  pickupTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 4,
  },
  pickupSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
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
  walletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
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
  vouchersHeading: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: TEXT,
    marginBottom: 12,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  couponInput: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: FIELD,
    paddingHorizontal: 14,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: TEXT,
    borderWidth: 0,
  },
  couponBtn: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  couponHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
    marginBottom: 14,
  },
  couponMsg: {
    fontFamily: fonts.medium,
    fontSize: 12,
    marginBottom: 14,
  },
  couponMsgOk: { color: '#0F9D58' },
  couponMsgErr: { color: DANGER },
  voucherCard: {
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  voucherNotchLeft: {
    position: 'absolute',
    left: -8,
    top: '52%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: BLUE,
    zIndex: 2,
  },
  voucherNotchRight: {
    position: 'absolute',
    right: -8,
    top: '52%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: BLUE,
    zIndex: 2,
  },
  voucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  voucherEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: BLUE,
  },
  voucherValid: {
    backgroundColor: '#FEE2E8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  voucherValidText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: DANGER,
  },
  voucherDash: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(0, 76, 255, 0.35)',
    marginHorizontal: 12,
  },
  voucherBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  voucherIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 76, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherCopy: {
    flex: 1,
    minWidth: 0,
  },
  voucherTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 2,
  },
  voucherSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
  },
  voucherApply: {
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  voucherApplied: {
    backgroundColor: '#0F9D58',
  },
  voucherApplyText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  reviewBlock: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8EE',
  },
  reviewBlockTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: MUTED,
    marginBottom: 10,
  },
  reviewProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: FIELD,
  },
  reviewProductInfo: {
    flex: 1,
    minWidth: 0,
  },
  reviewProductTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: TEXT,
  },
  reviewProductMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  reviewLine: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 4,
  },
  reviewMuted: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
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
  discountValue: {
    color: '#0F9D58',
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
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pressed: { opacity: 0.88 },
});
