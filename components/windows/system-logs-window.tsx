"use client"

import { useEffect, useRef, useState } from "react"
import { WindowBase } from "../window-base"
import { motion } from "framer-motion"
import { useMission } from "@/context/mission-context"
import { typingEventEmitter } from "../windows/typing-window"

interface SystemLogsWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

interface SystemLogEntry {
  id: number
  message: string
  type: "success" | "progress" | "error"
}

const systemMessages = [
  "Initializing kernel bypass...",
  "Scanning for vulnerabilities...",
  "Exploiting CVE-2023-1337...",
  "Injecting payload into memory...",
  "Bypassing firewall rules...",
  "Escalating privileges...",
  "Disabling security protocols...",
  "Extracting encryption keys...",
  "Establishing backdoor connection...",
  "Corrupting system logs...",
  "Deploying rootkit...",
  "Intercepting network traffic...",
  "Cracking password hashes...",
  "Bypassing two-factor authentication...",
  "Exploiting buffer overflow...",
  "Injecting SQL commands...",
  "Executing remote code...",
  "Disabling antivirus...",
  "Modifying registry keys...",
  "Capturing keystrokes...",
  "Exfiltrating sensitive data...",
  "Deploying ransomware payload...",
  "Establishing persistence...",
  "Creating admin account...",
  "Disabling system restore...",
  "Modifying boot sequence...",
  "Bypassing CAPTCHA...",
  "Exploiting zero-day vulnerability...",
  "Hijacking session cookies...",
  "Poisoning DNS cache...",
]

export const SystemLogsWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: SystemLogsWindowProps) => {
  const [logs, setLogs] = useState<SystemLogEntry[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)
  const logCount = useRef(0)
  const { missionProgress } = useMission()
  const [typingErrorStreak, setTypingErrorStreak] = useState(0)

  // Add logs based on mission progress
  useEffect(() => {
    // Add new log every few seconds
    const interval = setInterval(() => {
      const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)]
      const successRate = missionProgress / 100 // Higher progress = more success messages

      const isSuccess = Math.random() < successRate
      const message = isSuccess ? `SUCCESS: ${randomMessage}` : `IN PROGRESS: ${randomMessage}`
      const type = isSuccess ? "success" : "progress"

      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, { id: logCount.current++, message, type }]
        // Keep only the last 50 logs
        if (newLogs.length > 50) {
          return newLogs.slice(newLogs.length - 50)
        }
        return newLogs
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [missionProgress])

  // Subscribe to typing events
  useEffect(() => {
    const unsubscribe = typingEventEmitter.subscribe((event) => {
      const { type, data } = event

      if (type === "typing_error") {
        setTypingErrorStreak((prev) => prev + 1)

        // Add error logs after multiple errors
        if (typingErrorStreak >= 2) {
          setLogs((prevLogs) => {
            const newLogs = [
              ...prevLogs,
              {
                id: logCount.current++,
                message: `ERROR: Security system detected anomalous input patterns`,
                type: "error",
              },
            ]

            // Keep only the last 50 logs
            if (newLogs.length > 50) {
              return newLogs.slice(newLogs.length - 50)
            }
            return newLogs
          })
        }
      } else if (type === "typing_success") {
        setTypingErrorStreak(0)

        // Add success logs
        setLogs((prevLogs) => {
          const newLogs = [
            ...prevLogs,
            {
              id: logCount.current++,
              message: `SUCCESS: Command execution completed`,
              type: "success",
            },
          ]

          // Keep only the last 50 logs
          if (newLogs.length > 50) {
            return newLogs.slice(newLogs.length - 50)
          }
          return newLogs
        })
      } else if (type === "typing_stopped") {
        // Add warning logs for typing stopped
        setLogs((prevLogs) => {
          const newLogs = [
            ...prevLogs,
            {
              id: logCount.current++,
              message: `ERROR: Connection timeout - security scan initiated`,
              type: "error",
            },
          ]

          // Keep only the last 50 logs
          if (newLogs.length > 50) {
            return newLogs.slice(newLogs.length - 50)
          }
          return newLogs
        })
      }
    })

    return unsubscribe
  }, [typingErrorStreak])

  // Scroll to bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  return (
    <WindowBase
      id={id}
      title="SYSTEM LOGS :: BREACH OPERATIONS"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto font-mono text-xs">
          {logs.map((log) => (
            <motion.div key={log.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mb-1">
              <span
                className={
                  log.type === "success" ? "text-green-400" : log.type === "error" ? "text-red-500" : "text-yellow-400"
                }
              >
                {log.message}
              </span>
            </motion.div>
          ))}
          <div ref={logsEndRef} />
        </div>
        <div className="mt-2 text-neon-green/70 text-xs font-mono">
          SYSTEM BREACH: {missionProgress}% COMPLETE | DETECTION RISK: {Math.max(0, 100 - missionProgress)}%
        </div>
      </div>
    </WindowBase>
  )
}

