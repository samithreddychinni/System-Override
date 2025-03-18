"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SystemAlertPopupProps {
  message: string
}

export const SystemAlertPopup = ({ message }: SystemAlertPopupProps) => {
  const [position, setPosition] = useState({
    x: Math.random() * (window.innerWidth - 300),
    y: Math.random() * (window.innerHeight - 100),
  })

  // Random glitch effect
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 100)
    }, 500)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <motion.div
      className={`fixed z-50 bg-black border-2 border-red-500 p-4 shadow-lg ${isGlitching ? "animate-glitch" : ""}`}
      style={{ left: position.x, top: position.y, width: 300 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-red-500 font-mono text-sm font-bold">SYSTEM ALERT</div>
        <div className="text-red-500 font-mono text-xs">{new Date().toLocaleTimeString()}</div>
      </div>

      <div className="text-neon-green font-mono text-sm">{message}</div>
    </motion.div>
  )
}

