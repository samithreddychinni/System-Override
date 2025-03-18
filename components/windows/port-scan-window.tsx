"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { WindowBase } from "../window-base"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { motion } from "framer-motion"

interface PortScanWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const PortScanWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: PortScanWindowProps) => {
  const { activeChallengeData, completeChallenge } = useGameMechanics()
  const [userInput, setUserInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(activeChallengeData?.timeLimit || 8)
  const [showTarget, setShowTarget] = useState(true)
  const [phase, setPhase] = useState<"memorize" | "recall">("memorize")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when component mounts or phase changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase])

  // Handle countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)

          if (phase === "memorize") {
            setPhase("recall")
            setTimeLeft(activeChallengeData?.timeLimit || 8)
            setShowTarget(false)
          } else {
            completeChallenge(false)
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, activeChallengeData, completeChallenge])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if input matches target
    const targetString = `${activeChallengeData?.ip}:${activeChallengeData?.port}`
    if (userInput.trim() === targetString) {
      completeChallenge(true)
    } else {
      completeChallenge(false)
    }
  }

  return (
    <WindowBase
      id={id}
      title="PORT SCANNING :: MEMORY CHALLENGE"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col items-center justify-center">
        {phase === "memorize" ? (
          <>
            <div className="text-yellow-400 text-xl font-mono mb-6">MEMORIZE TARGET IP AND PORT</div>

            <div className="mb-6 text-center">
              <div className="text-neon-green/70 text-sm font-mono mb-2">TARGET:</div>

              <div className="text-2xl font-mono text-neon-green font-bold tracking-wider">
                {activeChallengeData?.ip}:{activeChallengeData?.port}
              </div>
            </div>

            <div className="text-yellow-400 text-sm font-mono">MEMORIZING PHASE: {timeLeft}s</div>

            <motion.div
              className="w-full max-w-xs h-2 bg-black border border-yellow-500/30 mt-2"
              initial={{ width: "100%" }}
            >
              <motion.div
                className="h-full bg-yellow-500"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / activeChallengeData?.timeLimit) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </motion.div>
          </>
        ) : (
          <>
            <div className="text-red-500 text-xl font-mono mb-6 animate-pulse">RECALL TARGET IP AND PORT</div>

            <form onSubmit={handleSubmit} className="w-full max-w-xs mb-6">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full bg-black border-2 border-neon-green/50 px-3 py-2 font-mono text-lg text-neon-green focus:outline-none text-center"
                placeholder="IP:PORT"
                autoFocus
              />

              <button
                type="submit"
                className="w-full mt-2 bg-black border border-neon-green text-neon-green px-4 py-2 font-mono text-sm hover:bg-neon-green/20 transition-colors"
              >
                SUBMIT
              </button>
            </form>

            <div className="text-red-400 text-sm font-mono">TIME REMAINING: {timeLeft}s</div>

            <motion.div
              className="w-full max-w-xs h-2 bg-black border border-red-500/30 mt-2"
              initial={{ width: "100%" }}
            >
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / activeChallengeData?.timeLimit) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </motion.div>
          </>
        )}
      </div>
    </WindowBase>
  )
}

