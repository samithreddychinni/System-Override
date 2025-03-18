"use client"

import { VT323 } from "next/font/google"
import { motion } from "framer-motion"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { useMission } from "@/context/mission-context"

// Load font
const vt323 = VT323({ subsets: ["latin"], weight: "400" })

export const GameOverScreen = () => {
  const { resetSecurityBreaches } = useGameMechanics()
  const { resetMission } = useMission()

  const handleRetry = () => {
    resetSecurityBreaches()
    resetMission()
  }

  return (
    <div className={`${vt323.className} fixed inset-0 flex items-center justify-center bg-black/90 z-50`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full p-8 border-2 border-red-500 shadow-lg bg-black"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-mono text-red-500 text-center mb-8 animate-pulse"
        >
          MISSION FAILED
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl font-mono text-red-500 mb-4">HACK DETECTED</div>
          <div className="text-xl font-mono text-neon-green/70">Your intrusion has been identified and blocked</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mb-8 text-neon-green/70 font-mono"
        >
          <p>Security countermeasures have been deployed.</p>
          <p>Your connection has been traced and logged.</p>
          <p>All access to the target system has been revoked.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex justify-center"
        >
          <button
            onClick={handleRetry}
            className="bg-black border-2 border-neon-green py-3 px-6 text-neon-green font-mono hover:bg-neon-green/20 transition-colors"
          >
            TRY AGAIN
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

