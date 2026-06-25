declare module "virtual:firebase-auth" {
  export const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  export function initializeApp(): Promise<any>;
  export function getAuth(): Promise<any>;
  export function getProvider(): Promise<any>;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): Promise<() => void>;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function signOut(auth: any): Promise<void>;
}
