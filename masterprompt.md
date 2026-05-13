Claude Code Master Prompt — Personal Journal App with Biometric Lock

markdown# CLAUDE CODE MASTER PROMPT
# Project: BioDiary — Personal Journal App with Biometric Lock
# Stack: React Native + Expo | Firebase | Supabase Storage

---

## ROLE

You are a senior React Native engineer and mobile architect with deep expertise in:
- Expo SDK and Expo Go / Expo Dev Client workflows
- Firebase Firestore, Firebase Auth, and Firebase Security Rules
- Supabase Storage for media/file uploads
- Biometric authentication (FaceID / Fingerprint) via expo-local-authentication
- Local device security, data encryption, and secure storage
- React Native performance optimization (FlatList, SectionList, memoization)
- Rich text editing in a React Native context
- Clean architecture: feature-based folder structure, separation of concerns

You write production-grade, well-commented, scalable code. You always anticipate edge
cases, handle errors gracefully, and follow mobile UX best practices.

---

## TASK

Build a complete, production-ready **Personal Journal Mobile App** called **BioDiary**
using React Native with Expo. The app is a private, secure daily diary where users
write entries, attach photos, browse past entries via a calendar, and lock the entire
app behind biometric authentication (FaceID or Fingerprint), with a PIN fallback.

Firebase is used as the primary backend (Auth + Firestore). Supabase Storage is used
exclusively for all file/image uploads. The app must be fully functional, navigable,
and free of placeholder logic. Every screen, every feature, every auth flow must be
implemented end-to-end.

---

## CONTENT

### 1. PROJECT OVERVIEW

**App Name:** BioDiary  
**Tagline:** Your thoughts. Locked. Private. Yours.  
**Platform:** iOS and Android (via Expo)  
**Authentication Strategy:** Two-layer — Firebase Auth (account) + Biometric/PIN (app lock)  
**Storage:** Firebase Firestore (entries, metadata, user settings) + Supabase Bucket (images)  
**Offline Support:** Basic — cache last-fetched entries using AsyncStorage  
**Theme:** Support Light and Dark mode, respecting system preference  

---

### 2. TECH STACK — EXACT PACKAGES

Install and use ONLY the following packages. Do not substitute or add unlisted packages
without flagging it first.

#### Core
- `expo` (latest SDK, target SDK 51+)
- `react-native`
- `typescript` — entire project must be in TypeScript (.tsx / .ts)

#### Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

#### Authentication & Security
- `expo-local-authentication` — biometric (FaceID / Fingerprint)
- `expo-secure-store` — store hashed PIN and encryption key
- `expo-crypto` — SHA-256 PIN hashing
- `expo-screen-capture` — disable screenshots inside the app
- `firebase` (v10+ modular SDK) — Firebase Auth + Firestore
- `@supabase/supabase-js` — Supabase Storage client

#### Rich Text Editor
- `react-native-pell-rich-editor` — rich text entry body
- `react-native-webview` — required peer dependency for Pell

#### Calendar
- `react-native-calendars` (Wix) — calendar view with marked entry dates

#### Image Handling
- `expo-image-picker` — camera and gallery access
- `expo-image-manipulator` — compress images before upload
- `expo-file-system` — local file management
- `expo-media-library` — optional: save photo to device gallery

#### UI & Utilities
- `react-native-gesture-handler`
- `react-native-reanimated`
- `@expo/vector-icons` (Ionicons set)
- `react-native-paper` — base UI component library (Cards, FAB, Dialog, Snackbar)
- `date-fns` — all date formatting and manipulation
- `uuid` — generate unique IDs client-side
- `asyncstorage` via `@react-native-async-storage/async-storage` — offline cache

---

### 3. ENVIRONMENT VARIABLES

Create a `.env` file at the project root with the following keys.
Create a `src/config/env.ts` file that imports and exports them via `expo-constants`.
Never hardcode credentials anywhere in source files.
Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_BUCKET_NAME=biodiary-media

---

### 4. FOLDER STRUCTURE

