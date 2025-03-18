"use client"

import { useEffect, useRef, useCallback } from "react"
import { Howl } from "howler"

type SoundType =
  | "type"
  | "error"
  | "success"
  | "open"
  | "close"
  | "minimize"
  | "alert"
  | "upload"
  | "download"
  | "boot"
  | "complete"
  | "breach"
  | "gameover"

export const useAudio = () => {
  const soundsRef = useRef<Record<SoundType, Howl | null>>({
    type: null,
    error: null,
    success: null,
    open: null,
    close: null,
    minimize: null,
    alert: null,
    upload: null,
    download: null,
    boot: null,
    complete: null,
    breach: null,
    gameover: null,
  })

  useEffect(() => {
    // Initialize sounds
    soundsRef.current = {
      type: new Howl({
        src: ["/sounds/type.mp3"],
        volume: 0.2,
        sprite: {
          slow: [0, 300],
          medium: [300, 300],
          fast: [600, 300],
        },
      }),
      error: new Howl({
        src: ["/sounds/error.mp3"],
        volume: 0.3,
      }),
      success: new Howl({
        src: ["/sounds/success.mp3"],
        volume: 0.3,
      }),
      open: new Howl({
        src: ["/sounds/open.mp3"],
        volume: 0.3,
      }),
      close: new Howl({
        src: ["/sounds/close.mp3"],
        volume: 0.3,
      }),
      minimize: new Howl({
        src: ["/sounds/minimize.mp3"],
        volume: 0.3,
      }),
      alert: new Howl({
        src: ["/sounds/alert.mp3"],
        volume: 0.3,
      }),
      upload: new Howl({
        src: ["/sounds/upload.mp3"],
        volume: 0.3,
      }),
      download: new Howl({
        src: ["/sounds/download.mp3"],
        volume: 0.3,
      }),
      boot: new Howl({
        src: ["/sounds/boot.mp3"],
        volume: 0.3,
      }),
      complete: new Howl({
        src: ["/sounds/complete.mp3"],
        volume: 0.4,
      }),
      breach: new Howl({
        src: ["/sounds/breach.mp3"],
        volume: 0.4,
      }),
      gameover: new Howl({
        src: ["/sounds/gameover.mp3"],
        volume: 0.4,
      }),
    }

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach((sound) => {
        if (sound) {
          sound.unload()
        }
      })
    }
  }, [])

  const playSound = useCallback((type: SoundType, variant?: "slow" | "medium" | "fast") => {
    const sound = soundsRef.current[type]
    if (sound) {
      if (type === "type" && variant) {
        sound.play(variant)
      } else {
        sound.play()
      }
    }
  }, [])

  const playTypingSound = useCallback(
    (speed: number) => {
      if (speed < 30) {
        playSound("type", "slow")
      } else if (speed < 60) {
        playSound("type", "medium")
      } else {
        playSound("type", "fast")
      }
    },
    [playSound],
  )

  return { playSound, playTypingSound }
}

