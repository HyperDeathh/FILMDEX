<p align="center">
  <img src="assets/images/logo.png" width="100" alt="FILMDEX Logo">
</p>

<h1 align="center">FILMDEX</h1>

<p align="center">
  <b>Movie & TV Show Discovery App</b><br>
  Discover thousands of movies and TV shows, save your favorites, and create your personalized watchlist.
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> •
  <a href="README_TR.md">🇹🇷 Türkçe</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/NativeWind-4.2-06B6D4?style=flat-square&logo=tailwindcss" alt="NativeWind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## ✨ Features

- 🎬 **Popular Content** - Browse trending movies and TV shows
- 🔍 **Advanced Search** - Filter by genre and search titles
- 💾 **Save Favorites** - Bookmark your favorite content
- 📜 **Watch History** - Track what you've watched
- 🌙 **Dark Theme** - Modern, eye-friendly design
- 📱 **Cross-Platform** - iOS and Android support

## 📸 Screenshots

<p align="center">
  <i>Coming soon...</i>
</p>

## 🚀 Installation

### Requirements

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [TMDB API Key](https://www.themoviedb.org/documentation/api)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HyperDeathh/FILMDEX.git
   cd FILMDEX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and add your TMDB API key:
   ```bash
   cp .env.example .env
   ```
   
   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the app**
   ```bash
   npx expo start
   ```

## 📁 Project Structure

```
FILMDEX/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   ├── saved.tsx      # Saved items
│   │   └── profile.tsx    # Profile screen
│   ├── movie/[id].tsx     # Movie details
│   └── history.tsx        # Watch history
├── components/            # Reusable components
├── context/               # React Context providers
├── services/              # API services
├── assets/                # Images, fonts, icons
└── website/               # Landing page website
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native + Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Styling | NativeWind (TailwindCSS) |
| State | React Context |
| Storage | AsyncStorage |
| API | TMDB API |
| Animations | Reanimated |

## 🔧 Configuration

### TMDB API

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Get your API key from settings
3. Add it to your `.env` file

### Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or suggestions, feel free to open an issue.

---

<p align="center">
  Built with TMDB API<br>
  <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="120" alt="TMDB">
</p>
