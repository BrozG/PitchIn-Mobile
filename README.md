# 📱 Pitch In Mobile App

> *The bridge between vision and capital, right in your pocket.*

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Status](https://img.shields.io/badge/Status-Production_Ready-C9A84C?style=for-the-badge)]()

</div>

---

## 🎯 Overview

The **Pitch In Mobile App** is the heart of the Pitch In platform—a premium investor-founder matching application that transforms fundraising from a chaotic search into an elegant, intentional journey. Built with React Native + Expo, it delivers a native-feel experience on both iOS and Android with psychology-driven design, swipe-based discovery, and real-time deal rooms.

### ✨ Key Features

- **🎭 Dual-Persona Experience**: Seamlessly switch between Founder and Investor modes
- **✨ Glassmorphism Design**: Deep space (`#080C14`) with golden accents (`#C9A84C`)
- **🔄 Swipe-Based Discovery**: Tinder-like interface for founder/investor matching
- **📝 Multi-Step Onboarding**: 6-step founder flow, 4-step investor flow
- **💰 Psychology-Driven Pricing**: Three-tier subscription with anchoring effects
- **🤝 Real-Time Deal Rooms**: WebSocket-powered chat and document sharing
- **🔔 Push Notifications**: Timely alerts for matches, messages, and milestones
- **🎨 Smooth Animations**: Lottie animations and gesture-based interactions

## 📱 Visual Examples

| Role Selection | Founder Onboarding | Investor Discovery |
|----------------|---------------------|---------------------|
| <img src="../resource/mobile-role-selection.png" width="200"> | <img src="../resource/mobile-founder-onboarding.png" width="200"> | <img src="../resource/mobile-investor-discovery.png" width="200"> |

| Deal Room | Pricing Screen | Notifications |
|-----------|----------------|----------------|
| <img src="../resource/mobile-deal-room.png" width="200"> | <img src="../resource/mobile-pricing.png" width="200"> | <img src="../resource/mobile-notifications.png" width="200"> |

*Note: Add your actual screenshots to the resource directory and update paths*

---

## 🏗️ Architecture

```
mobile/
├── App.js                    # Main navigation stack
├── screens/                  # All application screens
│   ├── FounderSignupScreen.js    # 6-step founder onboarding
│   ├── InvestorSignupScreen.js   # 4-step investor profiling
│   ├── InvestorDiscoveryScreen.js # Swipe-based discovery
│   ├── PricingScreen.js          # Subscription tiers with animations
│   ├── DealRoomScreen.js         # Real-time chat and collaboration
│   ├── MatchRequestScreen.js     # Match request management
│   ├── NotificationsScreen.js    # Push notification center
│   └── PendingReviewScreen.js    # Founder approval status
├── components/               # Reusable UI components
│   └── FounderCard.js       # Swipeable founder/investor card
├── assets/                  # Images, icons, animations
└── package.json            # Dependencies and scripts
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go app** on your physical device (iOS/Android)
- **Backend API** running (see main [PitchIn repository](https://github.com/BrozG/PitchIn))

### Installation & Running

```bash
# Clone this repository
git clone https://github.com/BrozG/PitchIn-Mobile.git
cd PitchIn-Mobile

# Install dependencies
npm install

# Start the development server
npx expo start --dev-client
```

### Running Options
- **📱 Physical Device**: Scan QR code with Expo Go app
- **🤖 Android Emulator**: Press 'a' in Expo terminal
- **🍎 iOS Simulator**: Press 'i' in Expo terminal (macOS only)

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend Integration
The mobile app connects to:
- **FastAPI Backend**: `http://localhost:8000` (or your deployed URL)
- **Supabase**: Authentication, real-time, and storage
- **RevenueCat**: Subscription management
- **Stripe/Razorpay**: Payment processing

---

## 🎨 Design System

### Color Palette
- `#080C14` - **Deep Space**: Primary background, represents infinite potential
- `#C9A84C` - **Golden Accent**: CTAs, highlights, represents value and return
- `#1A1F2C` - **Night Structure**: Cards, modals, represents framework
- `#FFFFFF` - **Pure White**: Text, icons, represents clarity
- `#2A2F3C` - **Subtle Elevation**: Secondary elements

### Typography
- **Primary Font**: Inter (via Expo Google Fonts)
- **Headings**: Semi-bold, generous letter spacing
- **Body**: Regular weight, optimal line height for readability
- **Monospace**: JetBrains Mono for code snippets

### Animations
- **Lottie Files**: Complex animations for onboarding and success states
- **Reanimated 2**: Gesture-driven interactions (swipes, pulls)
- **Shared Element Transitions**: Smooth navigation between screens

---

## 📱 Screen Flow

### Founder Journey
1. **Splash Screen** → **Role Selection** → **Founder Onboarding** (6 steps)
2. **Pending Review** (admin approval) → **Investor Discovery** (swipe)
3. **Match Requests** → **Deal Room** → **Payment** (if applicable)

### Investor Journey
1. **Splash Screen** → **Role Selection** → **Investor Profiling** (4 steps)
2. **Founder Discovery** (swipe with gating) → **Match Requests**
3. **Deal Room** → **Subscription Management**

---

## 🔌 API Integration

### Key Endpoints
```javascript
// Authentication
POST /auth/login
  - Request: { email, password }
  - Response: { access_token, refresh_token, user }

POST /auth/register
  - Request: { email, password, role }
  - Response: { user_id }

POST /auth/refresh
  - Request: { refresh_token }
  - Response: { access_token }

// Founders
POST /founders/onboarding
  - Request: { name, company, stage, industry, ... }
  - Response: { status: "pending" | "approved" }

GET  /founders/me
  - Response: Full founder profile

GET  /founders/discover
  - Query: ?page=1&limit=10
  - Response: Paginated investor matches

// Investors
POST /investors/onboarding
  - Request: { name, firm, thesis, industries, ... }
  - Response: { status: "complete" }

GET  /investors/me
  - Response: Full investor profile

GET  /investors/discover
  - Query: ?page=1&limit=10
  - Response: Paginated founder matches

// Matches
POST /matches/request
  - Request: { to_user_id, message }
  - Response: { match_id }

GET  /matches/pending
  - Response: List of pending match requests

POST /matches/accept
  - Request: { match_id }
  - Response: { deal_room_id }

// Deal Rooms
GET  /deal-rooms/{room_id}
  - Response: { messages: [...], documents: [...] }

POST /deal-rooms/{room_id}/message
  - Request: { text }
  - Response: { message_id }
```

### Real-Time Features
- **WebSocket Connections**: Deal room chat (ws://localhost:8000/ws)
- **Supabase Realtime**: Match notifications, status updates (channels: 'match_requests')
- **Push Notifications**: Expo Notifications for background alerts

---

## 💰 Subscription Tiers

### 1. **Explorer** (Free)
- Limited swipes per day (5)
- Basic founder profiles
- 24-hour match expiration
- Watermarked documents

### 2. **Connector** ($49/month)
- Unlimited swipes
- Full founder profiles with financials
- 7-day match expiration
- Document storage (500MB)
- Priority support

### 3. **Partner** ($199/month)
- Everything in Connector
- AI-powered match recommendations
- Deal room analytics
- White-label branding
- Dedicated account manager

---

## 🧪 Testing

### Unit Tests
```bash
npm test
# Runs Jest tests in __tests__ directories
```

### Component Tests
```bash
npm run test:components
# Tests React components using React Testing Library
```

### E2E Tests (Detox)
```bash
# iOS
npm run e2e:ios

# Android
npm run e2e:android

# Common flags:
# --cleanup: Remove artifacts after tests
# --record: Record test execution video
# --debug: Pause on test failures
```

### Test Coverage
```bash
npm run test:coverage
# Generates coverage report in coverage/ directory
```

### Testing Best Practices
- Test critical user flows: onboarding, matching, payments
- Mock API responses for reliable testing
- Use test IDs for UI elements
- Run tests on CI before merging PRs

---

## 📦 Building for Production

### Android APK
```bash
eas build --platform android --profile production
```

### iOS IPA
```bash
eas build --platform ios --profile production
```

### App Store Submission
1. Update `app.json` with correct bundle identifiers
2. Configure app icons in `assets/`
3. Run production build
4. Submit to Google Play Store / Apple App Store

---

## 🔒 Security

- **JWT Authentication**: Secure token-based auth with refresh
- **SSL Pinning**: Certificate validation for API calls
- **Secure Storage**: Expo SecureStore for sensitive data
- **Input Validation**: Client-side validation for all forms
- **Rate Limiting**: API call throttling to prevent abuse

---

## 🐛 Troubleshooting

### Common Issues

1. **"Unable to resolve module"**
   ```bash
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

2. **"Network request failed"**
   - Ensure backend is running on `http://localhost:8000`
   - Check `.env` configuration
   - Verify no firewall blocking ports
   - Test connection: `curl http://localhost:8000/health`

3. **"Expo Go connection issues"**
   - Ensure device and computer are on same network
   - Try `npx expo start --tunnel`
   - Use `npx expo start --lan` for local network
   - Reset network: `expo r -c`

4. **"Build failures"**
   - Clear Expo cache: `npx expo start --clear`
   - Check Node.js version (requires 18+)
   - Verify all dependencies are compatible

5. **"Push notifications not working"**
   - Verify Expo push token is generated
   - Check notification permissions on device
   - Ensure backend is configured with Expo access token

6. **"Real-time features not updating"**
   - Check WebSocket connection status
   - Verify Supabase Realtime is enabled
   - Ensure correct channel subscriptions

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is part of the **Pitch In** platform. See the main repository for licensing information.

---

## 🙏 Acknowledgments

- **React Native Community** for an amazing cross-platform framework
- **Expo Team** for simplifying mobile development
- **Supabase** for backend-as-a-service
- **All contributors** who help make Pitch In better

---

<div align="center">
  <br>
  <h3>Ready to transform fundraising?</h3>
  <p>Download the app. Make your first match. Build the future.</p>
  <br>
  <img src="https://img.shields.io/badge/Platform-iOS%20%26%20Android-080C14" alt="Platform">
  <img src="https://img.shields.io/badge/Design-Glassmorphism-C9A84C" alt="Design">
  <img src="https://img.shields.io/badge/Psychology-Driven-Yes-1A1F2C" alt="Psychology">
  <br><br>
  <em>Pitch In Mobile — Where connections happen on the go</em>
</div>