import { useCountdownTimer } from '#/common/hooks/useCountdownTimer'

interface CountDownTimerProps {
  expiresAt: string
  onExpire?: () => void
}

const CountDownTimer = ({ expiresAt, onExpire }: CountDownTimerProps) => {
  const { remainingSeconds, formattedTime, isExpired } =
    useCountdownTimer(expiresAt)

  if (isExpired && onExpire) {
    onExpire()
  }

  const timerColor =
    remainingSeconds <= 30
      ? 'text-red-500'
      : remainingSeconds <= 60
        ? 'text-amber-500'
        : 'text-emerald-600'

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg px-4 py-2">
      <svg
        className={`w-4 h-4 ${timerColor}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className={`text-sm font-semibold tabular-nums ${timerColor}`}>
        {formattedTime}
      </span>
      <span className="text-xs text-stone-400">remaining</span>
    </div>
  )
}

export default CountDownTimer
