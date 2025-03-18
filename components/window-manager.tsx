"use client"

import { useState, useEffect, useCallback } from "react"
import { TypingWindow } from "./windows/typing-window"
import { GraphWindow } from "./windows/graph-window"
import { LogsWindow } from "./windows/logs-window"
import { SystemLogsWindow } from "./windows/system-logs-window"
import { PayloadWindow } from "./windows/payload-window"
import { ProgressWindow } from "./windows/progress-window"
import { LeaderboardWindow } from "./windows/leaderboard-window"
import { BruteForceWindow } from "./windows/brute-force-window"
import { PortScanWindow } from "./windows/port-scan-window"
import { FirewallChallengeWindow } from "./windows/firewall-challenge-window"
import { IntrusionWindow } from "./windows/intrusion-window"
import { VirusDeploymentWindow } from "./windows/virus-deployment-window"
import { WebcamAccessWindow } from "./windows/webcam-access-window"
import { SystemAlertPopup } from "./system-alert-popup"
import { GameOverScreen } from "./game-over-screen"
import { useMission } from "@/context/mission-context"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { useAudio } from "@/hooks/use-audio"
import { MissionCompleteScreen } from "./mission-complete-screen"
import { PauseOverlay } from "./pause-overlay"
import { Home, Pause, Play } from "lucide-react"

interface WindowManagerProps {
  language: "english" | "code"
  difficulty: "basic" | "medium" | "hard"
  onReturnHome: () => void
}

