"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { WindowBase } from "../window-base"
import { useMission } from "@/context/mission-context"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { useAudio } from "@/hooks/use-audio"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { getRandomHackingPhrase } from "@/lib/hacking-phrases"
import { getRandomEnglishPhrase } from "@/lib/english-phrases"

export const typingEventEmitter = {
  listeners: new Set<(event: { type: string; data: any }) => void>(),

  emit(event: { type: string; data: any }) {
    this.listeners.forEach((listener) => listener(event))
  },

  subscribe(listener: (event: { type: string; data: any }) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },
}

interface TypingWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const TypingWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: TypingWindowProps) => {
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState(true)
  const [completedPhrases, setCompletedPhrases] = useState(0)
  const [showSecurityPatching, setShowSecurityPatching] = useState(false)
  const [patchingProgress, setPatchingProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateProgress, updateTypingSpeed, missionProgress, language, difficulty } = useMission()
  const { setDynamicDifficulty } = useGameMechanics()
  const { playSound } = useAudio()
  const [startTime, setStartTime] = useState<number | null>(null)
  const [charactersTyped, setCharactersTyped] = useState(0)
  const [lastTypeTime, setLastTypeTime] = useState<number>(Date.now())
  const [typingActive, setTypingActive] = useState(false)
  const [patchingIntervalId, setPatchingIntervalId] = useState<NodeJS.Timeout | null>(null)

  const getNewPhrase = useCallback(() => {
    let phrase = language === "english" ? getRandomEnglishPhrase() : getRandomHackingPhrase()

    if (difficulty === "hard") {
      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>/?"
      for (let i = 0; i < 3; i++) {
        const pos = Math.floor(Math.random() * phrase.length)
        const char = specialChars.charAt(Math.floor(Math.random() * specialChars.length))
        phrase = phrase.slice(0, pos) + char + phrase.slice(pos)
      }

      if (language === "code") {
        const technicalTerms = ["--no-cache", "--force", "-recursive", "-v", "--debug", "-p 443"]
        phrase += " " + technicalTerms[Math.floor(Math.random() * technicalTerms.length)]
      }
    } else if (difficulty === "basic") {
      if (phrase.length > 20) {
        phrase = phrase.substring(0, Math.max(15, phrase.length / 2))
      }
    }

    setCurrentPhrase(phrase)
    setUserInput("")
    if (!startTime) {
      setStartTime(Date.now())
    }
    setLastTypeTime(Date.now())
  }, [difficulty, language, startTime])

  useEffect(() => {
    getNewPhrase()
  }, [getNewPhrase])

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  const startSecurityPatching = useCallback(() => {
    setShowSecurityPatching(true)
    playSound("alert")

    let progress = 0
    const intervalId = setInterval(() => {
      progress += 5
      setPatchingProgress(progress)

      if (progress >= 100) {
        clearInterval(intervalId)
        setPatchingIntervalId(null)
        getNewPhrase()
        setUserInput("")
        setShowSecurityPatching(false)
        setPatchingProgress(0)
        playSound("error")

        typingEventEmitter.emit({
          type: "typing_stopped",
          data: { timestamp: new Date().toISOString() },
        })
      }
    }, 500)

    setPatchingIntervalId(intervalId)
  }, [getNewPhrase, playSound])

