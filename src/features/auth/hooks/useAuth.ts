import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole, UserData } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const { setUser: setStoreUser, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setStoreUser(firebaseUser, userDoc.data() as UserData)
        }
      } else {
        setStoreUser(null, null)
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
    await createUserDocument(result.user, role)
    return result
  }

  const loginWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
    storeLogout()
  }

  const createUserDocument = async (firebaseUser: User, role: UserRole) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userData: UserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      phoneNumber: firebaseUser.phoneNumber,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      isVerified: false,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    }
    await setDoc(userRef, userData as any)
  }

  return {
    user,
    loading,
    sendOTP,
    verifyOTP,
    registerWithEmail,
    loginWithEmail,
    logout,
  }
}
