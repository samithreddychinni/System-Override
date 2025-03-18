"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Rnd } from "react-rnd"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface WindowBaseProps {
  id: string
  title: string
  children: ReactNode
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: Position
  initialSize: Size
  className?: string
}

export const WindowBase = ({
  id,
  title,
  children,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
  className,
}: WindowBaseProps) => {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [size, setSize] = useState<Size>(initialSize)
  const [isGlitching, setIsGlitching] = useState(false)

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      }
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: size.width, height: size.height }}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: Number.parseInt(ref.style.width),
          height: Number.parseInt(ref.style.height),
        })
        setPosition(position)
      }}
      className={cn("overflow-hidden", isActive ? "z-20" : "z-10", isGlitching && "animate-glitch", className)}
      bounds="parent"
      minWidth={300}
      minHeight={200}
    >
      <motion.div
        className={cn(
          "flex flex-col h-full bg-black border-2",
          isActive ? "border-neon-green shadow-neon" : "border-neon-green/50",
          "transition-colors duration-300",
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={onActivate}
      >
        {/* Window Title Bar */}
        <div
          className={cn(
            "flex items-center px-2 py-1 bg-black border-b",
            isActive ? "border-neon-green text-neon-green" : "border-neon-green/50 text-neon-green/70",
          )}
        >
          <div className="text-xs font-mono uppercase tracking-wider flex-1 truncate">{title}</div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
              className="w-4 h-4 flex items-center justify-center bg-black border border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
            >
              <span className="text-xs">_</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-4 h-4 flex items-center justify-center bg-black border border-red-500 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden p-2 bg-black/90 backdrop-blur-sm">{children}</div>

        {/* Window Status Bar */}
        <div className="px-2 py-0.5 bg-black border-t border-neon-green/30 text-neon-green/70 text-[10px] font-mono flex">
          <span>SYS::{id.toUpperCase()}</span>
          <span className="ml-auto">
            {new Date().toLocaleTimeString()} | {size.width}x{size.height}
          </span>
        </div>
      </motion.div>
    </Rnd>
  )
}

