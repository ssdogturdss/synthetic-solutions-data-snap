# DataSnap

Production-ready Expo + React Native app for cryptographically secure key generation (Promo, Paid, API) with GitHub integration.

## Setup

1. `npm install`
2. Add `EXPO_PUBLIC_GITHUB_CLIENT_ID` to your `.env` (create OAuth app in GitHub → Settings → Developer settings → OAuth Apps)
3. `npx expo start`

## GitHub Integration

- Uses device flow (no redirect URL needed)
- Token stored securely with expo-secure-store
- List repos + create issues from keys

## Key Generator

Premium UI for generating 3 key types with full config, status tracking, copy/share/revoke. All persisted with MMKV.