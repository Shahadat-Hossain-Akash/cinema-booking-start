import Legend from './Legend'
import { rowLabel } from '#/utils/rowLetter'
import Seat from './Seat'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteSeatBooking,
  getSeatsBookings,
  postSeatBooking,
  putSeatConfirm,
} from '#/server-fns/movies.functions'
import {
  Modal,
  useMinimizableModal

} from '#/components/common/modal'
import type { ModalAction } from '#/components/common/modal';

const MovieSeat = ({ movie }: { movie: Movie }) => {
  const { seats_per_row, rows, id } = movie
  const seats: SeatStatus[][] = Array.from({ length: rows }, () =>
    Array.from({ length: seats_per_row }, () => 'available'),
  )
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(
    () => new Set<string>(),
  )

  const modal = useMinimizableModal()

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.has(seat)) {
      modal.open()
      return;
    } else {
      deleteSeatBooked(bookSeatResponse?.session_id)
    }
    setSelectedSeats((prev) => {
      const next = new Set(prev)
      if (next.has(seat)) {
        next.delete(seat)
      } else {
        if (next.size === 1) {
          next.clear()
        }
        next.add(seat)
      }
      return next
    })

    // Trigger the mutation to hold the seat
    bookSeat(seat)
    modal.open()
  }

  const { mutate: bookSeat, data: bookSeatResponse } = useMutation({
    mutationKey: ['seats', id],
    mutationFn: (seatId: string) =>
      postSeatBooking({
        data: {
          movieId: id,
          seatId: seatId,
        },
      }),
  })

  const { data } = useQuery({
    queryKey: ['seats', id],
    queryFn: () =>
      getSeatsBookings({
        data: id,
      }),
  })

  const { mutate: confirmSeatBooking } = useMutation({
    mutationKey: ['seats-confirm', id],
    mutationFn: (sessionID: string) =>
      putSeatConfirm({
        data: sessionID,
      }),
  })

  const { mutate: deleteSeatBooked } = useMutation({
    mutationKey: ['seats-delete', id],
    mutationFn: (sessionID: string) =>
      deleteSeatBooking({
        data: sessionID,
      }),
  })

  const ModalActions: ModalAction[] = [
    {
      label: 'Cancel Booking',
      onClick: () => {
        deleteSeatBooked(bookSeatResponse?.session_id)
        modal.close()
      },
      variant: 'danger',
    },
    {
      label: 'Confirm Booking',
      onClick: () => {
        confirmSeatBooking(bookSeatResponse?.session_id)
        modal.close()
      },
      variant: 'primary',
    },
  ]

  console.log({ data, bookSeatResponse })

  return (
    <div className="flex flex-col items-center gap-4 min-w-lg overflow-x-auto px-8">
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
        <p>Modal body content goes here.</p>
      </Modal>
    </div>
  )
}

export default MovieSeat
