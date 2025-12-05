import { Dimensions, PixelRatio, Platform } from 'react-native';

// Ekran boyutlarını al
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Referans ekran boyutları (iPhone 14 Pro boyutları baz alındı)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Web için maksimum genişlik (mobil simülasyonu için)
const WEB_MAX_WIDTH = 480;
const isWeb = Platform.OS === 'web';
const isWebDesktop = isWeb && SCREEN_WIDTH > 768;

// Web'de kullanılacak efektif genişlik
const getEffectiveWidth = () => {
  if (isWebDesktop) {
    // Desktop'ta mobil genişlik simülasyonu
    return Math.min(SCREEN_WIDTH, WEB_MAX_WIDTH);
  }
  return SCREEN_WIDTH;
};

const EFFECTIVE_WIDTH = getEffectiveWidth();

/**
 * Ekran genişliğinin yüzdesini hesaplar
 * @param percentage - Genişlik yüzdesi (0-100)
 */
export const wp = (percentage: number): number => {
  if (isWebDesktop) {
    // Desktop web'de sabit değerler kullan
    return Math.round((percentage * WEB_MAX_WIDTH) / 100);
  }
  return Math.round((percentage * SCREEN_WIDTH) / 100);
};

/**
 * Ekran yüksekliğinin yüzdesini hesaplar
 * @param percentage - Yükseklik yüzdesi (0-100)
 */
export const hp = (percentage: number): number => {
  if (isWebDesktop) {
    // Desktop web'de yükseklik için minimum değer
    const webHeight = Math.min(SCREEN_HEIGHT, 900);
    return Math.round((percentage * webHeight) / 100);
  }
  return Math.round((percentage * SCREEN_HEIGHT) / 100);
};

/**
 * Referans genişliğe göre boyut ölçekler
 * @param size - Orijinal boyut (px)
 */
export const widthScale = (size: number): number => {
  if (isWebDesktop) {
    // Desktop'ta 1:1 ölçek
    return size;
  }
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  // Minimum ve maksimum ölçek sınırlaması
  const clampedScale = Math.min(Math.max(scale, 0.8), 1.4);
  return Math.round(size * clampedScale);
};

/**
 * Referans yüksekliğe göre boyut ölçekler
 * @param size - Orijinal boyut (px)
 */
export const heightScale = (size: number): number => {
  if (isWebDesktop) {
    return size;
  }
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const clampedScale = Math.min(Math.max(scale, 0.8), 1.4);
  return Math.round(size * clampedScale);
};

/**
 * Ortalama ölçekleme (genişlik ve yükseklik ortalaması)
 * Font boyutları için idealdir
 * @param size - Orijinal boyut (px)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const widthScaled = widthScale(size);
  return Math.round(size + (widthScaled - size) * factor);
};

/**
 * Font boyutunu normalize eder
 * @param size - Font boyutu
 */
export const normalize = (size: number): number => {
  if (isWeb) {
    return size; // Web'de font ölçeklemesi yapma
  }
  
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Önceden hesaplanmış değerler (performans için)
export const responsive = {
  // Platform bilgisi
  isWeb,
  isWebDesktop,
  
  // Ekran boyutları
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  effectiveWidth: EFFECTIVE_WIDTH,
  
  // Tab bar değerleri
  tabBarHeight: isWebDesktop ? 64 : hp(7.5),
  tabBarMarginBottom: isWebDesktop ? 20 : hp(4.2),
  tabBarHorizontalMargin: isWebDesktop ? 20 : wp(5),
  tabBarPadding: isWebDesktop ? 25 : hp(2.9),
  
  // İçerik padding'leri
  contentPaddingBottom: isWebDesktop ? 100 : hp(14),
  contentPaddingBottomLarge: isWebDesktop ? 120 : hp(16.5),
  
  // Kart boyutları
  movieCardHeight: isWebDesktop ? 280 : hp(24.5),
  posterHeight: isWebDesktop ? 500 : hp(65),
  
  // Web desktop için maksimum container genişliği
  webMaxWidth: WEB_MAX_WIDTH,
  webContainerStyle: isWebDesktop ? {
    maxWidth: WEB_MAX_WIDTH,
    marginHorizontal: 'auto' as const,
  } : {},
  
  // Genel spacing
  spacing: {
    xs: isWebDesktop ? 8 : wp(1),
    sm: isWebDesktop ? 12 : wp(2),
    md: isWebDesktop ? 16 : wp(4),
    lg: isWebDesktop ? 24 : wp(6),
    xl: isWebDesktop ? 32 : wp(8),
  }
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };

