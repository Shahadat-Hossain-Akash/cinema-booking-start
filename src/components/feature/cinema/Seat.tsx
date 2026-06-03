import { getSessionId } from '#/server-fns/session.functions'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const SEAT_COLORS: Record<SeatStatus, string> = {
  available: '#c8c8c8',
  'held-by-me': '#4DC80B',
  'others-hold': '#F2C01E',
  booked: '#EE1F1F',
}

function resolveSeatStatus(
  seatId: string,
  status: SeatStatus,
  bookedSeats: SeatBooking[],
  selectedSeats: Set<string>,
  sessionId: string | undefined,
): { currentStatus: SeatStatus; isDisabled: boolean } {
  const bookedSeat = Array.isArray(bookedSeats)
    ? bookedSeats.find((s: any) => s.seat_id === seatId)
    : null

  if (!bookedSeat) {
    return {
      currentStatus: selectedSeats.has(seatId) ? 'held-by-me' : status,
      isDisabled: false,
    }
  }

  const isOwner = bookedSeat.user_id === sessionId
  const isHeld = bookedSeat.booked && !bookedSeat.confirmed
  const isConfirmed = bookedSeat.booked && bookedSeat.confirmed

  if (isConfirmed) return { currentStatus: 'booked', isDisabled: true }
  if (isHeld && isOwner)
    return { currentStatus: 'held-by-me', isDisabled: false }
  if (isHeld) return { currentStatus: 'others-hold', isDisabled: true }

  return { currentStatus: status, isDisabled: false }
}

function useSessionId() {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSessionId,
  })
}

interface SeatProps {
  title: string
  status: SeatStatus
  bookedSeats: SeatBooking[]
  selectedSeats: Set<string>
  onClick: () => void
}

const Seat = ({
  title,
  status,
  bookedSeats,
  selectedSeats,
  onClick,
}: SeatProps) => {
  const { data: sessionId } = useSessionId()

  const { currentStatus, isDisabled } = useMemo(() => {
    return resolveSeatStatus(
      title,
      status,
      bookedSeats,
      selectedSeats,
      sessionId,
    )
  }, [title, status, bookedSeats, selectedSeats, sessionId])

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      style={{ backgroundColor: SEAT_COLORS[currentStatus] }}
      className="flex cursor-pointer rounded-t-2xl h-10 w-10 items-center justify-center rounded-lg text-[10px] font-medium text-white transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100 sm:h-12 sm:w-12"
    >
      {title}
    </button>
  )
}

export default Seat
