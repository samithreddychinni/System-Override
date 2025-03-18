"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { initializeFirebase } from "@/lib/firebase"

interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Firebase
    const app = initializeFirebase()
    const auth = getAuth(app)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, `${email}@systemoverride.com`, password)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }, [])

  const signUp = useCallback(async (username: string, password: string) => {
    try {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, `${username}@systemoverride.com`, password)

      // Update profile with username
      await updateProfile(result.user, {
        displayName: username,
      })

      return result.user
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const auth = getAuth()
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }, [])

  return {
    user,
    loading,
    login,
    signUp,
    signOut,
  }
}

