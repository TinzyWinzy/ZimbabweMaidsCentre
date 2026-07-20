import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole, UserData } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const { setUser: setStoreUser, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setStoreUser(firebaseUser, {
            uid: data.uid,
            email: data.email ?? null,
            phoneNumber: data.phoneNumber ?? null,
            displayName: data.displayName ?? null,
            photoURL: data.photoURL ?? null,
            role: data.role,
            isVerified: data.isVerified ?? false,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
          } as UserData)
        }
      } else {
        // Firebase has no session in local SQLite demo mode. Keep the persisted
        // demo identity intact when the app reloads.
        if (!useAuthStore.getState().isDemo) {
          setStoreUser(null, null)
        }
      }
      setLoading(false)
    })
    return unsubscribe
  }, [setStoreUser])

  const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
    const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    setConfirmationResult(result)
    return result
  }

  const verifyOTP = async (code: string) => {
    if (!confirmationResult) throw new Error('No confirmation result')
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code)
    const result = await signInWithCredential(auth, credential)

    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      await createUserDocument(result.user, 'worker')
    }
    return result
  }

  const registerWithEmail = async (email: string, password: string, role: UserRole, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    const userData = await createUserDocument(result.user, role, name)
    setStoreUser(result.user, userData)
    return result
  }

  const loginWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      const userData = await createUserDocument(result.user, role)
      setStoreUser(result.user, userData)
    }
    return result
  }

  const logout = async () => {
    await signOut(auth)
    storeLogout()
  }

  const createUserDocument = async (firebaseUser: User, role: UserRole, displayName?: string) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const now = new Date()
    const userData: UserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      phoneNumber: firebaseUser.phoneNumber,
      displayName: displayName || firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    }
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return userData
  }

  return {
    user,
    loading,
    sendOTP,
    verifyOTP,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }
}
