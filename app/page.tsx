"use client"

import { useEffect, useState } from "react"
import { VT323 } from "next/font/google"
import { MatrixRain } from "@/components/matrix-rain"
import { WindowManager } from "@/components/window-manager"
import { useAudio } from "@/hooks/use-audio"
import { MissionProvider } from "@/context/mission-context"
import { GameMechanicsProvider } from "@/context/game-mechanics-context"
import { LoginScreen } from "@/components/login-screen"
import { GameOptionsScreen } from "@/components/game-options-screen"
import { useAuth } from "@/hooks/use-auth"

const vt323 = VT323({ subsets: ["latin"], weight: "400" })

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [gameOptions, setGameOptions] = useState<{
    language: "english" | "code"
    difficulty: "basic" | "medium" | "hard"
  } | null>(null)
  const { user } = useAuth()
  const { playSound } = useAudio()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      playSound("boot")
    }, 2500)

    return () => clearTimeout(timer)
  }, [playSound])

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
    }
  }, [user])

  const handleSelectOptions = (language: "english" | "code", difficulty: "basic" | "medium" | "hard") => {
    setGameOptions({ language, difficulty })
  }

  const handleReturnHome = () => {
    setGameOptions(null)
  }

  if (isLoading) {
    return (
      <div className={`${vt323.className} fixed inset-0 bg-black flex items-center justify-center`}>
        <div className="text-neon-green text-2xl font-mono animate-pulse">INITIALIZING SYSTEM OVERRIDE...</div>
      </div>
    )
  }

  return (
    <main className={`${vt323.className} fixed inset-0 bg-black overflow-auto min-h-screen`}>
      <MatrixRain />
      <div className="relative z-10 w-full min-h-screen pb-20">
        {!isLoggedIn ? (
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        ) : !gameOptions ? (
          <GameOptionsScreen onSelectOptions={handleSelectOptions} />
        ) : (
          <MissionProvider>
            <GameMechanicsProvider>
              <WindowManager
                language={gameOptions.language}
                difficulty={gameOptions.difficulty}
                onReturnHome={handleReturnHome}
              />
            </GameMechanicsProvider>
          </MissionProvider>
        )}
      </div>
    </main>
  )
}