Generate the complete folder structure below before writing any code.
Every folder must exist. Every file listed must be created.
biodiary/
├── app.json
├── App.tsx
├── .env
├── tsconfig.json
├── babel.config.js
│
├── src/
│   ├── config/
│   │   ├── env.ts               # env variable exports
│   │   ├── firebase.ts          # Firebase app init + exports (auth, db)
│   │   └── supabase.ts          # Supabase client init
│   │
│   ├── types/
│   │   ├── entry.types.ts       # JournalEntry, DailyPhoto, EntryDraft interfaces
│   │   ├── auth.types.ts        # User, BiometricStatus, PINStatus interfaces
│   │   └── navigation.types.ts  # RootStackParamList, TabParamList
│   │
│   ├── constants/
│   │   ├── colors.ts            # Light/Dark theme color tokens
│   │   ├── fonts.ts             # Font size scale
│   │   └── layout.ts            # Spacing, border radius constants
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Firebase Auth state hook
│   │   ├── useBiometric.ts      # Biometric availability + prompt hook
│   │   ├── usePIN.ts            # PIN set/verify/change logic
│   │   ├── useEntries.ts        # Firestore entry CRUD hook
│   │   ├── useCalendar.ts       # Entry dates for calendar marking
│   │   ├── useImageUpload.ts    # Pick → compress → upload to Supabase
│   │   └── useAppLock.ts        # AppState listener, re-lock logic
│   │
│   ├── services/
│   │   ├── auth.service.ts      # Firebase Auth: signIn, signUp, signOut, resetPassword
│   │   ├── entry.service.ts     # Firestore: createEntry, updateEntry, deleteEntry, getEntries
│   │   ├── storage.service.ts   # Supabase: uploadImage, deleteImage, getPublicUrl
│   │   └── secure.service.ts    # expo-secure-store: store/retrieve PIN hash + encryption key
│   │
│   ├── store/
│   │   ├── authStore.ts         # Zustand or Context: current user, biometric state
│   │   ├── entryStore.ts        # Zustand or Context: entries list, selected entry
│   │   └── settingsStore.ts     # Zustand or Context: theme, font size, lock timeout
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx    # Decides: AuthStack vs AppLockScreen vs MainTabs
│   │   ├── AuthNavigator.tsx    # Login / Register / ForgotPassword stack
│   │   └── MainNavigator.tsx    # Bottom tabs: Home, Calendar, Gallery, Settings
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   │
│   │   ├── lock/
│   │   │   ├── BiometricLockScreen.tsx   # FaceID/Fingerprint prompt UI
│   │   │   └── PINLockScreen.tsx         # Fallback PIN entry UI
│   │   │
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx            # SectionList of grouped entries
│   │   │   └── components/
│   │   │       ├── EntryCard.tsx         # Single entry preview card
│   │   │       ├── SectionHeader.tsx     # Date section header
│   │   │       └── EmptyState.tsx        # No entries yet UI
│   │   │
│   │   ├── editor/
│   │   │   ├── EntryEditorScreen.tsx     # Create / Edit entry
│   │   │   └── components/
│   │   │       ├── RichTextToolbar.tsx   # Bold, italic, list, etc.
│   │   │       ├── PhotoStrip.tsx        # Horizontal scroll of attached images
│   │   │       └── MoodSelector.tsx      # Emoji mood picker row
│   │   │
│   │   ├── detail/
│   │   │   ├── EntryDetailScreen.tsx     # Read-only view of a single entry
│   │   │   └── components/
│   │   │       └── PhotoViewer.tsx       # Full-screen image viewer
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarScreen.tsx        # Calendar with marked dates
│   │   │   └── components/
│   │   │       └── DayEntryList.tsx      # Entries for selected day
│   │   │
│   │   ├── gallery/
│   │   │   └── GalleryScreen.tsx         # Grid of all Daily Photos
│   │   │
│   │   └── settings/
│   │       ├── SettingsScreen.tsx
│   │       └── components/
│   │           ├── ChangePINSheet.tsx    # Bottom sheet to change PIN
│   │           ├── ThemeToggle.tsx       # Light / Dark toggle
│   │           ├── LockTimerPicker.tsx   # Auto-lock after X minutes
│   │           └── ExportOptions.tsx     # Export as JSON
│   │
│   └── utils/
│       ├── dateUtils.ts         # groupEntriesByDate(), formatSectionHeader()
│       ├── hashUtils.ts         # hashPIN() using expo-crypto
│       ├── imageUtils.ts        # compressImage(), generateImagePath()
│       └── validationUtils.ts   # entry validators, PIN validators

---

### 5. DATA MODELS

#### TypeScript Interface: JournalEntry
```typescript
interface JournalEntry {
  id: string;                    // uuid v4, generated client-side
  userId: string;                // Firebase Auth UID
  title: string;                 // Max 120 chars
  body: string;                  // Rich text stored as HTML string (from Pell)
  mood: MoodType | null;         // 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited' | null
  tags: string[];                // User-defined tags, max 10
  photos: DailyPhoto[];          // Attached photos
  createdAt: Timestamp;          // Firestore Timestamp
  updatedAt: Timestamp;          // Firestore Timestamp
  isFavorite: boolean;           // Starred/favorite entry
  wordCount: number;             // Auto-calculated on save
}
```

#### TypeScript Interface: DailyPhoto
```typescript
interface DailyPhoto {
  id: string;                    // uuid v4
  entryId: string;               // Parent entry ID
  supabaseUrl: string;           // Public URL from Supabase bucket
  supabasePath: string;          // Storage path for deletion
  caption: string;               // Max 200 chars
  uploadedAt: Timestamp;
  localUri?: string;             // Temporary local URI before upload
}
```

#### TypeScript Interface: UserSettings
```typescript
interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  lockTimeout: 0 | 1 | 5 | 15 | 30;    // Minutes before auto-lock; 0 = immediate
  biometricEnabled: boolean;
  pinEnabled: boolean;
  screenshotBlocked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 6. FIREBASE FIRESTORE SCHEMA

Collections structure in Firestore:
/users/{userId}/

uid: string
email: string
displayName: string
createdAt: Timestamp
lastLoginAt: Timestamp

/users/{userId}/entries/{entryId}/

All fields from JournalEntry interface above

/users/{userId}/settings/userSettings/

All fields from UserSettings interface above


#### Firestore Security Rules (generate this file as firestore.rules):
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /users/{userId}/{document=**} {
allow read, write: if request.auth != null && request.auth.uid == userId;
}
}
}

---

### 7. SUPABASE STORAGE SCHEMA

Bucket name: `biodiary-media`  
Bucket type: Private (access via signed URLs or public based on project choice — use PUBLIC for simplicity)  
Folder structure inside bucket:
biodiary-media/
└── {userId}/
└── {entryId}/
└── {photoId}.jpg

Supabase Storage Policy (Row Level Security):
- Users can only upload/read/delete files inside their own `{userId}/` folder
- File size limit: 10MB per image
- Allowed MIME types: image/jpeg, image/png, image/webp

---

### 8. AUTHENTICATION FLOW — DETAILED

#### 8.1 Firebase Auth (Account Layer)
- **Sign Up:** Email + Password via `createUserWithEmailAndPassword`
  - On success: create `/users/{uid}` document in Firestore
  - On success: create `/users/{uid}/settings/userSettings` with defaults
- **Sign In:** Email + Password via `signInWithEmailAndPassword`
- **Forgot Password:** `sendPasswordResetEmail`
- **Sign Out:** `signOut` + clear AsyncStorage cache + navigate to AuthStack
- **Persist Auth:** Firebase handles this natively; check `onAuthStateChanged` in RootNavigator

#### 8.2 Biometric / PIN Lock (App Layer)
This is SEPARATE from Firebase Auth. A user can be Firebase-authenticated but
still be blocked by the app lock screen on launch or after backgrounding.

**Lock Screen Decision Tree:**
onAuthStateChanged fires → user is logged in?
NO  → Show AuthStack (Login / Register)
YES → Check biometricEnabled in settings
YES → Show BiometricLockScreen
Biometric success → Navigate to MainTabs
Biometric fails 3x → Show PINLockScreen (fallback)
NO  → Check pinEnabled
YES → Show PINLockScreen
NO  → Navigate directly to MainTabs

**AppState Re-lock Logic (useAppLock hook):**
- Listen to `AppState.addEventListener('change', handler)`
- When app goes to `background`: record timestamp in a ref
- When app returns to `active`:
  - Calculate elapsed = now - backgroundTimestamp
  - If elapsed > lockTimeout (from settings): trigger lock screen
  - If lockTimeout === 0: always lock on return

**PIN Storage:**
- Raw PIN is NEVER stored anywhere
- On PIN creation: hash PIN using `expo-crypto` SHA-256 → store hash in `expo-secure-store` with key `biodiary_pin_hash`
- On PIN verification: hash input → compare with stored hash
- Key name in SecureStore: `biodiary_pin_hash`

---

### 9. SCREENS — DETAILED SPECIFICATIONS

#### 9.1 BiometricLockScreen
- Full-screen centered layout with app logo and name
- Display correct icon: FaceID icon on iOS Face ID devices, fingerprint icon otherwise
- On mount: auto-trigger `LocalAuthentication.authenticateAsync()` with message "Unlock BioDiary"
- Show "Use PIN instead" text button below biometric button
- On biometric success: navigate to MainTabs (use navigation.replace, not push)
- On failure: show error message, allow retry up to 3 times, then auto-redirect to PINLockScreen

#### 9.2 PINLockScreen
- Display 4-dot indicator row (filled/empty dots showing PIN progress)
- Numeric keypad (0–9) + delete key, no system keyboard
- Build keypad as a custom component: 3 columns × 4 rows grid
- On correct PIN: navigate to MainTabs
- On wrong PIN: shake animation on dots, increment attempt counter
- After 5 wrong PINs: lock for 30 seconds (show countdown timer), then reset

#### 9.3 HomeScreen
- Header: App name "BioDiary" + date today + greeting ("Good morning, {name}")
- Search bar at top (filter entries by title or body text, client-side)
- SectionList where each section = one date group
  - Section headers use `SectionHeader` component: "Today", "Yesterday", then "Mon, Jan 13 2026"
  - Each item uses `EntryCard` component
- FAB (Floating Action Button) bottom-right: navigate to EntryEditorScreen (new entry)
- Pull-to-refresh: refetch entries from Firestore
- Empty state: Show `EmptyState` component with illustration and "Write your first entry" CTA

**Grouping Logic (in dateUtils.ts):**
- Sort entries by `createdAt` descending
- Group by calendar date (YYYY-MM-DD)
- Label: "Today" if today, "Yesterday" if yesterday, else `format(date, 'EEE, MMM d yyyy')`

#### 9.4 EntryCard Component
- Show: mood emoji (if set) + title + first 80 chars of body (strip HTML tags) + date/time + photo count badge + favorite star
- On press: navigate to EntryDetailScreen with entryId param
- On long press: show action sheet — Edit | Delete | Toggle Favorite

#### 9.5 EntryEditorScreen (Create & Edit)
- Header: "New Entry" or "Edit Entry" + Save button (top right) + Cancel (top left)
- Title input: plain TextInput, large font, placeholder "Give your entry a title..."
- Date display: auto-set to now for new entries, non-editable (tap to override date via DateTimePicker)
- Mood selector: horizontal scrollable row of 6 emoji options, tap to select/deselect
- Rich text editor: `RichEditor` from react-native-pell-rich-editor
  - Toolbar below editor: Bold, Italic, Underline, Bullet List, Numbered List, Indent
- Photo strip: horizontal scroll of attached photos + "Add Photo" plus button
  - Tapping "Add Photo": action sheet — Take Photo | Choose from Library
  - Each photo shows thumbnail + remove (×) button
  - Photo upload happens on Save, not immediately on selection
- Tags input: comma-separated TextInput, shown as chips below editor
- Word count: live count shown in bottom toolbar
- On Save:
  1. Validate: title not empty, body not empty
  2. Upload all new photos to Supabase (call storage.service.ts)
  3. Save entry to Firestore (call entry.service.ts)
  4. Navigate back to HomeScreen, refresh list

#### 9.6 EntryDetailScreen
- Read-only view of full entry
- Show: date, mood emoji + label, title, full rich text body (render HTML via WebView or react-native-render-html)
- Photo strip: tappable thumbnails, tap → full-screen PhotoViewer
- Tags displayed as read-only chips
- Word count + reading time estimate (words / 200)
- Edit FAB: navigate to EntryEditorScreen with entry data
- Delete button: confirmation dialog → delete from Firestore + delete images from Supabase

#### 9.7 CalendarScreen
- Full calendar at top using `react-native-calendars` in `CalendarList` mode
- Marked dates: dots on dates that have entries (fetch all entry dates on load)
- Selected date: highlight in brand color
- Below calendar: `DayEntryList` — FlatList of entries for selected date
- Tapping an entry navigates to EntryDetailScreen
- If no entries on selected date: show subtle "No entries on this day" message

#### 9.8 GalleryScreen
- Grid view (3 columns) of all photos across all entries
- Each cell: photo thumbnail + date overlay at bottom
- On press: show PhotoViewer with entry title and date
- Header shows total photo count
- Empty state if no photos

#### 9.9 SettingsScreen
Sections:
1. **Account:** Display name, email, Change Password, Sign Out
2. **Security:**
   - Biometric lock toggle (only show if device supports it)
   - Change PIN (opens `ChangePINSheet` bottom sheet)
   - Auto-lock timer: segmented control — Immediately | 1 min | 5 min | 15 min | 30 min
   - Block screenshots toggle
3. **Appearance:**
   - Theme: System | Light | Dark
   - Font size: Small | Medium | Large
4. **Data:**
   - Export entries as JSON (generates a .json file and opens share sheet)
   - Delete all entries (confirmation dialog)
   - Delete account (confirmation dialog + Firebase account deletion)

#### 9.10 ChangePINSheet
- Bottom sheet modal
- Step 1: "Enter current PIN" (if PIN already set)
- Step 2: "Enter new PIN"
- Step 3: "Confirm new PIN"
- On mismatch: shake animation + "PINs do not match" error
- On success: update hash in expo-secure-store, show success snackbar

---

### 10. SERVICE LAYER — DETAILED

#### entry.service.ts
createEntry(userId, entryData) → Promise<string>     // returns new entryId
updateEntry(userId, entryId, updates) → Promise<void>
deleteEntry(userId, entryId) → Promise<void>
getEntries(userId) → Promise<JournalEntry[]>          // ordered by createdAt desc
getEntriesByDate(userId, date) → Promise<JournalEntry[]>
getEntryDates(userId) → Promise<string[]>             // returns array of 'YYYY-MM-DD' strings
toggleFavorite(userId, entryId, current) → Promise<void>
searchEntries(userId, query) → Promise<JournalEntry[]>

#### storage.service.ts (Supabase)
uploadImage(userId, entryId, photoId, fileUri, mimeType) → Promise<string>  // returns public URL
deleteImage(supabasePath) → Promise<void>
getSignedUrl(supabasePath) → Promise<string>

#### auth.service.ts
signUp(email, password, displayName) → Promise<User>
signIn(email, password) → Promise<User>
signOut() → Promise<void>
sendPasswordReset(email) → Promise<void>
deleteAccount() → Promise<void>

#### secure.service.ts
storePINHash(hash: string) → Promise<void>
getPINHash() → Promise<string | null>
clearPINHash() → Promise<void>
storeEncryptionKey(key: string) → Promise<void>
getEncryptionKey() → Promise<string | null>

---

### 11. HOOKS — DETAILED BEHAVIOR

#### useBiometric.ts
- On mount: call `LocalAuthentication.hasHardwareAsync()` and `isEnrolledAsync()`
- Expose: `{ isAvailable, isEnrolled, biometricType, authenticate, error }`
- `authenticate()`: calls `authenticateAsync({ promptMessage, cancelLabel, fallbackLabel })`
- Returns `{ success: boolean, error?: string }`

#### useAppLock.ts
- Subscribe to `AppState` changes
- On `background`: store `Date.now()` in a ref
- On `active`: compare elapsed time with `settings.lockTimeout` (converted to ms)
- If lock needed: call `triggerLock()` which sets a global locked state to true
- RootNavigator reads this state to show lock screen

#### useImageUpload.ts
- `pickImage(source: 'camera' | 'library')` → opens picker, returns local URI
- `compressImage(uri)` → uses expo-image-manipulator to resize to max 1200px width, quality 0.8, format JPEG
- `uploadToSupabase(userId, entryId, photoId, uri)` → calls storage.service uploadImage
- Expose: `{ pickImage, uploadToSupabase, isUploading, progress, error }`

---

### 12. OFFLINE SUPPORT

- On successful Firestore fetch: serialize entries array to JSON and save in AsyncStorage with key `biodiary_entries_cache_{userId}`
- On app launch, if network unavailable: load from cache, show subtle "Offline — showing cached entries" banner
- New entries created offline: save to a `biodiary_pending_queue` in AsyncStorage
- When network returns: flush pending queue to Firestore (implement basic retry logic)
- Photos cannot be uploaded offline — show user a warning if they try

---

### 13. THEMING SYSTEM

In `src/constants/colors.ts`, define two palettes:

```typescript
export const lightTheme = {
  background: '#FAFAF8',
  surface: '#FFFFFF',
  primary: '#4A6FA5',         // Brand blue
  primaryLight: '#D6E4F7',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  success: '#10B981',
  accent: '#F59E0B',          // Mood / highlight color
  cardShadow: 'rgba(0,0,0,0.08)',
};

