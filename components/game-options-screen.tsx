"use client"

import { useState } from "react"
import { VT323 } from "next/font/google"
import { motion } from "framer-motion"
import { useAudio } from "@/hooks/use-audio"

const vt323 = VT323({ subsets: ["latin"], weight: "400" })

interface GameOptionsScreenProps {
  onSelectOptions: (language: "english" | "code", difficulty: "basic" | "medium" | "hard") => void
}

export const GameOptionsScreen = ({ onSelectOptions }: GameOptionsScreenProps) => {
  const [language, setLanguage] = useState<"english" | "code">("code")
  const [difficulty, setDifficulty] = useState<"basic" | "medium" | "hard">("medium")
  const { playSound } = useAudio()

  const handleSubmit = () => {
    playSound("success")
    onSelectOptions(language, difficulty)
  }

  return (
    <div className={`${vt323.className} fixed inset-0 flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black border-2 border-neon-green p-8 w-full max-w-md shadow-neon"
      >
        <div className="text-center mb-8">
          <h1 className="text-neon-green text-3xl font-mono mb-2">MISSION PARAMETERS</h1>
          <p className="text-neon-green/70 text-sm font-mono">SELECT YOUR PREFERENCES</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-neon-green/70 text-sm font-mono mb-2">LANGUAGE MODE</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setLanguage("english")
                  playSound("type")
                }}
                className={`bg-black border-2 py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors ${
                  language === "english" ? "border-neon-green" : "border-neon-green/30 text-neon-green/70"
                }`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => {
                  setLanguage("code")
                  playSound("type")
                }}
                className={`bg-black border-2 py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors ${
                  language === "code" ? "border-neon-green" : "border-neon-green/30 text-neon-green/70"
                }`}
              >
                CODE
              </button>
            </div>
            <p className="mt-2 text-neon-green/50 text-xs font-mono">
              {language === "english"
                ? "ENGLISH: Type basic English commands and phrases"
                : "CODE: Type programming commands and syntax"}
            </p>
          </div>

          <div>
            <label className="block text-neon-green/70 text-sm font-mono mb-2">DIFFICULTY LEVEL</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setDifficulty("basic")
                  playSound("type")
                }}
                className={`bg-black border-2 py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors ${
                  difficulty === "basic" ? "border-green-400" : "border-neon-green/30 text-neon-green/70"
                }`}
              >
                BASIC
              </button>
              <button
                onClick={() => {
                  setDifficulty("medium")
                  playSound("type")
                }}
                className={`bg-black border-2 py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors ${
                  difficulty === "medium" ? "border-yellow-400" : "border-neon-green/30 text-neon-green/70"
                }`}
              >
                MEDIUM
              </button>
              <button
                onClick={() => {
                  setDifficulty("hard")
                  playSound("type")
                }}
                className={`bg-black border-2 py-2 text-neon-green font-mono hover:bg-neon-green/20 transition-colors ${
                  difficulty === "hard" ? "border-red-400" : "border-neon-green/30 text-neon-green/70"
                }`}
              >
                HARD
              </button>
            </div>
            <p className="mt-2 text-neon-green/50 text-xs font-mono">
              {difficulty === "basic"
                ? "BASIC: 2 minutes mission time, simpler tasks"
                : difficulty === "medium"
                  ? "MEDIUM: 3 minutes mission time, moderate complexity"
                  : "HARD: 4 minutes mission time, complex challenges"}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black border-2 border-neon-green py-3 text-neon-green font-mono hover:bg-neon-green/20 transition-colors"
          >
            START MISSION
          </button>
        </div>
      </motion.div>
    </div>
  )
}

