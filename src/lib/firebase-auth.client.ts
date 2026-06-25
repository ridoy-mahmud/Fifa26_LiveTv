const ADMIN_EMAIL = "mahamulhasan38@gmail.com";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCvtaQo4jSgAym8XpyC2-kYMqPfmt2LMU8",
  authDomain: "sunlit-context-450609-v6.firebaseapp.com",
  projectId: "sunlit-context-450609-v6",
  storageBucket: "sunlit-context-450609-v6.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let firebaseApp: any = null;
let firebaseAuth: any = null;

function isAllowedEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Initialize Firebase - client only
export async function initializeFirebase() {
  if (firebaseApp) return firebaseApp;

  try {
    const { initializeApp } = await import("firebase/app");
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    return firebaseApp;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

// Get Auth instance - client only
export async function getFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;

  try {
    const { getAuth } = await import("firebase/auth");
    const app = await initializeFirebase();
    firebaseAuth = getAuth(app);
    return firebaseAuth;
  } catch (error) {
    console.error("Firebase auth initialization error:", error);
    throw error;
  }
}

// Get Google Provider - client only
export async function getGoogleProvider() {
  try {
    const { GoogleAuthProvider } = await import("firebase/auth");
    return new GoogleAuthProvider();
  } catch (error) {
    console.error("Google provider error:", error);
    throw error;
  }
}

// Sign in with Google - client only
export async function signInWithGoogle() {
  try {
    const { signInWithPopup } = await import("firebase/auth");
    const auth = await getFirebaseAuth();
    const provider = await getGoogleProvider();
    const result = await signInWithPopup(auth, provider);

    if (!isAllowedEmail(result.user.email || "")) {
      await signOut();
      throw new Error(`Use ${ADMIN_EMAIL} to access the admin panel.`);
    }

    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

// Sign out - client only
export async function signOut() {
  try {
    const { signOut: firebaseSignOut } = await import("firebase/auth");
    const auth = await getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Listen to auth state changes - client only
export async function onAuthStateChanged(callback: (user: any) => void) {
  try {
    const { onAuthStateChanged: firebaseOnAuthStateChanged } = await import("firebase/auth");
    const auth = await getFirebaseAuth();
    const unsubscribe = firebaseOnAuthStateChanged(auth, (user: any) => {
      if (user?.email && !isAllowedEmail(user.email)) {
        signOut().catch(console.error);
        callback(null);
      } else {
        callback(user);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Auth state listener error:", error);
    throw error;
  }
}