export const darkTheme = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  primary: '#6B9FD4',
  primaryLight: '#1E3A5F',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#374151',
  danger: '#F87171',
  success: '#34D399',
  accent: '#FCD34D',
  cardShadow: 'rgba(0,0,0,0.4)',
};
```

Wrap app in a `ThemeContext` that provides the active theme object. All components
consume theme via `useTheme()` custom hook. Never use hardcoded color strings outside
of `colors.ts`.

---

### 14. ERROR HANDLING STRATEGY

- All service calls wrapped in try/catch
- Custom error types defined in `src/types/errors.ts`
- Firebase errors mapped to user-friendly messages (e.g., `auth/wrong-password` → "Incorrect password. Please try again.")
- Supabase errors logged to console in dev, silently handled in production
- Global error boundary component wrapping the app root
- Network errors show a `react-native-paper` Snackbar, never crash the app
- All async operations show loading states — no UI should ever be unresponsive

---

## DEVELOPMENT PHASES

Implement this project in the following strict phases.
**Do not proceed to the next phase until the current phase is fully working.**
Confirm completion of each phase before continuing.

---

### ✅ PHASE 1 — Project Scaffolding & Configuration
**Goal:** Runnable blank app with all dependencies installed and configured.

Tasks:
1. Initialize Expo project with TypeScript template: `npx create-expo-app biodiary --template expo-template-blank-typescript`
2. Install ALL packages listed in Section 2 exactly
3. Configure `babel.config.js` for Reanimated plugin
4. Create the complete folder structure from Section 4 (empty files with correct exports)
5. Set up `src/config/env.ts` — read from `.env`, export all constants
6. Initialize `src/config/firebase.ts` — init Firebase app, export `auth` and `db`
7. Initialize `src/config/supabase.ts` — init Supabase client, export `supabase`
8. Set up `src/constants/colors.ts`, `fonts.ts`, `layout.ts`
9. Create ThemeContext in `src/store/settingsStore.ts`
10. Verify: `npx expo start` runs without errors on a real device or simulator

**Deliverable:** App launches, shows blank screen, no console errors, Firebase and Supabase clients initialize without throwing.

---

### ✅ PHASE 2 — Authentication (Firebase Layer)
**Goal:** Users can register, log in, log out, and reset password.

Tasks:
1. Implement all methods in `auth.service.ts`
2. Implement `useAuth.ts` hook — expose `{ user, loading, error }`
3. Build `LoginScreen.tsx` — email + password fields, Sign In button, link to Register, link to Forgot Password
4. Build `RegisterScreen.tsx` — display name + email + password + confirm password, validation
5. Build `ForgotPasswordScreen.tsx` — email input, send reset link
6. Build `AuthNavigator.tsx` — stack: Login → Register, Login → ForgotPassword
7. Build `RootNavigator.tsx` — show AuthStack if no user, show placeholder MainScreen if user
8. On Register: create Firestore user document and default settings document
9. Map all Firebase Auth error codes to readable messages

**Deliverable:** Full auth flow working end-to-end. User state persists on app restart.

---

### ✅ PHASE 3 — Biometric & PIN Lock
**Goal:** App is locked by biometric or PIN after Firebase Auth succeeds.

Tasks:
1. Implement `secure.service.ts` — SecureStore wrapper for PIN hash and key
2. Implement `hashUtils.ts` — SHA-256 via expo-crypto
3. Implement `useBiometric.ts` hook
4. Implement `usePIN.ts` hook — setPIN, verifyPIN, clearPIN, isPINSet
5. Build `BiometricLockScreen.tsx` — auto-trigger on mount, retry logic, fallback button
6. Build `PINLockScreen.tsx` — custom numeric keypad, dot indicators, shake animation, attempt limiter with 30s cooldown timer
7. Update `RootNavigator.tsx`:
   - After auth: check biometricEnabled → show BiometricLockScreen or PINLockScreen
   - Introduce `appLocked` state managed by `useAppLock`
8. Implement `useAppLock.ts` — AppState listener + lockTimeout logic
9. On first launch after register: prompt user to set up PIN (mandatory), offer biometric enrollment if available
10. Implement `ChangePINSheet.tsx` in settings

**Deliverable:** App fully locked on launch and after backgrounding. Biometric and PIN flows complete with fallback and attempt limiting.

---

### ✅ PHASE 4 — Core Journal CRUD
**Goal:** Users can create, read, update, and delete journal entries stored in Firestore.

Tasks:
1. Implement all methods in `entry.service.ts`
2. Implement `useEntries.ts` hook — manage entries list state, loading, error
3. Implement `dateUtils.ts` — `groupEntriesByDate()`, `formatSectionHeader()`
4. Build `HomeScreen.tsx` with SectionList, pull-to-refresh, search bar
5. Build `EntryCard.tsx` component with long-press action sheet
6. Build `SectionHeader.tsx` component
7. Build `EmptyState.tsx` component
8. Build `EntryEditorScreen.tsx` — plain text only for now (rich text in Phase 5)
9. Build `EntryDetailScreen.tsx` — full entry view, delete with confirmation
10. Wire navigation: Home → Detail, Home → Editor (new), Detail → Editor (edit)
11. Implement offline cache in `useEntries.ts` using AsyncStorage

**Deliverable:** Full CRUD flow. Entries save to Firestore, appear in grouped SectionList, can be opened, edited, deleted. Offline cache works.

---

### ✅ PHASE 5 — Rich Text Editor
**Goal:** Entry body supports rich text formatting.

Tasks:
1. Integrate `react-native-pell-rich-editor` into `EntryEditorScreen`
2. Build `RichTextToolbar.tsx` — Bold, Italic, Underline, Bullet List, Numbered List, Indent/Outdent, Clear formatting
3. Store body as HTML string in Firestore
4. In `EntryDetailScreen`: render HTML body using `react-native-render-html` (add this package in this phase)
5. Strip HTML tags for preview in `EntryCard` (implement in `validationUtils.ts`)
6. Implement live word count in editor toolbar
7. Handle keyboard avoiding view correctly so toolbar stays above keyboard

**Deliverable:** Full rich text creation and rendering. Word count works. HTML persists correctly in Firestore.

---

### ✅ PHASE 6 — Photo Attachments & Supabase Storage
**Goal:** Users can attach photos to entries; photos upload to Supabase.

Tasks:
1. Implement `storage.service.ts` — uploadImage, deleteImage, getPublicUrl
2. Implement `useImageUpload.ts` hook
3. Implement `imageUtils.ts` — compressImage using expo-image-manipulator
4. Add photo attachment UI to `EntryEditorScreen`:
   - "Add Photo" action sheet (camera / library)
   - `PhotoStrip.tsx` horizontal scroll with thumbnails and remove button
5. On Save: upload all new photos → get Supabase URLs → include in entry data
6. On Delete entry: delete all associated Supabase images
7. In `EntryDetailScreen`: show PhotoStrip, tapping opens `PhotoViewer.tsx` full-screen
8. Handle upload errors: if one photo fails, continue saving entry, flag failed uploads
9. Show upload progress per photo

**Deliverable:** Photos attach to entries, upload to Supabase, display in detail view, deleted when entry deleted.

---

### ✅ PHASE 7 — Calendar View
**Goal:** Users can browse entries by date on a calendar.

Tasks:
1. Implement `useCalendar.ts` — fetch all entry dates for current user
2. Build `CalendarScreen.tsx`:
   - `CalendarList` component from react-native-calendars at top
   - Mark dates with entries using dot indicators in brand color
   - On date select: filter and show entries below
3. Build `DayEntryList.tsx` — FlatList of entries for selected date
4. Tapping entry → EntryDetailScreen
5. Calendar selected date style matches app theme

**Deliverable:** Calendar shows marked dates. Selecting a date shows its entries.

---

### ✅ PHASE 8 — Gallery Screen
**Goal:** All photos viewable in a grid gallery.

Tasks:
1. Build `GalleryScreen.tsx`:
   - Fetch all entries with photos
   - Flatten all `DailyPhoto` objects into a single array
   - Display in 3-column `FlatList` grid
   - Each cell: thumbnail + date chip overlay
2. Tapping a photo: open `PhotoViewer.tsx` full-screen with entry title + date
3. Show photo count in screen header
4. Empty state for no photos

**Deliverable:** Gallery screen displays all photos in a grid with full-screen viewer.

---

### ✅ PHASE 9 — Settings & Polish
**Goal:** Full settings screen, theming, security toggles, and export.

Tasks:
1. Build `SettingsScreen.tsx` with all sections from Section 9.9
2. Implement theme switching (Light / Dark / System) — applies immediately across app
3. Implement font size setting — applies to entry body text
4. Implement screenshot blocking via `expo-screen-capture`
5. Implement auto-lock timer setting
6. Implement JSON export: serialize all entries to JSON, open share sheet
7. Implement "Delete all entries" with double-confirmation dialog
8. Implement "Delete account" — delete Firestore data, Supabase images, then Firebase account
9. Implement account section: display name edit, change password flow

**Deliverable:** All settings functional. Theming live. Screenshot blocked. Export works.

---

### ✅ PHASE 10 — Final QA & Hardening
**Goal:** App is production-ready, performant, and handles all edge cases.

Tasks:
1. Add loading skeletons on HomeScreen, CalendarScreen, GalleryScreen
2. Audit all screens for keyboard avoiding view issues
3. Test biometric flow on real iOS device (FaceID) and Android device (Fingerprint)
4. Test offline flow: airplane mode → browse cache → reconnect → sync
5. Test entry with 10+ photos (performance check)
6. Add `react-native-reanimated` enter/exit animations to EntryCard and LockScreen
7. Implement haptic feedback (`expo-haptics`) on: successful biometric, wrong PIN, save entry, delete entry
8. Ensure all text inputs have correct `keyboardType`, `autoCapitalize`, `returnKeyType`
9. Validate all Firestore Security Rules (test with unauthorized UID)
10. Validate all Supabase Storage RLS policies
11. Final pass: remove all `console.log` debug statements
12. App icon and splash screen setup in `app.json` (use placeholder brand assets)

**Deliverable:** App passes full QA checklist. Performant on mid-range devices. All security layers verified.

---

## CONSTRAINTS

### Hard Rules — Never Violate These

1. **TypeScript only.** Every file must be `.ts` or `.tsx`. No `.js` files. No `any` types without explicit justification comment.

2. **No hardcoded credentials.** Firebase and Supabase keys live exclusively in `.env` and accessed via `src/config/env.ts`. Any violation is a critical bug.

3. **No raw PIN storage.** PINs are always SHA-256 hashed before storing. Never log, display, or transmit raw PIN values.

4. **Phases are sequential.** Do not begin Phase N+1 unless Phase N is confirmed working. If a phase is blocked by a bug, fix the bug before advancing.

5. **No placeholder functions.** Every function exported from a service or hook must be fully implemented. No `// TODO` stubs left in final code.

