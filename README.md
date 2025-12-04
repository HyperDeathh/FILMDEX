<p align="center">
  <img src="assets/images/logo.png" width="100" alt="FILMDEX Logo">
</p>

<h1 align="center">FILMDEX</h1>

<p align="center">
  <b>Film & Dizi Keşif Uygulaması</b><br>
  Binlerce film ve diziyi keşfedin, izlediklerinizi kaydedin, kişiselleştirilmiş listenizi oluşturun.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/NativeWind-4.2-06B6D4?style=flat-square&logo=tailwindcss" alt="NativeWind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## ✨ Özellikler

- 🎬 **Popüler İçerikler** - Güncel popüler filmler ve diziler
- 🔍 **Gelişmiş Arama** - Türe göre filtreleme ve arama
- 💾 **Kaydetme** - Favori içeriklerinizi kaydedin
- 📜 **İzleme Geçmişi** - İzlediklerinizi takip edin
- 🌙 **Karanlık Tema** - Göz yormayan modern tasarım
- 📱 **Cross-Platform** - iOS ve Android desteği

## 📸 Ekran Görüntüleri

<p align="center">
  <i>Yakında eklenecek...</i>
</p>

## 🚀 Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [TMDB API Key](https://www.themoviedb.org/documentation/api)

### Adımlar

1. **Repoyu klonlayın**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/filmdex.git
   cd filmdex
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın**
   
   `.env` dosyası oluşturun:
   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_here
   ```

4. **Uygulamayı başlatın**
   ```bash
   npx expo start
   ```

## 📁 Proje Yapısı

```
filmdex/
├── app/                    # Expo Router sayfaları
│   ├── (tabs)/            # Tab navigasyon sayfaları
│   │   ├── index.tsx      # Ana sayfa
│   │   ├── search.tsx     # Arama sayfası
│   │   ├── saved.tsx      # Kaydedilenler
│   │   └── profile.tsx    # Profil
│   ├── movie/[id].tsx     # Film detay
│   └── history.tsx        # İzleme geçmişi
├── components/            # Yeniden kullanılabilir bileşenler
├── context/               # React Context dosyaları
├── services/              # API servisleri
├── assets/                # Görseller, fontlar, iconlar
└── website/               # Tanıtım web sitesi
```

## 🛠️ Teknolojiler

| Kategori | Teknoloji |
|----------|-----------|
| Framework | React Native + Expo |
| Dil | TypeScript |
| Navigasyon | Expo Router |
| Styling | NativeWind (TailwindCSS) |
| State | React Context |
| Storage | AsyncStorage |
| API | TMDB API |
| Animasyonlar | Reanimated |

## 🔧 Yapılandırma

### TMDB API

1. [TMDB](https://www.themoviedb.org/) hesabı oluşturun
2. API anahtarınızı alın
3. `.env` dosyasına ekleyin

### Özel Yapılandırmalar

`app.json` dosyasından uygulama ayarlarını düzenleyebilirsiniz:
- Uygulama adı
- İkonlar
- Splash screen
- Tema renkleri

## 📦 Build

### Android APK
```bash
eas build -p android --profile preview
```

### iOS
```bash
eas build -p ios --profile preview
```

## 🤝 Katkıda Bulunun

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📬 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

<p align="center">
  TMDB API kullanılarak geliştirilmiştir.<br>
  <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="120" alt="TMDB">
</p>
