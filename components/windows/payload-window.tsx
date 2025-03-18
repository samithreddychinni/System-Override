"use client"

import { useState } from "react"
import { WindowBase } from "../window-base"
import { motion } from "framer-motion"
import { useMission } from "@/context/mission-context"
import { useAudio } from "@/hooks/use-audio"
import { cn } from "@/lib/utils"

interface PayloadWindowProps {
  id: string
  isActive: boolean
  onActivate: () => void
  onClose: () => void
  onMinimize: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const PayloadWindow = ({
  id,
  isActive,
  onActivate,
  onClose,
  onMinimize,
  initialPosition,
  initialSize,
}: PayloadWindowProps) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const { updateProgress, missionProgress } = useMission()
  const { playSound } = useAudio()

  const handleUpload = () => {
    if (isUploading || uploadComplete) return

    setIsUploading(true)
    playSound("upload")

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadComplete(true)
        playSound("success")
        updateProgress(Math.min(missionProgress + 15, 100))
      }
      setUploadProgress(Math.round(progress))
    }, 200)
  }

  return (
    <WindowBase
      id={id}
      title="PAYLOAD UPLOADER :: VIRUS DEPLOYMENT"
      isActive={isActive}
      onActivate={onActivate}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      initialSize={initialSize}
    >
      <div className="h-full flex flex-col">
        <div className="text-neon-green/70 text-xs font-mono mb-4">SELECT PAYLOAD TO DEPLOY TO TARGET SYSTEM</div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {!isUploading && !uploadComplete ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-neon-green/50 p-8 rounded mb-4 hover:border-neon-green transition-colors">
                <input type="file" className="hidden" id="payload-upload" onChange={handleUpload} />
                <label htmlFor="payload-upload" className="cursor-pointer flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-neon-green/70 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-neon-green font-mono text-sm">Click to select payload file</span>
                </label>
              </div>
              <button
                onClick={handleUpload}
                className="bg-black border border-neon-green text-neon-green px-4 py-2 font-mono text-sm hover:bg-neon-green/20 transition-colors"
              >
                UPLOAD MALWARE
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-4 text-center">
                <span className="text-neon-green font-mono">
                  {uploadComplete ? "UPLOAD COMPLETE" : `UPLOADING PAYLOAD: ${uploadProgress}%`}
                </span>
              </div>

              <div className="w-full bg-black border border-neon-green/30 h-6 mb-4">
                <motion.div
                  className="h-full bg-neon-green/30"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              {uploadComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-green-400 font-mono"
                >
                  PAYLOAD DEPLOYED SUCCESSFULLY
                  <br />
                  <span className="text-xs text-neon-green/70 mt-2 block">
                    Target system compromised. Backdoor established.
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 text-neon-green/70 text-xs font-mono">
          <div className="flex justify-between">
            <span>AVAILABLE PAYLOADS:</span>
            <span>{uploadComplete ? "1/1 DEPLOYED" : "0/1 DEPLOYED"}</span>
          </div>
          <div
            className={cn(
              "mt-1 p-1 border border-neon-green/30 font-mono text-xs",
              uploadComplete ? "text-green-400" : "text-neon-green/50",
            )}
          >
            {uploadComplete ? "✓ " : "○ "}
            RANSOMWARE.EXE - TARGET: SYSTEM32
          </div>
        </div>
      </div>
    </WindowBase>
  )
}

