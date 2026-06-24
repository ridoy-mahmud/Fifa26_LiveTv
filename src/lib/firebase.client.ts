import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCvtaQo4jSgAym8XpyC2-kYMqPfmt2LMU8",
  authDomain: "sunlit-context-450609-v6.firebaseapp.com",
  projectId: "sunlit-context-450609-v6",
  storageBucket: "sunlit-context-450609-v6.firebasestorage.app",
  messagingSenderId: "945079709177",
  appId: "1:945079709177:web:929228df767a788a26e128",
};

export const ADMIN_EMAIL = "mahamulhasan38@gmail.com";

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });
