
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Define the config object here, inside useEffect, to ensure it's only created on the client.
    const firebaseConfig = {
      apiKey: "AIzaSyC7Q1ZC3kempnJJ6iIbO_jEaXv56Q8yXP8",
      authDomain: "studio-9425607416-9f85f.firebaseapp.com",
      projectId: "studio-9425607416-9f85f",
      storageBucket: "studio-9425607416-9f85f.appspot.com",
      messagingSenderId: "929395636152",
      appId: "1:929395636152:web:897e7971570470395f814d",
      measurementId: "G-7E2L62K54L",
    };

    // This effect runs only on the client, after the component has mounted.
    // This is the correct and safe place to initialize Firebase.
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    setFirebaseServices({ firebaseApp: app, auth, firestore });
  }, []); // Empty dependency array ensures this runs only once

  if (!firebaseServices) {
    // Render a loading state or null while Firebase is initializing.
    // This prevents children from trying to access Firebase before it's ready.
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
