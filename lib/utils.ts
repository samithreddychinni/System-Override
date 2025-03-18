import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random IP address
export function generateRandomIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256,
  )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

// Generate a random server name
export function generateRandomServerName() {
  const prefixes = ["SRV", "NODE", "CORE", "NET", "WEB", "DB", "APP", "API", "CDN", "VPN"]
  const domains = ["CORP", "GOV", "EDU", "MIL", "ORG", "NET", "COM", "IO", "AI", "TECH"]

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const number = Math.floor(Math.random() * 1000)

  return `${prefix}-${number}.${domain}`
}

