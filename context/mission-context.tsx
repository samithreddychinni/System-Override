"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"

interface MissionContextType {
  missionProgress: number
  typingSpeed: number
  missionComplete: boolean
  timeLimit: number
  language: "english" | "code"
  difficulty: "basic" | "medium" | "hard"
  updateProgress: (progress: number) => void
  updateTypingSpeed: (speed: number) => void
  resetMission: () => void
  setLanguageAndDifficulty: (language: "english" | "code", difficulty: "basic" | "medium" | "hard") => void
}

const MissionContext = createContext<MissionContextType | undefined>(undefined)

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missionProgress, setMissionProgress] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(0)
  const [missionComplete, setMissionComplete] = useState(false)
  const [language, setLanguage] = useState<"english" | "code">("code")
  const [difficulty, setDifficulty] = useState<"basic" | "medium" | "hard">("medium")
  const [timeLimit, setTimeLimit] = useState(180) // Default 3 minutes

  const updateProgress = useCallback((progress: number) => {
    setMissionProgress(progress)
    if (progress >= 100) {
      setMissionComplete(true)
    }
  }, [])

  const updateTypingSpeed = useCallback((speed: number) => {
    setTypingSpeed(speed)
  }, [])

  const resetMission = useCallback(() => {
    setMissionProgress(0)
    setTypingSpeed(0)
    setMissionComplete(false)
  }, [])

  const setLanguageAndDifficulty = useCallback((lang: "english" | "code", diff: "basic" | "medium" | "hard") => {
    setLanguage(lang)
    setDifficulty(diff)

    switch (diff) {
      case "basic":
        setTimeLimit(120) // 2 minutes
        break
      case "medium":
        setTimeLimit(180) // 3 minutes
        break
      case "hard":
        setTimeLimit(240) // 4 minutes
        break
    }
  }, [])

  useEffect(() => {
    setLanguageAndDifficulty(language, difficulty)
  }, [language, difficulty, setLanguageAndDifficulty])

  return (
    <MissionContext.Provider
      value={{
        missionProgress,
        typingSpeed,
        missionComplete,
        timeLimit,
        language,
        difficulty,
        updateProgress,
        updateTypingSpeed,
        resetMission,
        setLanguageAndDifficulty,
      }}
    >
      {children}
    </MissionContext.Provider>
  )
}

export const useMission = () => {
  const context = useContext(MissionContext)
  if (context === undefined) {
    throw new Error("useMission must be used within a MissionProvider")
  }
  return context
}

