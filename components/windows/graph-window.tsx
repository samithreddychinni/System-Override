"use client"

import { useEffect, useState } from "react"
import { WindowBase } from "../window-base"
import { useMission } from "@/context/mission-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GraphWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const GraphWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: GraphWindowProps) => {
  const { typingSpeed } = useMission()
  const [data, setData] = useState<{ time: string; wpm: number }[]>([])

  useEffect(() => {
    // Add new data point every second
    const interval = setInterval(() => {
      const now = new Date()
      const timeString = `${now.getMinutes()}:${now.getSeconds().toString().padStart(2, "0")}`

      setData((prevData) => {
        const newData = [...prevData, { time: timeString, wpm: typingSpeed }]
        // Keep only the last 20 data points
        if (newData.length > 20) {
          return newData.slice(newData.length - 20)
        }
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [typingSpeed])

  // Determine color based on typing speed
  const getLineColor = () => {
    if (typingSpeed < 30) return "#ff4d4d" // Red for slow
    if (typingSpeed < 60) return "#ffff4d" // Yellow for medium
    return "#4dff4d" // Green for fast
  }

  return (
    <WindowBase
      id={id}
      title="TYPING METRICS :: REAL-TIME ANALYSIS"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col">
        <div className="text-neon-green/70 text-xs font-mono mb-2">
          CURRENT WPM: <span className="text-neon-green">{typingSpeed}</span>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" />
              <XAxis dataKey="time" stroke="#4dff4d" tick={{ fill: "#4dff4d", fontSize: 10 }} />
              <YAxis stroke="#4dff4d" tick={{ fill: "#4dff4d", fontSize: 10 }} domain={[0, "dataMax + 20"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #4dff4d",
                  color: "#4dff4d",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke={getLineColor()}
                strokeWidth={2}
                dot={{ r: 2, fill: getLineColor() }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-neon-green/70 text-xs font-mono mt-2 flex justify-between">
          <span>EFFICIENCY RATING: {typingSpeed < 30 ? "LOW" : typingSpeed < 60 ? "MEDIUM" : "HIGH"}</span>
          <span>TRACE DETECTION RISK: {typingSpeed < 30 ? "HIGH" : typingSpeed < 60 ? "MEDIUM" : "LOW"}</span>
        </div>
      </div>
    </WindowBase>
  )
}

