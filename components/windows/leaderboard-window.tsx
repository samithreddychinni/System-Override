"use client"

import { useEffect, useState } from "react"
import { WindowBase } from "../window-base"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { getLeaderboard } from "@/lib/firebase"

interface LeaderboardWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

interface LeaderboardEntry {
  id: string
  username: string
  wpm: number
  timestamp: number
}

export const LeaderboardWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: LeaderboardWindowProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <WindowBase
      id={id}
      title="GLOBAL LEADERBOARD :: TOP HACKERS"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col">
        <div className="text-neon-green/70 text-xs font-mono mb-4">TOP HACKERS BY TYPING SPEED (WPM)</div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-neon-green animate-pulse">LOADING DATA...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-neon-green/70">NO DATA AVAILABLE</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neon-green/30">
                  <th className="text-left py-2 px-2 text-neon-green/70 text-xs font-mono">RANK</th>
                  <th className="text-left py-2 px-2 text-neon-green/70 text-xs font-mono">AGENT</th>
                  <th className="text-right py-2 px-2 text-neon-green/70 text-xs font-mono">WPM</th>
                  <th className="text-right py-2 px-2 text-neon-green/70 text-xs font-mono">DATE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-neon-green/10 ${user?.uid === entry.id ? "bg-neon-green/10" : ""}`}
                  >
                    <td className="py-2 px-2 text-neon-green font-mono text-xs">{index + 1}</td>
                    <td className="py-2 px-2 text-neon-green font-mono text-xs">
                      {entry.username}
                      {user?.uid === entry.id && <span className="ml-2 text-yellow-400">★</span>}
                    </td>
                    <td className="py-2 px-2 text-neon-green font-mono text-xs text-right">{entry.wpm}</td>
                    <td className="py-2 px-2 text-neon-green/70 font-mono text-xs text-right">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-neon-green/70 text-xs font-mono">
          YOUR BEST: {leaderboard.find((entry) => entry.id === user?.uid)?.wpm || 0} WPM
        </div>
      </div>
    </WindowBase>
  )
}

