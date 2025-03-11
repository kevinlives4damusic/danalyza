// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth,
  Auth, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize variables
let app;
let analytics = null;
let auth: Auth;
let db;
let storage;
let authInitialized = false;
let authStateReady = false;

// Create a promise to track auth state
let authReadyPromise = new Promise((resolve) => {
  const unsubscribe = () => {
    authStateReady = true;
    resolve(true);
  };
  setTimeout(unsubscribe, 1000); // Fallback timeout
  return unsubscribe;
});

// Export the services and auth state
export { app, analytics, auth, db, storage, authInitialized, authStateReady, authReadyPromise };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const validateConfig = (config: typeof firebaseConfig) => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ] as const;

  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }

  // Log configuration for debugging
  console.log("Firebase configuration:", {
    projectId: config.projectId,
    authDomain: config.authDomain,
    hasApiKey: !!config.apiKey,
    hasAppId: !!config.appId
  });
};

// Initialize Firebase
console.log("Initializing Firebase...");

try {
  // Validate configuration
  validateConfig(firebaseConfig);
  
  // Initialize Firebase if not already initialized
  const existingApp = getApps().length > 0;
  app = existingApp ? getApps()[0] : initializeApp(firebaseConfig);

  console.log("Firebase initialized successfully:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isExistingApp: existingApp
  });

  // Initialize Auth first
  auth = getAuth(app);
  
  // Initialize Firestore with settings
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: true,
  });

  // Initialize Storage
  storage = getStorage(app);

  // Initialize Analytics if available
  try {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  } catch (error) {
    console.warn("Analytics initialization skipped:", error);
  }

  // Set up auth persistence and state monitoring
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase Auth persistence enabled");
      
      // Update the authReadyPromise with the actual auth state listener
      authReadyPromise = new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          authInitialized = true;
          console.log("Auth state changed:", {
            isSignedIn: !!user,
            isAnonymous: user?.isAnonymous,
            uid: user?.uid,
            email: user?.email
          });

          // If no user is signed in, sign in anonymously
          if (!user) {
            signInAnonymously(auth)
              .then(() => {
                console.log("Anonymous auth successful");
                authStateReady = true;
                resolve(true);
              })
              .catch((error) => {
                console.error("Anonymous auth failed:", error);
                authStateReady = true;
                resolve(false);
              });
          } else {
            // User is already signed in
            authStateReady = true;
            resolve(true);
          }
        });
        
        // Return unsubscribe function
        return unsubscribe;
      });
    })
    .catch((error) => {
      console.error("Auth persistence error:", error);
      console.warn("Continuing without auth persistence");
      authStateReady = true;
    });

  // Enable Firestore persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn("Firestore persistence unavailable: Multiple tabs open");
      } else if (err.code === 'unimplemented') {
        console.warn("Firestore persistence unavailable: Browser not supported");
      } else {
        console.error("Firestore persistence error:", err);
      }
    });

} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  throw error;
} 