  useEffect(() => {
    if (userInput.length === 0) return

    const inactivityTimer = setInterval(() => {
      const now = Date.now()
      const timeSinceLastType = now - lastTypeTime

      if (timeSinceLastType > 5000 && !showSecurityPatching) {
        startSecurityPatching()
      }
    }, 1000)

    return () => clearInterval(inactivityTimer)
  }, [userInput, lastTypeTime, showSecurityPatching, startSecurityPatching])

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)
    setCharactersTyped((prev) => prev + 1)
    setLastTypeTime(Date.now())
    setTypingActive(true)

    // If security patching is in progress, cancel it
    if (showSecurityPatching && patchingIntervalId) {
      clearInterval(patchingIntervalId)
      setPatchingIntervalId(null)
      setShowSecurityPatching(false)
      setPatchingProgress(0)
    }

    // Check if input is correct so far
    const isInputCorrect = currentPhrase.startsWith(value)
    setIsCorrect(isInputCorrect)

    if (!isInputCorrect) {
      playSound("error")

      // Emit typing error event
      typingEventEmitter.emit({
        type: "typing_error",
        data: {
          timestamp: new Date().toISOString(),
          input: value,
          expected: currentPhrase.substring(0, value.length),
        },
      })
    } else {
      // Play typing sound occasionally
      if (Math.random() > 0.7) {
        playSound("type")
      }

      // Emit typing progress event
      typingEventEmitter.emit({
        type: "typing_progress",
        data: {
          timestamp: new Date().toISOString(),
          progress: value.length / currentPhrase.length,
        },
      })
    }

    // If phrase is completed
    if (value === currentPhrase) {
      playSound("success")
      setCompletedPhrases((prev) => prev + 1)
      updateProgress(Math.min(missionProgress + 5, 100))

      // Emit typing success event
      typingEventEmitter.emit({
        type: "typing_success",
        data: {
          timestamp: new Date().toISOString(),
          phrase: currentPhrase,
        },
      })

      getNewPhrase()
    }

    // Calculate typing speed
    if (startTime) {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      if (elapsedSeconds > 0) {
        const wpm = Math.round(charactersTyped / 5 / (elapsedSeconds / 60))
        updateTypingSpeed(wpm)
        setDynamicDifficulty(wpm)
      }
    }
  }

  // Detect when typing stops
  useEffect(() => {
    if (!typingActive) return

    const typingTimeout = setTimeout(() => {
      setTypingActive(false)

      // Emit typing stopped event
      typingEventEmitter.emit({
        type: "typing_stopped",
        data: { timestamp: new Date().toISOString() },
      })
    }, 2000)

    return () => clearTimeout(typingTimeout)
  }, [lastTypeTime, typingActive])

  return (
    <WindowBase
      id={id}
      title="TERMINAL ACCESS :: BREACH PROTOCOL"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-neon-green/70 text-xs font-mono">
          <span className="text-neon-green">ROOT@SYSTEM:~$</span> Type the following command to continue breach:
        </div>

        <div className="flex-1 flex items-center justify-center">
          {showSecurityPatching ? (
            <div className="w-full text-center">
              <div className="text-red-500 text-xl font-mono mb-4 animate-pulse">SECURITY PATCHING IN PROGRESS</div>
              <div className="w-full bg-black border border-red-500/30 h-6 mb-4">
                <motion.div
                  className="h-full bg-red-500/30"
                  initial={{ width: 0 }}
                  animate={{ width: `${patchingProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="text-red-400 text-sm font-mono">TYPE FASTER TO CANCEL SECURITY PATCH</div>
            </div>
          ) : (
            <motion.div
              className="text-xl font-mono text-neon-green font-bold tracking-wider text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentPhrase}
            >
              {currentPhrase.split("").map((char, index) => {
                const isTyped = index < userInput.length
                const isCurrentChar = index === userInput.length
                const isCorrectChar = isTyped && userInput[index] === currentPhrase[index]

                return (
                  <motion.span
                    key={index}
                    className={cn(
                      isTyped ? (isCorrectChar ? "text-green-400" : "text-red-500") : "text-neon-green/70",
                      isCurrentChar && "bg-neon-green/30 animate-pulse",
                    )}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {char}
                  </motion.span>
                )
              })}
            </motion.div>
          )}
        </div>

        <div className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className={cn(
              "w-full bg-black border-2 px-3 py-2 font-mono text-lg focus:outline-none",
              isCorrect ? "border-neon-green/50 text-neon-green" : "border-red-500/70 text-red-400",
            )}
            placeholder="Type here to hack..."
            autoFocus
          />
        </div>

        <div className="mt-4 flex justify-between text-xs font-mono">
          <div className="text-neon-green/70">
            COMMANDS EXECUTED: <span className="text-neon-green">{completedPhrases}</span>
          </div>
          <div className="text-neon-green/70">
            MODE: <span className="text-neon-green">{language.toUpperCase()}</span>
          </div>
          <div className="text-neon-green/70">
            DIFFICULTY:{" "}
            <span
              className={cn(
                difficulty === "basic"
                  ? "text-green-400"
                  : difficulty === "medium"
                    ? "text-yellow-400"
                    : "text-red-400",
              )}
            >
              {difficulty.toUpperCase()}
            </span>
          </div>
          <div className="text-neon-green/70">
            BREACH PROGRESS: <span className="text-neon-green">{missionProgress}%</span>
          </div>
        </div>
      </div>
    </WindowBase>
  )
}

