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

const VISA_MARK = require('../../assets/brands/visa.png');

const UPI_APP_ICONS = {
  phonepe: require('../../assets/brands/upi/phonepe.png'),
  gpay: require('../../assets/brands/upi/gpay.png'),
  paytm: require('../../assets/brands/upi/paytm.png'),
  amazonpay: require('../../assets/brands/upi/amazonpay.png'),
  whatsapp: require('../../assets/brands/upi/whatsapp.png'),
  jiopay: require('../../assets/brands/upi/jiopay.png'),
  mobikwik: require('../../assets/brands/upi/mobikwik.png'),
  cred: require('../../assets/brands/upi/cred.png'),
} as const;

type UpiAppId = keyof typeof UPI_APP_ICONS | 'upi';
type PayExtra = UpiAppId | 'cod';

const UPI_APPS: { id: UpiAppId; label: string; icon?: ImageSourcePropType }[] = [
  { id: 'phonepe', label: 'PhonePe', icon: UPI_APP_ICONS.phonepe },
  { id: 'gpay', label: 'GPay', icon: UPI_APP_ICONS.gpay },
  { id: 'paytm', label: 'Paytm', icon: UPI_APP_ICONS.paytm },
  { id: 'amazonpay', label: 'Amazon Pay', icon: UPI_APP_ICONS.amazonpay },
  { id: 'whatsapp', label: 'WhatsApp', icon: UPI_APP_ICONS.whatsapp },
  { id: 'jiopay', label: 'JioPay', icon: UPI_APP_ICONS.jiopay },
  { id: 'mobikwik', label: 'MobiKwik', icon: UPI_APP_ICONS.mobikwik },
  { id: 'upi', label: 'UPI ID' },
];

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
  {
    id: 'c1',
    brand: 'visa' as const,
    last4: '1921',
    expiry: '07/28',
    holder: 'ALEX MORGAN',
    colors: ['#1A1F71', '#0B4F9C', '#2A6FDB'] as const,
  },
  {
    id: 'c2',
    brand: 'mastercard' as const,
    last4: '5632',
    expiry: '11/27',
    holder: 'ALEX MORGAN',
    colors: ['#1C1C1E', '#2C2C2E', '#3A3A3C'] as const,
  },
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

type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
};

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'a1',
    label: 'Home',
    name: 'Alex Morgan',
    phone: '+91 98765 43210',
    line1: '12 Palm Grove, Bandra West',
    line2: 'Mumbai, 400050',
  },
  {
    id: 'a2',
    label: 'Office',
    name: 'Alex Morgan',
    phone: '+91 98765 43210',
    line1: 'WeWork One Horizon, Goregaon East',
    line2: 'Mumbai, 400063',
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

function ChipIcon() {
  return (
    <Svg width={40} height={30} viewBox="0 0 40 30" fill="none">
      <Rect x="0.75" y="0.75" width="38.5" height="28.5" rx="5" fill="#F0D78C" stroke="#D4B45A" strokeWidth={1.5} />
      <Path d="M0.75 10h38.5M0.75 20h38.5" stroke="#C9A84A" strokeWidth={1} opacity={0.55} />
      <Path d="M14 0.75v28.5M26 0.75v28.5" stroke="#C9A84A" strokeWidth={1} opacity={0.55} />
      <Rect x="15.5" y="11.5" width="9" height="7" rx="1.5" fill="#E2C56A" stroke="#C9A84A" strokeWidth={0.8} />
    </Svg>
  );
}

function ContactlessIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M7.5 8.2c2.4 2.2 2.4 5.4 0 7.6" stroke="rgba(255,255,255,0.9)" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M10.8 5.6c3.8 3.5 3.8 9.3 0 12.8" stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M14.2 3c5.2 4.8 5.2 13.2 0 18" stroke="rgba(255,255,255,0.45)" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function VisaLogo() {
  return (
    <Image
      source={VISA_MARK}
      style={{ width: 56, height: 18 }}
      resizeMode="contain"
      accessibilityLabel="Visa"
    />
  );
}

function MastercardLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Svg width={42} height={26} viewBox="0 0 42 26" fill="none">
        <Circle cx="15" cy="13" r="10" fill="#EB001B" />
        <Circle cx="27" cy="13" r="10" fill="#F79E1B" />
        <Path d="M21 5.2a10 10 0 0 1 0 15.6 10 10 0 0 1 0-15.6Z" fill="#FF5F00" />
      </Svg>
    </View>
  );
}

function UpiMark({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={Math.round(size * 0.58)} viewBox="0 0 48 28" fill="none">
      <Path d="M0.8 1.2 14.2 14 0.8 26.8 5.6 26.8 19 14 5.6 1.2Z" fill="#FF671F" />
      <Path
        d="M13.2 1.2 26.6 14 13.2 26.8 18 26.8 31.4 14 18 1.2Z"
        fill="#FFFFFF"
        stroke="#C9CCD4"
        strokeWidth={0.9}
      />
      <Path d="M25.6 1.2 39 14 25.6 26.8 30.4 26.8 43.8 14 30.4 1.2Z" fill="#097A4B" />
    </Svg>
  );
}

function PayAppIcon({
  id,
  size = 28,
}: {
  id: PayExtra | null;
  size?: number;
}) {
  if (!id || id === 'cod') return null;
  if (id === 'upi') return <UpiMark size={size} />;
  const src = UPI_APP_ICONS[id as keyof typeof UPI_APP_ICONS];
  if (!src) return <UpiMark size={size} />;
  return (
    <Image
      source={src}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
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

function StepProgress({
  step,
  onSelect,
  enabled,
}: {
  step: CheckoutStep;
  onSelect: (next: CheckoutStep) => void;
  enabled: boolean;
}) {
  return (
    <View style={styles.stepRow}>
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        const reachable = enabled;
        return (
          <Pressable
            key={label}
            disabled={!reachable || active}
            onPress={() => onSelect(i as CheckoutStep)}
            style={({ pressed }) => [
              styles.stepItem,
              pressed && reachable && !active && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled: !reachable || active }}
            accessibilityLabel={`Go to ${label}`}
          >
            <View style={[styles.stepDot, (active || done) && styles.stepDotOn]}>
              {done ? (
                <CheckIcon />
              ) : (
                <Text style={[styles.stepNum, active && styles.stepNumOn]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, (active || done) && styles.stepLabelOn]} numberOfLines={1}>
              {label}
            </Text>
            {i < STEPS.length - 1 ? <View style={[styles.stepLine, done && styles.stepLineOn]} /> : null}
          </Pressable>
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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_ADDRESSES[0].id);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Other');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [pickupName, setPickupName] = useState('Alex Morgan');
  const [pickupPhone, setPickupPhone] = useState('+91 98765 43210');
  const [cardId, setCardId] = useState(CARDS[0].id);
  const [payExtra, setPayExtra] = useState<PayExtra | null>(null);
  const [upiId, setUpiId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parseAmount(i.price) * i.qty, 0),
    [items],
  );

  const selectedAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) ?? savedAddresses[0] ?? null;

  const appliedVoucher = VOUCHERS.find((v) => v.id === appliedVoucherId) ?? null;
  const discount = appliedVoucher
    ? Math.round((subtotal * appliedVoucher.discountPercent) / 100)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const selectedCard = CARDS.find((c) => c.id === cardId);
  const selectedUpiApp = UPI_APPS.find((a) => a.id === payExtra) ?? null;
  const payLabel = payExtra
    ? payExtra === 'cod'
      ? 'Cash on Delivery'
      : upiId.trim()
        ? `${selectedUpiApp?.label ?? 'UPI'} · ${upiId.trim()}`
        : selectedUpiApp?.label ?? 'UPI'
    : selectedCard
      ? `${selectedCard.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• ${selectedCard.last4}`
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

  const newAddressValid =
    newName.trim().length > 1 &&
    newPhone.trim().length > 5 &&
    newLine1.trim().length > 3 &&
    newLine2.trim().length > 2;

  const canContinue =
    items.length > 0 &&
    (step !== 1 ||
      (shipping === 'pickup'
        ? pickupName.trim().length > 1 && pickupPhone.trim().length > 5
        : addingAddress
          ? newAddressValid
          : !!selectedAddress));

  const handleBack = () => {
    if (step === 1 && addingAddress) {
      setAddingAddress(false);
      return;
    }
    if (step === 0) onBack();
    else setStep((s) => (s - 1) as CheckoutStep);
  };

  const saveNewAddress = () => {
    if (!newAddressValid) return;
    const id = `a${Date.now()}`;
    const next: SavedAddress = {
      id,
      label: newLabel.trim() || 'Other',
      name: newName.trim(),
      phone: newPhone.trim(),
      line1: newLine1.trim(),
      line2: newLine2.trim(),
    };
    setSavedAddresses((prev) => [...prev, next]);
    setSelectedAddressId(id);
    setAddingAddress(false);
    setNewLabel('Other');
    setNewName('');
    setNewPhone('');
    setNewLine1('');
    setNewLine2('');
  };

  const handlePrimary = () => {
    if (!canContinue) return;
    if (step === 1 && shipping === 'home' && addingAddress) {
      saveNewAddress();
      return;
    }
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

      <StepProgress
        step={step}
        enabled={items.length > 0}
        onSelect={(next) => {
          setAddingAddress(false);
          setStep(next);
        }}
      />

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
                onPress={() => {
                  setShipping('home');
                  setAddingAddress(false);
                }}
                style={[styles.shipOption, shipping === 'home' && styles.shipOptionActive]}
              >
                <Text style={[styles.shipOptionText, shipping === 'home' && styles.shipOptionTextActive]}>
                  Home delivery
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShipping('pickup');
                  setAddingAddress(false);
                  if (payExtra === 'cod') setPayExtra(null);
                }}
                style={[styles.shipOption, shipping === 'pickup' && styles.shipOptionActive]}
              >
                <Text style={[styles.shipOptionText, shipping === 'pickup' && styles.shipOptionTextActive]}>
                  Pick up in store
                </Text>
              </Pressable>
            </View>

            {shipping === 'home' ? (
              addingAddress ? (
                <>
                  <Text style={styles.sectionLabel}>Add new address</Text>
                  <View style={styles.labelChips}>
                    {['Home', 'Office', 'Other'].map((label) => (
                      <Pressable
                        key={label}
                        onPress={() => setNewLabel(label)}
                        style={[styles.labelChip, newLabel === label && styles.labelChipActive]}
                      >
                        <Text
                          style={[
                            styles.labelChipText,
                            newLabel === label && styles.labelChipTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Full name"
                    placeholderTextColor={MUTED}
                    style={styles.field}
                    {...(Platform.OS === 'web'
                      ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                      : null)}
                  />
                  <TextInput
                    value={newPhone}
                    onChangeText={setNewPhone}
                    placeholder="Phone number"
                    placeholderTextColor={MUTED}
                    keyboardType="phone-pad"
                    style={styles.field}
                    {...(Platform.OS === 'web'
                      ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                      : null)}
                  />
                  <TextInput
                    value={newLine1}
                    onChangeText={setNewLine1}
                    placeholder="Street address, apartment"
                    placeholderTextColor={MUTED}
                    style={styles.field}
                    {...(Platform.OS === 'web'
                      ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                      : null)}
                  />
                  <TextInput
                    value={newLine2}
                    onChangeText={setNewLine2}
                    placeholder="City, PIN"
                    placeholderTextColor={MUTED}
                    style={styles.field}
                    {...(Platform.OS === 'web'
                      ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                      : null)}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.sectionLabel}>Delivery address</Text>
                  {savedAddresses.map((addr) => {
                    const active = selectedAddressId === addr.id;
                    return (
                      <Pressable
                        key={addr.id}
                        onPress={() => setSelectedAddressId(addr.id)}
                        style={[styles.addressCard, active && styles.addressCardActive]}
                      >
                        <View style={[styles.addressRadio, active && styles.addressRadioActive]}>
                          {active ? <View style={styles.addressRadioDot} /> : null}
                        </View>
                        <View style={styles.addressCopy}>
                          <View style={styles.addressLabelRow}>
                            <Text style={styles.addressLabel}>{addr.label}</Text>
                            {active ? (
                              <View style={styles.addressSelectedPill}>
                                <Text style={styles.addressSelectedText}>Selected</Text>
                              </View>
                            ) : null}
                          </View>
                          <Text style={styles.addressName}>{addr.name}</Text>
                          <Text style={styles.addressPhone}>{addr.phone}</Text>
                          <Text style={styles.addressLines}>
                            {addr.line1}
                            {'\n'}
                            {addr.line2}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                  <Pressable
                    onPress={() => setAddingAddress(true)}
                    style={({ pressed }) => [styles.addAddressBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.addAddressText}>+ Add new address</Text>
                  </Pressable>
                </>
              )
            ) : (
              <>
                <Text style={styles.sectionLabel}>Contact for pickup</Text>
                <TextInput
                  value={pickupName}
                  onChangeText={setPickupName}
                  placeholder="Full name"
                  placeholderTextColor={MUTED}
                  style={styles.field}
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
                <TextInput
                  value={pickupPhone}
                  onChangeText={setPickupPhone}
                  placeholder="Phone number"
                  placeholderTextColor={MUTED}
                  keyboardType="phone-pad"
                  style={styles.field}
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
                <View style={styles.pickupBox}>
                  <Text style={styles.pickupTitle}>Givit Store · Bandra</Text>
                  <Text style={styles.pickupSub}>Ready in 2–4 hours · Free pickup</Text>
                </View>
              </>
            )}
          </>
        ) : null}

        {items.length > 0 && step === 2 ? (
          <>
            <Text style={styles.sectionLabel}>Saved cards</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsRow}
            >
              {CARDS.map((card) => {
                const active = cardId === card.id && !payExtra;
                return (
                  <Pressable
                    key={card.id}
                    onPress={() => {
                      setCardId(card.id);
                      setPayExtra(null);
                    }}
                  >
                    <LinearGradient
                      colors={[...card.colors]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.payCard, active && styles.payCardActive]}
                    >
                      <View style={styles.payCardGlow} />
                      <View style={styles.payCardStripe} />
                      {active ? (
                        <View style={styles.payCardCheck}>
                          <CheckIcon />
                        </View>
                      ) : null}
                      <View style={styles.payCardTop}>
                        <ChipIcon />
                        <View style={styles.payCardTopRight}>
                          <ContactlessIcon />
                        </View>
                      </View>
                      <Text style={styles.payNumber}>
                        4532  ••••  ••••  {card.last4}
                      </Text>
                      <View style={styles.payCardBottom}>
                        <View style={styles.payCardMetaWide}>
                          <Text style={styles.payMetaLabel}>CARD HOLDER</Text>
                          <Text style={styles.payHolder}>{card.holder}</Text>
                        </View>
                        <View style={styles.payCardMeta}>
                          <Text style={styles.payMetaLabel}>VALID THRU</Text>
                          <Text style={styles.payExpiry}>{card.expiry}</Text>
                        </View>
                        <View style={styles.payBrandWrap}>
                          {card.brand === 'visa' ? <VisaLogo /> : <MastercardLogo />}
                        </View>
                      </View>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionLabel}>UPI & wallets</Text>
            <View style={styles.walletGrid}>
              {UPI_APPS.map((w) => {
                const active = payExtra === w.id;
                return (
                  <Pressable
                    key={w.id}
                    onPress={() => setPayExtra(active ? null : w.id)}
                    style={[styles.walletBtn, active && styles.walletBtnActive]}
                    accessibilityRole="button"
                    accessibilityLabel={w.label}
                  >
                    <View style={styles.walletIconWrap}>
                      {w.icon ? (
                        <Image source={w.icon} style={styles.walletIcon} resizeMode="contain" />
                      ) : (
                        <UpiMark size={26} />
                      )}
                    </View>
                    <Text style={[styles.walletLabel, active && styles.walletLabelActive]} numberOfLines={1}>
                      {w.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {payExtra && payExtra !== 'cod' ? (
              <View style={styles.upiBox}>
                <Text style={styles.upiBoxTitle}>
                  {payExtra === 'upi' ? 'Enter UPI ID' : `UPI ID for ${selectedUpiApp?.label}`}
                </Text>
                <TextInput
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="yourname@oksbi"
                  placeholderTextColor={MUTED}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.field}
                  {...(Platform.OS === 'web'
                    ? ({ outlineStyle: 'none', outlineWidth: 0 } as object)
                    : null)}
                />
                <Text style={styles.upiHint}>Example: alex@okaxis · givit@paytm · name@ybl</Text>
              </View>
            ) : null}

            {shipping === 'home' ? (
              <Pressable
                onPress={() => setPayExtra(payExtra === 'cod' ? null : 'cod')}
                style={[styles.codCard, payExtra === 'cod' && styles.codCardActive]}
                accessibilityRole="button"
                accessibilityLabel="Cash on Delivery"
              >
                <View style={[styles.codRadio, payExtra === 'cod' && styles.codRadioActive]}>
                  {payExtra === 'cod' ? <View style={styles.codRadioDot} /> : null}
                </View>
                <View style={styles.codCopy}>
                  <Text style={styles.codTitle}>Cash on Delivery</Text>
                  <Text style={styles.codSub}>Pay with cash when your gift arrives</Text>
                </View>
                <View style={styles.codBadge}>
                  <Text style={styles.codBadgeText}>Home only</Text>
                </View>
              </Pressable>
            ) : null}

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
            <LinearGradient
              colors={['#004CFF', '#2A6FDB', '#5B8CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.reviewHero}
            >
              <Text style={styles.reviewHeroEyebrow}>Ready to gift</Text>
              <Text style={styles.reviewHeroTitle}>Review your order</Text>
              <Text style={styles.reviewHeroSub}>
                {itemCount} item{itemCount === 1 ? '' : 's'} · {formatInr(total)}
              </Text>
            </LinearGradient>

            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHead}>
                <View style={styles.reviewIconBubble}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M6 7h12l1 13H5L6 7Z"
                      stroke={BLUE}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M9 7V5a3 3 0 0 1 6 0v2"
                      stroke={BLUE}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
                <Text style={styles.reviewCardTitle}>Products</Text>
                <Text style={styles.reviewCardCount}>{itemCount}</Text>
              </View>
              {items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.reviewProduct,
                    index < items.length - 1 && styles.reviewProductDivider,
                  ]}
                >
                  <Image source={item.image} style={styles.reviewImg} />
                  <View style={styles.reviewProductInfo}>
                    <Text style={styles.reviewProductTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.reviewQtyPill}>
                      <Text style={styles.reviewQtyText}>Qty {item.qty}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewProductPrice}>{item.price}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHead}>
                <View style={styles.reviewIconBubble}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M3 7h11v10H3V7Z"
                      stroke={BLUE}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M14 10h4l3 3v4h-7v-7Z"
                      stroke={BLUE}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Circle cx="7" cy="18.5" r="1.6" fill={BLUE} />
                    <Circle cx="17.5" cy="18.5" r="1.6" fill={BLUE} />
                  </Svg>
                </View>
                <Text style={styles.reviewCardTitle}>Shipping</Text>
                <View style={styles.reviewTag}>
                  <Text style={styles.reviewTagText}>
                    {shipping === 'home' ? 'Delivery' : 'Pickup'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewLine}>
                {shipping === 'home' ? 'Home delivery' : 'Pick up in store'}
              </Text>
              {shipping === 'home' && selectedAddress ? (
                <View style={styles.reviewDetailBox}>
                  <Text style={styles.reviewDetailStrong}>
                    {selectedAddress.label} · {selectedAddress.name}
                  </Text>
                  <Text style={styles.reviewMuted}>{selectedAddress.phone}</Text>
                  <Text style={styles.reviewMuted}>
                    {selectedAddress.line1}, {selectedAddress.line2}
                  </Text>
                </View>
              ) : (
                <View style={styles.reviewDetailBox}>
                  <Text style={styles.reviewDetailStrong}>
                    {pickupName} · {pickupPhone}
                  </Text>
                  <Text style={styles.reviewMuted}>Givit Store · Bandra</Text>
                  <Text style={styles.reviewMuted}>Ready in 2–4 hours · Free pickup</Text>
                </View>
              )}
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHead}>
                <View style={styles.reviewIconBubble}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Rect
                      x="2.5"
                      y="5"
                      width="19"
                      height="14"
                      rx="2.5"
                      stroke={BLUE}
                      strokeWidth={1.8}
                    />
                    <Path d="M2.5 10h19" stroke={BLUE} strokeWidth={1.8} />
                  </Svg>
                </View>
                <Text style={styles.reviewCardTitle}>Payment</Text>
              </View>
              <View style={styles.reviewPayRow}>
                <View style={styles.reviewPayMark}>
                  {!payExtra && selectedCard?.brand === 'visa' ? (
                    <Image
                      source={VISA_MARK}
                      style={{ width: 40, height: 14, tintColor: '#1A1F71' }}
                      resizeMode="contain"
                    />
                  ) : !payExtra && selectedCard?.brand === 'mastercard' ? (
                    <MastercardLogo />
                  ) : payExtra && payExtra !== 'cod' ? (
                    <PayAppIcon id={payExtra} size={30} />
                  ) : (
                    <Text style={styles.reviewPayFallback}>COD</Text>
                  )}
                </View>
                <View style={styles.reviewProductInfo}>
                  <Text style={styles.reviewLineTight}>{payLabel}</Text>
                  {appliedVoucher ? (
                    <Text style={styles.reviewCouponOn}>
                      {appliedVoucher.title} · −{appliedVoucher.discountPercent}%
                    </Text>
                  ) : (
                    <Text style={styles.reviewMuted}>No coupon applied</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.reviewSummaryCard}>
              <Text style={styles.reviewSummaryTitle}>Order summary</Text>
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
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    −{formatInr(discount)}
                  </Text>
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
          <Text style={styles.finalizeText}>
            {step === 1 && shipping === 'home' && addingAddress
              ? 'SAVE ADDRESS'
              : footerLabel[step]}
          </Text>
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
  addressCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E4E4EA',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  addressCardActive: {
    borderColor: BLUE,
    backgroundColor: 'rgba(0, 76, 255, 0.04)',
  },
  addressRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C8C8D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  addressRadioActive: {
    borderColor: BLUE,
  },
  addressRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  addressCopy: {
    flex: 1,
    minWidth: 0,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addressLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
  },
  addressSelectedPill: {
    backgroundColor: 'rgba(0, 76, 255, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  addressSelectedText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: BLUE,
  },
  addressName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
  },
  addressPhone: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
    marginBottom: 6,
  },
  addressLines: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: TEXT,
    lineHeight: 18,
  },
  addAddressBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  addAddressText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
  },
  labelChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  labelChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: FIELD,
  },
  labelChipActive: {
    backgroundColor: 'rgba(0, 76, 255, 0.12)',
  },
  labelChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: MUTED,
  },
  labelChipTextActive: {
    color: BLUE,
    fontFamily: fonts.semiBold,
  },
  cardsRow: {
    gap: 14,
    paddingRight: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  payCard: {
    width: 290,
    height: 178,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 14px 32px rgba(15, 23, 42, 0.28)' } as object)
      : {
          shadowColor: '#0F172A',
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }),
  },
  payCardGlow: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  payCardStripe: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  payCardActive: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  payCardCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15,157,88,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  payCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  payCardTopRight: {
    marginRight: 28,
  },
  payNumber: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    letterSpacing: 1.8,
    color: '#FFFFFF',
    zIndex: 1,
    marginTop: 18,
  },
  payCardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    zIndex: 1,
  },
  payCardMeta: {
    flexShrink: 0,
  },
  payCardMetaWide: {
    flex: 1,
    minWidth: 0,
  },
  payMetaLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.62)',
    marginBottom: 3,
  },
  payHolder: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  payExpiry: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  payBrandWrap: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minWidth: 52,
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  walletBtn: {
    width: '22.5%',
    minWidth: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E4E4EA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 10,
    gap: 6,
  },
  walletBtnActive: {
    borderColor: BLUE,
    backgroundColor: 'rgba(0, 76, 255, 0.06)',
  },
  walletIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  walletIcon: {
    width: 28,
    height: 28,
  },
  walletLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: MUTED,
    textAlign: 'center',
  },
  walletLabelActive: {
    color: BLUE,
  },
  upiBox: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: FIELD,
  },
  upiBoxTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: TEXT,
    marginBottom: 10,
  },
  upiHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
    marginTop: -2,
  },
  codCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E4E4EA',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  codCardActive: {
    borderColor: BLUE,
    backgroundColor: 'rgba(0, 76, 255, 0.04)',
  },
  codRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C8C8D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codRadioActive: {
    borderColor: BLUE,
  },
  codRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  codCopy: {
    flex: 1,
    minWidth: 0,
  },
  codTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 2,
  },
  codSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
  },
  codBadge: {
    backgroundColor: FIELD,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  codBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: MUTED,
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
  reviewHero: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
    overflow: 'hidden',
  },
  reviewHeroEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.78)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reviewHeroTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  reviewHeroSub: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EAF2',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 12,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)' } as object)
      : {
          shadowColor: '#0F172A',
          shadowOpacity: 0.05,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }),
  },
  reviewCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  reviewIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 76, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: TEXT,
    flex: 1,
  },
  reviewCardCount: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: BLUE,
    backgroundColor: 'rgba(0, 76, 255, 0.08)',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  reviewTag: {
    backgroundColor: FIELD,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  reviewTagText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: MUTED,
  },
  reviewProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  reviewProductDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECF2',
  },
  reviewImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
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
    lineHeight: 19,
  },
  reviewQtyPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: FIELD,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reviewQtyText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: MUTED,
  },
  reviewProductPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: TEXT,
  },
  reviewLine: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 8,
  },
  reviewLineTight: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TEXT,
    marginBottom: 2,
  },
  reviewDetailBox: {
    backgroundColor: FIELD,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  reviewDetailStrong: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: TEXT,
    marginBottom: 2,
  },
  reviewMuted: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
  reviewPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewPayMark: {
    minWidth: 64,
    height: 44,
    borderRadius: 12,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  reviewPayFallback: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: TEXT,
  },
  reviewCouponOn: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#0F9D58',
    marginTop: 2,
  },
  reviewSummaryCard: {
    backgroundColor: 'rgba(0, 76, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 76, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  reviewSummaryTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
    marginBottom: 12,
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
    backgroundColor: 'rgba(0, 76, 255, 0.18)',
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
    color: BLUE,
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
