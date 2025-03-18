"use client"

import { useEffect, useState, useRef } from "react"
import { VT323 } from "next/font/google"
import { motion } from "framer-motion"
import { useMission } from "@/context/mission-context"
import { useAudio } from "@/hooks/use-audio"
import { useAuth } from "@/hooks/use-auth"
import { saveScore } from "@/lib/firebase"
import gsap from "gsap"

// Load font
const vt323 = VT323({ subsets: ["latin"], weight: "400" })

export const MissionCompleteScreen = () => {
  const { typingSpeed, resetMission } = useMission()
  const { playSound } = useAudio()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [showCodeLeak, setShowCodeLeak] = useState(false)
  const codeLeakRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    playSound("complete")

    // Save score to leaderboard if user is logged in
    const saveUserScore = async () => {
      if (user && typingSpeed > 0) {
        try {
          await saveScore(user.uid, user.displayName || "Anonymous", typingSpeed)
          setSaved(true)
        } catch (error) {
          console.error("Error saving score:", error)
        }
      }
    }

    saveUserScore()

    // Show code leak effect after a delay
    setTimeout(() => {
      setShowCodeLeak(true)
    }, 2000)
  }, [playSound, user, typingSpeed])

  // Animate code leak effect
  useEffect(() => {
    if (showCodeLeak && codeLeakRef.current) {
      const codeLines = codeLeakRef.current.querySelectorAll(".code-line")

      gsap.fromTo(
        codeLines,
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.2,
          ease: "power1.out",
        },
      )

      // Continuous scrolling animation
      gsap.to(codeLeakRef.current, {
        scrollTop: codeLeakRef.current.scrollHeight,
        duration: 15,
        ease: "none",
      })
    }
  }, [showCodeLeak])

  const handleDownload = () => {
    // Create a text file with fake "stolen data"
    const content = `
SYSTEM OVERRIDE - MISSION COMPLETE
================================

TARGET SYSTEM: CORPORATE MAINFRAME
BREACH DATE: ${new Date().toISOString()}
AGENT: ${user?.displayName || "ANONYMOUS"}
TYPING SPEED: ${typingSpeed} WPM

EXTRACTED DATA:
--------------
- User credentials database
- Financial records (Q1-Q4)
- Project "Phoenix" documentation
- Internal communications archive
- Proprietary algorithms

BACKDOOR ESTABLISHED: YES
TRACES REMOVED: YES
SYSTEM LOGS WIPED: YES

THIS IS A SIMULATION. NO ACTUAL SYSTEMS WERE HARMED.
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "CLASSIFIED_DATA.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    playSound("download")
  }

  // Generate fake code for the code leak effect
  const generateFakeCode = () => {
    const codeSnippets = [
      "const decrypt = (data, key) => { return data.map(byte => byte ^ key); };",
      "function bypassFirewall(target) { return exploitVulnerability(target, 0x7FF4); }",
      "class SecurityBypass { constructor(target) { this.target = target; } }",
      "async function extractData(server) { const conn = await createSecureChannel(server); }",
      "const encryptedData = Buffer.from(rawData).toString('base64');",
      "if (securityLevel > 3) { deployCountermeasures(); return false; }",
      "for (let i = 0; i < servers.length; i++) { compromisedNodes.push(servers[i]); }",
      "const vulnerabilities = scanTarget(ip, { deep: true, stealth: true });",
      "class Payload { constructor() { this.signature = generateRandomSignature(); } }",
      "function injectShellcode(process, payload) { return process.write(payload, 0x4000); }",
      "const backdoor = new PersistentConnection(target, { encrypted: true });",
      "while (!accessGranted) { attempts++; if (attempts > maxAttempts) break; }",
      "ssh.connect({ host, username: 'root', privateKey: hackedKey });",
      "const sensitive = database.query('SELECT * FROM users WHERE admin = 1');",
      "if (detectIntrusion()) { wipeTraces(); routeThroughProxy(); }",
      "const decryptionKey = bruteforce(encryptedFile, possibleKeys);",
      "function elevatePrivileges(user) { return setUserPermissions(user, 'root'); }",
      "const ports = await scanOpenPorts(targetIP, [22, 80, 443, 3306, 5432]);",
      "class RootKit { install() { hideProcess(); interceptSystemCalls(); } }",
      "const memory = dumpProcessMemory(targetPID, 0x0000, 0xFFFF);",
    ]

    // Generate 100 lines of fake code
    return Array(100)
      .fill(0)
      .map(() => codeSnippets[Math.floor(Math.random() * codeSnippets.length)])
  }

  return (
    <div className={`${vt323.className} fixed inset-0 flex items-center justify-center bg-black/90 z-50`}>
      <div className="absolute inset-0 overflow-hidden">
        {showCodeLeak && (
          <div ref={codeLeakRef} className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            {generateFakeCode().map((line, index) => (
              <div key={index} className="code-line text-neon-green font-mono text-xs">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full p-8 border-2 border-neon-green shadow-neon bg-black relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-mono text-neon-green text-center mb-8"
        >
          MISSION COMPLETE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl font-mono text-green-400 mb-4 animate-pulse">SYSTEM BREACHED</div>
          <div className="text-xl font-mono text-neon-green/70">All security protocols bypassed successfully</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-2 gap-8 mb-8"
        >
          <div className="border border-neon-green/30 p-4">
            <div className="text-neon-green/70 font-mono text-sm mb-2">AGENT PERFORMANCE</div>
            <div className="text-2xl font-mono text-neon-green">{typingSpeed} WPM</div>
          </div>

          <div className="border border-neon-green/30 p-4">
            <div className="text-neon-green/70 font-mono text-sm mb-2">MISSION STATUS</div>
            <div className="text-2xl font-mono text-green-400">100% COMPLETE</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={handleDownload}
            className="bg-black border-2 border-neon-green py-3 px-6 text-neon-green font-mono hover:bg-neon-green/20 transition-colors"
          >
            DOWNLOAD DATA
          </button>

          <button
            onClick={resetMission}
            className="bg-black border-2 border-neon-green/50 py-3 px-6 text-neon-green/70 font-mono hover:bg-neon-green/10 transition-colors"
          >
            NEW MISSION
          </button>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-8 text-center text-neon-green/50 text-sm font-mono"
          >
            {saved ? "Your score has been saved to the global leaderboard" : "Connecting to global leaderboard..."}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

