"use client"

import { motion } from "framer-motion"
import { useGameMechanics } from "@/context/game-mechanics-context"
import { VT323 } from "next/font/google"

const vt323 = VT323({ subsets: ["latin"], weight: "400" })

export const PauseOverlay = () => {
  const { togglePause } = useGameMechanics()

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${vt323.className} text-neon-green text-6xl font-bold mb-8`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ATTACK PAUSED
      </motion.div>

      <motion.div
        className="flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={togglePause}
          className="bg-black border-2 border-neon-green py-3 px-6 text-neon-green font-mono hover:bg-neon-green/20 transition-colors"
        >
          RESUME MISSION
        </button>
      </motion.div>

      <motion.div
        className="text-neon-green/50 text-sm mt-8 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Press ESC to resume
      </motion.div>
    </motion.div>
  )
}

