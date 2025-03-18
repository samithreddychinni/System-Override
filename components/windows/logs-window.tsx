"use client"

import { useEffect, useRef, useState } from "react"
import { WindowBase } from "../window-base"
import { motion } from "framer-motion"
import { generateRandomIP, generateRandomServerName } from "@/lib/utils"
import { typingEventEmitter } from "../windows/typing-window"

interface LogsWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: "info" | "warning" | "error" | "success"
}

export const LogsWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: LogsWindowProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)
  const logCount = useRef(0)
  const [typingErrorCount, setTypingErrorCount] = useState(0)

  // Generate a random log entry
  const generateLogEntry = (type: "info" | "warning" | "error" | "success" = "info"): LogEntry => {
    const ip = generateRandomIP()
    const server = generateRandomServerName()

    let message = ""
    switch (type) {
      case "info":
        message = `Connection established with ${server} (${ip})`
        break
      case "warning":
        message = `Unusual traffic detected from ${ip}`
        break
      case "error":
        message = `Failed to breach firewall at ${ip}`
        break
      case "success":
        message = `Successfully bypassed security at ${server} (${ip})`
        break
    }

    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`

    return {
      id: logCount.current++,
      timestamp,
      message,
      type,
    }
  }

  // Add logs periodically
  useEffect(() => {
    // Add initial logs
    const initialLogs = []
    for (let i = 0; i < 5; i++) {
      initialLogs.push(generateLogEntry())
    }
    setLogs(initialLogs)

    // Add new logs periodically
    const interval = setInterval(() => {
      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, generateLogEntry()]
        // Keep only the last 100 logs
        if (newLogs.length > 100) {
          return newLogs.slice(newLogs.length - 100)
        }
        return newLogs
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Subscribe to typing events
  useEffect(() => {
    const unsubscribe = typingEventEmitter.subscribe((event) => {
      const { type, data } = event

      if (type === "typing_error") {
        setTypingErrorCount((prev) => prev + 1)

        // Add error logs
        setLogs((prevLogs) => {
          const newLogs = [
            ...prevLogs,
            {
              id: logCount.current++,
              timestamp:
                new Date().toLocaleTimeString() + "." + new Date().getMilliseconds().toString().padStart(3, "0"),
              message: `Error detected in input sequence (${data.input})`,
              type: "error",
            },
          ]

          // Keep only the last 100 logs
          if (newLogs.length > 100) {
            return newLogs.slice(newLogs.length - 100)
          }
          return newLogs
        })
      } else if (type === "typing_success") {
        // Add success logs
        setLogs((prevLogs) => {
          const newLogs = [
            ...prevLogs,
            {
              id: logCount.current++,
              timestamp:
                new Date().toLocaleTimeString() + "." + new Date().getMilliseconds().toString().padStart(3, "0"),
              message: `Command executed successfully: ${data.phrase.substring(0, 20)}...`,
              type: "success",
            },
          ]

          // Keep only the last 100 logs
          if (newLogs.length > 100) {
            return newLogs.slice(newLogs.length - 100)
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
              timestamp:
                new Date().toLocaleTimeString() + "." + new Date().getMilliseconds().toString().padStart(3, "0"),
              message: `Connection activity halted - possible detection risk`,
              type: "warning",
            },
          ]

          // Keep only the last 100 logs
          if (newLogs.length > 100) {
            return newLogs.slice(newLogs.length - 100)
          }
          return newLogs
        })
      }
    })

    return unsubscribe
  }, [])

  // Scroll to bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  // Get color for log type
  const getLogColor = (type: "info" | "warning" | "error" | "success") => {
    switch (type) {
      case "info":
        return "text-blue-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-500"
      case "success":
        return "text-green-400"
      default:
        return "text-neon-green"
    }
  }

  return (
    <WindowBase
      id={id}
      title="IP LOGS :: CONNECTION MONITOR"
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
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1 flex"
            >
              <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
              <span className={getLogColor(log.type)}>{log.message}</span>
            </motion.div>
          ))}
          <div ref={logsEndRef} />
        </div>
        <div className="mt-2 text-neon-green/70 text-xs font-mono">
          ACTIVE CONNECTIONS: {Math.floor(Math.random() * 10) + 5} | PACKETS: {Math.floor(Math.random() * 1000) + 500} |
          ERRORS: {typingErrorCount}
        </div>
      </div>
    </WindowBase>
  )
}

