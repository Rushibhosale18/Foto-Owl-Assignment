# React Native Gallery App - Candidate Submission

## Setup & Running Instructions
1. Navigate to the project directory: `cd GalleryApp`
2. Install dependencies: `npm install`
3. Run Metro Bundler: `npx expo start` or `npm start`
4. Launch Android: Press `a` (or run on physical device via Expo Go)

## Key Libraries Used
- **React Navigation:** Tab & Stack navigation flows
- **Zustand:** Centralized state persistence
- **AsyncStorage:** Local session and favorites storage
- **Expo Media Library:** Cross-platform gallery image saving
- **Expo File System:** Downloading images

## Architecture & Assumptions
- **State Management:** Auth session state syncs directly to local storage to maintain user persistent logins across restarts.
- **Search & Filter:** Search and alphabet filtering run synchronously through a combined memoized filter (`useMemo`).
- **Debounced Search:** Custom hook prevents UI lag during rapid text input.

## Folder Structure
- `src/api`: Data fetching layer
- `src/components`: Generic UI components (Inputs, Buttons, Cards)
- `src/hooks`: Custom hooks for API, debounce, and state persistence
- `src/navigation`: Stack and Tab navigation configurations
- `src/screens`: App screens (Auth, Home, Favorites, Profile)
- `src/store`: Global Zustand stores
- `src/types`: TypeScript definitions
- `src/utils`: Helper functions & form validation
