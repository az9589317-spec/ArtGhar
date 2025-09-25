
"use client"

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react"
import {
  getAuth,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  Auth,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, Firestore } from "firebase/firestore"
import { useFirebase } from "@/firebase"
import { adminEmails } from "@/lib/admins"
import { FirestorePermissionError } from "@/firebase/errors"
import { errorEmitter } from "@/firebase/error-emitter"

type UserProfile = {
  email: string
  displayName: string
  photoURL: string
  role: "user" | "admin"
  createdAt: any
  lastLogin: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  userProfile: UserProfile | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Get auth and firestore from the central Firebase provider
  const { auth, firestore } = useFirebase();


  const handleUser = useCallback(
    async (firebaseUser: User | null) => {
      if (firebaseUser && firestore) {
        const userRef = doc(firestore, "users", firebaseUser.uid)
        const userDoc = await getDoc(userRef)
        const isAdmin = adminEmails.includes(firebaseUser.email || "")

        if (!userDoc.exists()) {
          const newUserProfile: UserProfile = {
            displayName: firebaseUser.displayName || "Anonymous",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            role: isAdmin ? "admin" : "user",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          }
          setDoc(userRef, newUserProfile, { merge: true }).catch((error) => {
            const contextualError = new FirestorePermissionError({
              operation: "create",
              path: userRef.path,
              requestResourceData: newUserProfile,
            })
            errorEmitter.emit("permission-error", contextualError)
            console.error("Error creating user profile:", contextualError)
          })
          setUserProfile(newUserProfile)
        } else {
            const currentProfile = userDoc.data() as UserProfile;
            const needsUpdate = currentProfile.role !== (isAdmin ? "admin" : "user");

            if (needsUpdate) {
                const updatedFields = {
                    lastLogin: serverTimestamp(),
                    role: isAdmin ? "admin" : "user",
                };
                 updateDoc(userRef, updatedFields).catch(error => {
                    const contextualError = new FirestorePermissionError({
                        operation: 'update',
                        path: userRef.path,
                        requestResourceData: updatedFields
                    });
                    errorEmitter.emit('permission-error', contextualError);
                    console.error("Error updating user role:", contextualError);
                });
                setUserProfile({ ...currentProfile, ...updatedFields });
            } else {
                 updateDoc(userRef, { lastLogin: serverTimestamp() });
                 setUserProfile(currentProfile);
            }
        }
        setUser(firebaseUser)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    },
    [firestore]
  )

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    };
    const unsubscribe = onAuthStateChanged(auth, handleUser)
    return () => unsubscribe()
  }, [auth, handleUser])

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error during Google sign-in:", error)
    }
  }

  const signOut = async () => {
     if (!auth) return;
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, userProfile, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// This hook can be used by any component within AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// This hook is for convenience to get user-specific data
export const useUser = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider")
  }
  return { user: context.user, loading: context.loading, userProfile: context.userProfile }
}
