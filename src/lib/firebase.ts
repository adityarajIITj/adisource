import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Try to initialize Firebase. This may fail during SSR prerendering on Vercel
// when env vars aren't set — that's OK because Firebase is only ever *used*
// inside useEffect / event handlers (client-only). The exports are never
// actually called on the server.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _app: any = null;
try {
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch {
  // Silently fail during SSR when env vars are missing
}

// Exports are always non-null in the browser (env vars present).
// On the server the values are never invoked — only imported.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = _app ? getAuth(_app) : ({} as ReturnType<typeof getAuth>);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = _app ? getFirestore(_app) : ({} as ReturnType<typeof getFirestore>);

const _provider = _app ? new GoogleAuthProvider() : null;
if (_provider) _provider.setCustomParameters({ prompt: "select_account" });
export const googleProvider = (_provider ?? {}) as GoogleAuthProvider;

