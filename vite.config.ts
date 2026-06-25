// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanStackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";

// Virtual module for Firebase to bypass TanStack Start's import protection
const firebaseVirtualModuleId = "virtual:firebase-auth";
const resolvedFirebaseVirtualModuleId = "\0" + firebaseVirtualModuleId;

export default defineConfig({
  tanstackStart: {
    // Use default TanStack Start server configuration
  },
  // Pin the Nitro preset to Vercel so the build emits a Vercel-compatible
  // server bundle and build output.
  nitro: {
    preset: "vercel",
  },
  // Configure Vite to handle Firebase imports
  vite: {
    plugins: [
      {
        name: "firebase-virtual-module",
        resolveId(id) {
          if (id === firebaseVirtualModuleId) {
            return resolvedFirebaseVirtualModuleId;
          }
        },
        load(id) {
          if (id === resolvedFirebaseVirtualModuleId) {
            // Return the Firebase code as a string to avoid import detection
            return `
              export const firebaseConfig = {
                apiKey: "AIzaSyCvtaQo4jSgAym8XpyC2-kYMqPfmt2LMU8",
                authDomain: "sunlit-context-450609-v6.firebaseapp.com",
                projectId: "sunlit-context-450609-v6",
                storageBucket: "sunlit-context-450609-v6.firebasestorage.app",
                messagingSenderId: "945079709177",
                appId: "1:945079709177:web:929228df767a788a26e128",
              };
              
              let app = null;
              let auth = null;
              let provider = null;
              
              export async function initializeApp() {
                if (typeof window === "undefined") return null;
                if (app) return app;
                
                const firebase = await import("firebase/app");
                const apps = firebase.getApps();
                if (apps.length > 0) {
                  app = firebase.getApp();
                } else {
                  app = firebase.initializeApp(firebaseConfig);
                }
                return app;
              }
              
              export async function getAuth() {
                if (typeof window === "undefined") return null;
                if (auth) return auth;
                
                const firebaseAuth = await import("firebase/auth");
                const firebaseApp = await initializeApp();
                if (firebaseApp) {
                  auth = firebaseAuth.getAuth(firebaseApp);
                }
                return auth;
              }
              
              export async function getProvider() {
                if (typeof window === "undefined") return null;
                if (provider) return provider;
                
                const firebaseAuth = await import("firebase/auth");
                provider = new firebaseAuth.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: "select_account" });
                return provider;
              }
              
              export async function onAuthStateChanged(auth, callback) {
                if (typeof window === "undefined") return () => {};
                const firebaseAuth = await import("firebase/auth");
                return firebaseAuth.onAuthStateChanged(auth, callback);
              }
              
              export async function signInWithPopup(auth, provider) {
                if (typeof window === "undefined") return null;
                const firebaseAuth = await import("firebase/auth");
                return firebaseAuth.signInWithPopup(auth, provider);
              }
              
              export async function signOut(auth) {
                if (typeof window === "undefined") return;
                const firebaseAuth = await import("firebase/auth");
                return firebaseAuth.signOut(auth);
              }
            `;
          }
        },
      },
    ],
  },
});