export const WindowManager = ({ language, difficulty, onReturnHome }: WindowManagerProps) => {
  const [activeWindows, setActiveWindows] = useState<string[]>(["typing", "progress", "logs"])
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string>("typing")
  const { missionProgress, missionComplete, setLanguageAndDifficulty } = useMission()
  const { activeChallengeType, isGameOver, glitchIntensity, isPaused, togglePause, setPaused } = useGameMechanics()
  const { playSound } = useAudio()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    setLanguageAndDifficulty(language, difficulty)
  }, [language, difficulty, setLanguageAndDifficulty])

  // Handle ESC key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        togglePause()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePause])

  const bringToFront = useCallback((id: string) => {
    setActiveWindowId(id)
  }, [])

  const closeWindow = useCallback(
    (id: string) => {
      if (id === "progress") {
        minimizeWindow(id)
      } else {
        setActiveWindows((prev) => prev.filter((windowId) => windowId !== id))
        playSound("close")
      }
    },
    [playSound],
  )

  const minimizeWindow = useCallback(
    (id: string) => {
      setActiveWindows((prev) => prev.filter((windowId) => windowId !== id))
      setMinimizedWindows((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id]
        }
        return prev
      })
      playSound("minimize")
    },
    [playSound],
  )

  const openWindow = useCallback(
    (id: string) => {
      setMinimizedWindows((prev) => prev.filter((windowId) => windowId !== id))
      setActiveWindows((prev) => {
        if (!prev.includes(id)) {
          playSound("open")
          return [...prev, id]
        }
        return prev
      })
      bringToFront(id)
    },
    [bringToFront, playSound],
  )

  const handleHomeClick = useCallback(() => {
    // Pause the game first
    setPaused(true)

    // Confirm before returning home
    if (window.confirm("Return to mission parameters? Your current progress will be lost.")) {
      playSound("close")
      onReturnHome()
    } else {
      // If cancelled, unpause
      setPaused(false)
    }
  }, [onReturnHome, setPaused, playSound])

  useEffect(() => {
    if (missionProgress >= 30 && !activeWindows.includes("system") && !minimizedWindows.includes("system")) {
      openWindow("system")
      playSound("alert")
    }
    if (missionProgress >= 50 && !activeWindows.includes("graph") && !minimizedWindows.includes("graph")) {
      openWindow("graph")
      playSound("alert")
    }
    if (missionProgress >= 70 && !activeWindows.includes("payload") && !minimizedWindows.includes("payload")) {
      openWindow("payload")
      playSound("alert")
    }
    if (missionProgress >= 90 && !activeWindows.includes("leaderboard") && !minimizedWindows.includes("leaderboard")) {
      openWindow("leaderboard")
      playSound("alert")
    }
  }, [missionProgress, activeWindows, minimizedWindows, openWindow, playSound])

  useEffect(() => {
    const showRandomAlert = () => {
      if (Math.random() < 0.3 && !showAlert && !isPaused) {
        const alerts = [
          "SYSTEM ERROR: Memory corruption detected",
          "WARNING: Unusual network activity detected",
          "ALERT: Security scan in progress",
          "NOTICE: System resources at 87% utilization",
          "CAUTION: Unauthorized access attempt blocked",
          "WARNING: Encryption keys compromised",
          "ALERT: Firewall rule violation detected",
          "SYSTEM: Backup process interrupted",
          "NOTICE: Database integrity check failed",
          "WARNING: Suspicious process detected",
        ]

        setAlertMessage(alerts[Math.floor(Math.random() * alerts.length)])
        setShowAlert(true)
        playSound("alert")

        setTimeout(
          () => {
            setShowAlert(false)
          },
          2000 + Math.random() * 3000,
        )
      }
    }

    const interval = setInterval(() => {
      if (missionProgress > 30 && !isGameOver && !missionComplete && !isPaused) {
        showRandomAlert()
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [missionProgress, showAlert, isGameOver, missionComplete, isPaused, playSound])

  if (missionComplete) {
    return <MissionCompleteScreen />
  }

  if (isGameOver) {
    return <GameOverScreen />
  }

  return (
    <div className={`w-full min-h-screen p-4 ${glitchIntensity > 3 ? "animate-glitch" : ""}`}>
      {activeWindows.includes("typing") && (
        <TypingWindow
          id="typing"
          isActive={activeWindowId === "typing"}
          onActivate={() => bringToFront("typing")}
          onClose={() => closeWindow("typing")}
          onMinimize={() => minimizeWindow("typing")}
          initialPosition={{ x: 20, y: 20 }}
          initialSize={{ width: 600, height: 300 }}
        />
      )}

      {activeWindows.includes("graph") && (
        <GraphWindow
          id="graph"
          isActive={activeWindowId === "graph"}
          onActivate={() => bringToFront("graph")}
          onClose={() => closeWindow("graph")}
          onMinimize={() => minimizeWindow("graph")}
          initialPosition={{ x: 640, y: 20 }}
          initialSize={{ width: 500, height: 300 }}
        />
      )}

      {activeWindows.includes("logs") && (
        <LogsWindow
          id="logs"
          isActive={activeWindowId === "logs"}
          onActivate={() => bringToFront("logs")}
          onClose={() => closeWindow("logs")}
          onMinimize={() => minimizeWindow("logs")}
          initialPosition={{ x: 20, y: 340 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeWindows.includes("system") && (
        <SystemLogsWindow
          id="system"
          isActive={activeWindowId === "system"}
          onActivate={() => bringToFront("system")}
          onClose={() => closeWindow("system")}
          onMinimize={() => minimizeWindow("system")}
          initialPosition={{ x: 440, y: 340 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeWindows.includes("payload") && (
        <PayloadWindow
          id="payload"
          isActive={activeWindowId === "payload"}
          onActivate={() => bringToFront("payload")}
          onClose={() => closeWindow("payload")}
          onMinimize={() => minimizeWindow("payload")}
          initialPosition={{ x: 860, y: 340 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeWindows.includes("progress") && (
        <ProgressWindow
          id="progress"
          isActive={activeWindowId === "progress"}
          onActivate={() => bringToFront("progress")}
          onClose={() => closeWindow("progress")}
          onMinimize={() => minimizeWindow("progress")}
          initialPosition={{ x: 860, y: 20 }}
          initialSize={{ width: 300, height: 200 }}
        />
      )}

      {activeWindows.includes("leaderboard") && (
        <LeaderboardWindow
          id="leaderboard"
          isActive={activeWindowId === "leaderboard"}
          onActivate={() => bringToFront("leaderboard")}
          onClose={() => closeWindow("leaderboard")}
          onMinimize={() => minimizeWindow("leaderboard")}
          initialPosition={{ x: 440, y: 660 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "bruteforce" && (
        <BruteForceWindow
          id="bruteforce"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "portscan" && (
        <PortScanWindow
          id="portscan"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "firewall" && (
        <FirewallChallengeWindow
          id="firewall"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "intrusion" && (
        <IntrusionWindow
          id="intrusion"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "virus" && (
        <VirusDeploymentWindow
          id="virus"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {activeChallengeType === "webcam" && (
        <WebcamAccessWindow
          id="webcam"
          isActive={true}
          onActivate={() => {}}
          onClose={() => {}}
          onMinimize={() => {}}
          initialPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }}
          initialSize={{ width: 400, height: 300 }}
        />
      )}

      {showAlert && <SystemAlertPopup message={alertMessage} />}

      {/* Control Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-black/80 border-b border-neon-green/30 flex items-center px-4 z-40">
        <div className="text-neon-green font-mono text-sm">SYSTEM OVERRIDE v1.0</div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={handleHomeClick}
            className="flex items-center px-3 py-1 bg-black/50 border border-neon-green/50 text-neon-green text-xs hover:bg-neon-green/20 transition-colors"
            title="Return to Mission Parameters"
          >
            <Home size={14} className="mr-1" />
            HOME
          </button>

          <button
            onClick={togglePause}
            className="flex items-center px-3 py-1 bg-black/50 border border-neon-green/50 text-neon-green text-xs hover:bg-neon-green/20 transition-colors"
            title={isPaused ? "Resume Mission" : "Pause Mission"}
          >
            {isPaused ? (
              <>
                <Play size={14} className="mr-1" />
                RESUME
              </>
            ) : (
              <>
                <Pause size={14} className="mr-1" />
                PAUSE
              </>
            )}
          </button>
        </div>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/80 border-t border-neon-green/30 flex items-center px-4 z-40">
        <div className="text-neon-green font-mono text-sm">MISSION PROGRESS: {missionProgress}%</div>
        <div className="ml-auto flex gap-2">
          {minimizedWindows.map((windowId) => (
            <button
              key={windowId}
              onClick={() => openWindow(windowId)}
              className="px-2 py-1 bg-black/50 border border-neon-green/50 text-neon-green text-xs hover:bg-neon-green/20 transition-colors"
            >
              {windowId === "typing"
                ? "TERMINAL"
                : windowId === "logs"
                  ? "IP LOGS"
                  : windowId === "system"
                    ? "SYSTEM"
                    : windowId === "graph"
                      ? "METRICS"
                      : windowId === "payload"
                        ? "PAYLOAD"
                        : windowId === "progress"
                          ? "STATUS"
                          : windowId === "leaderboard"
                            ? "SCORES"
                            : windowId.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && <PauseOverlay />}
    </div>
  )
}

