const ADMIN_EMAIL = "mahamulhasan38@gmail.com";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCvtaQo4jSgAym8XpyC2-kYMqPfmt2LMU8",
  authDomain: "sunlit-context-450609-v6.firebaseapp.com",
  projectId: "sunlit-context-450609-v6",
  storageBucket: "sunlit-context-450609-v6.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

function isAllowedEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Initialize Firebase - client only
export async function initializeFirebase() {
  const { initializeApp } = await import("firebase/app");
  return initializeApp(FIREBASE_CONFIG);
}

// Get Auth instance - client only
export async function getFirebaseAuth() {
  const { getAuth } = await import("firebase/auth");
  const app = await initializeFirebase();
  return getAuth(app);
}

// Get Google Provider - client only
export async function getGoogleProvider() {
  const { GoogleAuthProvider } = await import("firebase/auth");
  return new GoogleAuthProvider();
}

// Sign in with Google - client only
export async function signInWithGoogle() {
  const { signInWithPopup } = await import("firebase/auth");
  const auth = await getFirebaseAuth();
  const provider = await getGoogleProvider();
  const result = await signInWithPopup(auth, provider);

  if (!isAllowedEmail(result.user.email || "")) {
    await signOut();
    throw new Error(`Use ${ADMIN_EMAIL} to access the admin panel.`);
  }

  return result.user;
}

// Sign out - client only
export async function signOut() {
  const { signOut: firebaseSignOut } = await import("firebase/auth");
  const auth = await getFirebaseAuth();
  await firebaseSignOut(auth);
}

// Listen to auth state changes - client only
export async function onAuthStateChanged(callback: (user: any) => void) {
  const { onAuthStateChanged: firebaseOnAuthStateChanged } = await import("firebase/auth");
  const auth = await getFirebaseAuth();
  return firebaseOnAuthStateChanged(auth, (user: any) => {
    if (user?.email && !isAllowedEmail(user.email)) {
      signOut();
      callback(null);
    } else {
      callback(user);
    }
  });
}
