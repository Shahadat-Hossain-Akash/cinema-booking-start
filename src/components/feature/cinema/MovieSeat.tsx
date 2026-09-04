import Legend from './Legend'
import { rowLabel } from '#/utils/rowLetter'
import Seat from './Seat'
import CountDownTimer from './CountDownTimer'
import { useEffect, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteSeatBooking,
  getSeatsBookings,
  postSeatBooking,
  putSeatConfirm,
} from '#/server-fns/movies.functions'
import { Modal, useMinimizableModal } from '#/components/common/modal'
import type { ModalAction } from '#/components/common/modal'
import { useCountdownTimer } from '#/common/hooks/useCountdownTimer'
import { useBookingSessions } from '#/common/hooks/useBookingSessionStore'
import { useSeatSSE } from '#/common/hooks/useSeatSSE'

const MovieSeat = ({ movie }: { movie: Movie }) => {
  const { seats_per_row, rows, id } = movie
  const seats: SeatStatus[][] = Array.from({ length: rows }, () =>
    Array.from({ length: seats_per_row }, () => 'available'),
  )

  const modal = useMinimizableModal()

  const {
    getMovieSessions,
    getSeatSession,
    addSession,
    removeSession,
    clearMovieSessions,
    getEarliestExpiry,
  } = useBookingSessions()

  const activeSessions = useMemo(
    () => getMovieSessions(id),
    [getMovieSessions, id],
  )

  const selectedSeats = useMemo(
    () => new Set(activeSessions.map((s) => s.seat_id)),
    [activeSessions],
  )

  // SSE: real-time updates push-invalidate this query
  useSeatSSE(id)

  const { data, refetch } = useQuery({
    queryKey: ['seats', id],
    queryFn: () => getSeatsBookings({ data: id }),
  })

  const handleSeatClick = (seat: string) => {
    const existingSession = getSeatSession(id, seat)
    if (existingSession) {
      // Releasing / Canceling this specific seat hold
      deleteSeatBooked(existingSession.session_id)
      removeSession(id, seat)
    } else {
      // Hold / Book this seat
      bookSeat(seat)
    }
  }

  const { mutate: bookSeat } = useMutation({
    mutationKey: ['seats', id],
    mutationFn: (seatId: string) =>
      postSeatBooking({
        data: {
          movieId: id,
          seatId: seatId,
        },
      }),
    onSuccess: (res, seatId) => {
      if (res?.session_id && res?.expires_at) {
        addSession(id, {
          seat_id: seatId,
          session_id: res.session_id,
          expires_at: res.expires_at,
        })
        refetch()
      }
    },
  })

  const { mutate: confirmSeatBooking } = useMutation({
    mutationKey: ['seats-confirm', id],
    mutationFn: (sessionID: string) =>
      putSeatConfirm({
        data: sessionID,
      }),
    onSuccess: () => {
      refetch()
    },
  })

  const { mutate: deleteSeatBooked } = useMutation({
    mutationKey: ['seats-delete', id],
    mutationFn: (sessionID: string) =>
      deleteSeatBooking({
        data: sessionID,
      }),
    onSuccess: () => {
      refetch()
    },
  })

  const earliestExpiry = getEarliestExpiry(id)
  const { remainingSeconds, clearTimer, isExpired } =
    useCountdownTimer(earliestExpiry)

  useEffect(() => {
    if (isExpired && activeSessions.length > 0) {
      // Cancel all booking sessions for this movie on expiry
      activeSessions.forEach((session) => {
        deleteSeatBooked(session.session_id)
      })
      clearMovieSessions(id)
      modal.close()
    }
  }, [isExpired, activeSessions, id])

  const ModalActions: ModalAction[] = [
    {
      label: 'No, cancel',
      onClick: () => {
        activeSessions.forEach((session) => {
          deleteSeatBooked(session.session_id)
        })
        clearMovieSessions(id)
        clearTimer()
        modal.close()
      },
      variant: 'danger',
    },
    {
      label: 'Yes, Confirm',
      onClick: () => {
        activeSessions.forEach((session) => {
          confirmSeatBooking(session.session_id)
        })
        clearMovieSessions(id)
        clearTimer()
        modal.close()
      },
      variant: 'primary',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-4 min-w-lg overflow-x-auto px-8 pb-8">
      <div className="flex flex-col gap-1.5 sm:gap-2 ">
        {/* Column numbers header */}
        <div className="flex items-center gap-2 sm:gap-2">
          {/* Spacer to align with row label */}
          <div
            className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
            aria-hidden
          />
          {Array.from({ length: seats_per_row }).map((_, col) => (
            <div
              key={`col-header-${col}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f4] text-xs font-medium sm:h-12 sm:w-12"
            >
              {col + 1}
            </div>
          ))}
        </div>

        {/* Seat rows */}
        {seats.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-2 sm:gap-2">
            {/* Row letter label */}
            <div className="flex bg-[#f4f4f4] rounded-lg h-10 w-10 items-center justify-center text-xs font-semibold sm:h-12 sm:w-12">
              {rowLabel(rowIdx)}
            </div>

            {row.map((status, colIdx) => {
              const title = `${rowLabel(rowIdx)}${colIdx + 1}`

              return (
                <Seat
                  key={`seat-${rowIdx}-${colIdx}`}
                  title={title}
                  status={status}
                  bookedSeats={data}
                  selectedSeats={selectedSeats}
                  onClick={() => handleSeatClick(title)}
                />
              )
            })}
          </div>
        ))}
      </div>

      <Legend />

      {activeSessions.length > 0 && (
        <button
          type="button"
          onClick={() => modal.open()}
          className="mt-4 px-8 py-3 bg-[#4DC80B] hover:bg-[#43b00a] text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-2"
        >
          Book {activeSessions.length} Seat
          {activeSessions.length > 1 ? 's' : ''} Now
        </button>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        isMinimized={modal.isMinimized}
        onMinimize={modal.minimize}
        onRestore={modal.restore}
        minimizable
        title="Book your tickets"
        size="md"
        backdrop
        actions={ModalActions}
      >
        {earliestExpiry && (
          <CountDownTimer expiresAt={earliestExpiry} onExpire={clearTimer} />
        )}

        {selectedSeats.size > 1 ? (
          <>
            <p className="text-center">
              Are you sure to book these seats{' '}
              <strong>{Array.from(selectedSeats).join(', ')}</strong> ?
            </p>
          </>
        ) : (
          <>
            <p className="text-center">
              Are you sure to book this seat{' '}
              <strong>{Array.from(selectedSeats)[0]}</strong> ?
            </p>
          </>
        )}
      </Modal>
    </div>
  )
}

export default MovieSeat
