"use client"

import type React from "react"
import { VT323 } from "next/font/google"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useAudio } from "@/hooks/use-audio"

// Load font
const vt323 = VT323({ subsets: ["latin"], weight: "400" })

interface LoginScreenProps {
  onLogin: () => void
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")
  const { login, signUp } = useAuth()
  const { playSound } = useAudio()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Username and password required")
      playSound("error")
      return
    }

    setIsLoggingIn(true)
    setError("")
    playSound("type")

    try {
      await login(username, password)
      playSound("success")
      onLogin()
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid credentials. Access denied.")
      playSound("error")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleSignUp = async () => {
    if (!username || !password) {
      setError("Username and password required")
      playSound("error")
      return
    }

    setIsLoggingIn(true)
    setError("")
    playSound("type")

    try {
      await signUp(username, password)
      playSound("success")
      onLogin()
    } catch (error) {
      console.error("Signup error:", error)
      setError("Could not create account. Try another username.")
      playSound("error")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className={`${vt323.className} fixed inset-0 flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black border-2 border-neon-green p-8 w-full max-w-md shadow-neon"
      >
        <div className="text-center mb-8">
          <h1 className="text-neon-green text-3xl font-mono mb-2">SYSTEM OVERRIDE</h1>
          <p className="text-neon-green/70 text-sm font-mono">AGENT AUTHENTICATION REQUIRED</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-neon-green/70 text-sm font-mono mb-2">
              AGENT ID
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border-2 border-neon-green/50 p-2 text-neon-green font-mono focus:outline-none focus:border-neon-green"
              placeholder="Enter agent ID"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-neon-green/70 text-sm font-mono mb-2">
              ACCESS CODE
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-neon-green/50 p-2 text-neon-green font-mono focus:outline-none focus:border-neon-green"
              placeholder="Enter access code"
            />
          </div>

          {error && <div className="text-red-500 text-sm font-mono text-center">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex-1 bg-black border-2 border-neon-green py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "AUTHENTICATING..." : "LOGIN"}
            </button>
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={handleSignUp}
              className="flex-1 bg-black border-2 border-neon-green/50 py-2 text-neon-green/70 font-mono hover:bg-neon-green/10 transition-colors disabled:opacity-50"
            >
              REGISTER
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              playSound("type")
              onLogin()
            }}
            className="text-neon-green/50 text-xs font-mono hover:text-neon-green transition-colors"
          >
            BYPASS AUTHENTICATION (GUEST MODE)
          </button>
        </div>
      </motion.div>
    </div>
  )
}

