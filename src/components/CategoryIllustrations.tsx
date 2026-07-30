import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

export type CategoryIllustrationId =
  | 'tech'
  | 'fashion'
  | 'flowers'
  | 'gourmet'
  | 'kids'
  | 'gifts'
  | 'plants';

type IconProps = { size?: number };

/**
 * Real photography for each category card —
 * curated Unsplash crops matched to the category subject.
 */
const CATEGORY_IMAGES: Record<CategoryIllustrationId, ImageSourcePropType> = {
  tech: {
    uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center&q=80',
  },
  fashion: {
    uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&crop=center&q=80',
  },
  flowers: {
    uri: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop&crop=center&q=80',
  },
  gourmet: {
    uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&crop=center&q=80',
  },
  kids: {
    uri: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop&crop=center&q=80',
  },
  gifts: {
    uri: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=600&fit=crop&crop=center&q=80',
  },
  plants: {
    uri: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop&crop=center&q=80',
  },
};

export function CategoryIllustration({
  id,
  size = 160,
}: { id: CategoryIllustrationId } & IconProps) {
  const height = Math.round(size * 0.92);

  return (
    <View style={[styles.frame, { width: size, height }]}>
      <Image
        source={CATEGORY_IMAGES[id]}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E8EEF8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
