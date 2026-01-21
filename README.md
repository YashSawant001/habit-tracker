# 🚀 Habit Tracker: A 36-Hour Engineering Marathon

A personalized habit tracking monorepo featuring a **React Native (Expo)** mobile app and a **Web** dashboard. Built to track daily tasks with verification links and AI-generated progress insights.

## 🛠 The "Fortress" Stack
- **Frontend**: React Native, Expo SDK 52, React 18.3.1
- **Web**: React (via anything.com conversion)
- **AI**: Claude-engineered logic for habit verification and reporting
- **Deployment**: EAS Build (Android APK/AAB)

## 🧗 The 36-Hour Build Struggle
This project is a testament to technical resilience. Deploying the native Android version required a 36-hour debugging marathon due to version mismatches between Expo and React Native.

### Key Technical Victories:
- **Custom Config Plugin**: Developed `withFixGradle.js` to surgically bypass Gradle property crashes and version assertions.
- **Dependency Alignment**: Resolved a "Version Tug-of-War" by manually anchoring the project to stable SDK 52/React 18 foundation.
- **Free Tier Engineering**: Managed deployment across 3 different platforms on 100% free tiers, navigating 1-3 hour EAS build queues for every test iteration.

## 📂 Architecture
- `/apps/mobile`: The Expo-based Android application.
- `/apps/web`: The web version of the tracker.
- `withFixGradle.js`: The "shield" plugin that makes the native build possible.
