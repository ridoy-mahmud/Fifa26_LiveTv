import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth, type GoogleAuthProvider as GoogleAuthProviderType } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCvtaQo4jSgAym8XpyC2-kYMqPfmt2LMU8",
  authDomain: "sunlit-context-450609-v6.firebaseapp.com",
  projectId: "sunlit-context-450609-v6",
  storageBucket: "sunlit-context-450609-v6.firebasestorage.app",
  messagingSenderId: "945079709177",
  appId: "1:945079709177:web:929228df767a788a26e128",
};

export const ADMIN_EMAIL = "mahamulhasan38@gmail.com";

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let firebaseAuth: Auth | null = null;
let googleAuthProvider: GoogleAuthProviderType | null = null;

export function getFirebaseApp() {
  if (typeof window === "undefined") return null;
  if (!firebaseApp) {
    const apps = getApps();
    if (apps.length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null;
  if (!firebaseAuth) {
    const app = getFirebaseApp();
    if (app) {
      firebaseAuth = getAuth(app);
    }
  }
  return firebaseAuth;
}

export function getGoogleAuthProvider() {
  if (typeof window === "undefined") return null;
  if (!googleAuthProvider) {
    googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: "select_account" });
  }
  return googleAuthProvider;
}