6. **All Firestore writes go through service layer.** Components and hooks do not directly import or call Firestore. They call service functions only.

7. **All Supabase operations go through storage.service.ts only.** No component imports Supabase client directly.

8. **Error states must be visible.** Every async operation (network, Firestore, Supabase) must have a corresponding error state shown to the user. Silent failures are not acceptable.

9. **Biometric lock cannot be bypassed.** The lock screen must use `navigation.replace()`, never `navigation.navigate()`. The back gesture must be disabled on all lock screens.

10. **No third-party analytics, crash reporting, or tracking SDKs.** This is a private journal. No data leaves the app except to Firebase and Supabase.

### Code Quality Rules

- Use functional components only. No class components.
- Use custom hooks to abstract all business logic out of screen components.
- Screen components handle layout and UI state only.
- Memoize list items with `React.memo`. Use `useCallback` on functions passed to lists.
- No inline styles on re-rendered components. Use `StyleSheet.create()` or theme-derived style objects.
- All navigation params must be typed via `NavigationTypes.ts`.
- Destructure props at the function signature level.

### Expo Go Constraints

- Avoid native modules that require bare workflow unless explicitly needed
- `expo-local-authentication` works on real devices only — add a dev mock flag: `IS_DEV_MOCK_BIOMETRIC=true` in `.env` that skips biometric on simulators
- Test all camera/image picker features on a real device, not simulator
- If any feature requires `expo-dev-client`, flag it clearly with a comment `// REQUIRES DEV CLIENT` and document the ejection step needed

---

## STARTING INSTRUCTION

Begin with **Phase 1** immediately. After completing each task in Phase 1, confirm it
works before proceeding to the next task in that phase. After Phase 1 is fully complete,
output a summary of what was built and wait for confirmation before starting Phase 2.

For every file you create, output the full file content. Do not truncate. Do not
summarize. Write every line.