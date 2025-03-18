"use client"

import { useEffect, useState } from "react"
import { WindowBase } from "../window-base"
import { useMission } from "@/context/mission-context"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAudio } from "@/hooks/use-audio"

interface ProgressWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const ProgressWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: ProgressWindowProps) => {
  const { missionProgress, typingSpeed, timeLimit, difficulty } = useMission()
  const { securityBreaches, addSecurityBreach } = useGameMechanics()
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [isGlitching, setIsGlitching] = useState(false)
  const [showTraceAlert, setShowTraceAlert] = useState(false)
  const [breachCountdown, setBreachCountdown] = useState<number | null>(null)
  const { playSound } = useAudio()

  // Update time remaining when timeLimit changes
  useEffect(() => {
    setTimeRemaining(timeLimit)
  }, [timeLimit])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle trace detection when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !showTraceAlert) {
      setShowTraceAlert(true)
      playSound("alert")

      // Start breach countdown
      setBreachCountdown(30)
    }
  }, [timeRemaining, showTraceAlert, playSound])

  // Handle breach countdown
  useEffect(() => {
    if (breachCountdown === null) return

    const timer = setInterval(() => {
      setBreachCountdown((prev) => {
        if (prev === null) return null
        if (prev <= 0) {
          // Trigger security breach
          addSecurityBreach()
          return 30 // Reset to 30 seconds for next breach
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [breachCountdown, addSecurityBreach])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <WindowBase
      id={id}
      title="MISSION STATUS :: BREACH PROGRESS"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full mb-4">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neon-green/70">BREACH PROGRESS:</span>
              <span
                className={cn(
                  "font-bold",
                  missionProgress < 30 ? "text-red-400" : missionProgress < 70 ? "text-yellow-400" : "text-green-400",
                )}
              >
                {missionProgress}%
              </span>
            </div>
            <div className="w-full h-4 bg-black border border-neon-green/30 overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  missionProgress < 30
                    ? "bg-red-500/50"
                    : missionProgress < 70
                      ? "bg-yellow-500/50"
                      : "bg-green-500/50",
                  isGlitching && "animate-glitch",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${missionProgress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="w-full mb-4">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neon-green/70">TIME REMAINING:</span>
              <span
                className={cn(
                  "font-bold",
                  timeRemaining < timeLimit / 3
                    ? "text-red-400"
                    : timeRemaining < (timeLimit / 3) * 2
                      ? "text-yellow-400"
                      : "text-green-400",
                  timeRemaining === 0 && "animate-pulse",
                )}
              >
                {timeRemaining > 0 ? formatTime(timeRemaining) : "00:00"}
              </span>
            </div>
            <div className="w-full h-4 bg-black border border-neon-green/30 overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  timeRemaining < timeLimit / 3
                    ? "bg-red-500/50"
                    : timeRemaining < (timeLimit / 3) * 2
                      ? "bg-yellow-500/50"
                      : "bg-green-500/50",
                )}
                initial={{ width: "100%" }}
                animate={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          {showTraceAlert && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-red-500 font-bold animate-pulse">TRACE DETECTED!</span>
                <span className="text-red-500 font-bold">BREACH IN: {breachCountdown}s</span>
              </div>
              <div className="w-full h-4 bg-black border border-red-500/30 overflow-hidden">
                <motion.div
                  className="h-full bg-red-500/50"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(breachCountdown! / 30) * 100}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neon-green/70">TYPING EFFICIENCY:</span>
              <span
                className={cn(
                  "font-bold",
                  typingSpeed < 30 ? "text-red-400" : typingSpeed < 60 ? "text-yellow-400" : "text-green-400",
                )}
              >
                {typingSpeed} WPM
              </span>
            </div>
            <div className="w-full h-4 bg-black border border-neon-green/30 overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  typingSpeed < 30 ? "bg-red-500/50" : typingSpeed < 60 ? "bg-yellow-500/50" : "bg-green-500/50",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((typingSpeed / 100) * 100, 100)}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-neon-green/70 text-xs font-mono">
          <div className="flex justify-between">
            <span>MISSION STATUS:</span>
            <span
              className={cn(
                missionProgress < 30 ? "text-red-400" : missionProgress < 70 ? "text-yellow-400" : "text-green-400",
              )}
            >
              {missionProgress < 30
                ? "INITIALIZING"
                : missionProgress < 70
                  ? "IN PROGRESS"
                  : missionProgress < 100
                    ? "ALMOST COMPLETE"
                    : "COMPLETE"}
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span>SECURITY BREACHES:</span>
            <span
              className={cn(
                securityBreaches === 0 ? "text-green-400" : securityBreaches === 1 ? "text-yellow-400" : "text-red-400",
              )}
            >
              {securityBreaches}/3
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span>DIFFICULTY:</span>
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
        </div>
      </div>
    </WindowBase>
  )
}

