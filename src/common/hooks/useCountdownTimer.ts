import { useCallback, useEffect, useRef, useState } from 'react'

function getRemainingSeconds(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.floor(diff / 1000))
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

interface UseCountdownTimerReturn {
  remainingSeconds: number
  formattedTime: string
  isExpired: boolean
  clearTimer: () => void
}

export function useCountdownTimer(
  expiresAt: string | undefined | null,
): UseCountdownTimerReturn {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasStartedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    clearTimer()

    if (!expiresAt) {
      hasStartedRef.current = false
      return
    }

    hasStartedRef.current = true

    // Seed the initial value
    setRemainingSeconds(getRemainingSeconds(expiresAt))

    timerRef.current = setInterval(() => {
      const remaining = getRemainingSeconds(expiresAt)
      setRemainingSeconds(remaining)

      if (remaining <= 0) {
        clearTimer()
      }
    }, 1000)

    return clearTimer
  }, [expiresAt, clearTimer])

  return {
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    isExpired: hasStartedRef.current && remainingSeconds <= 0,
    clearTimer,
  }
}
