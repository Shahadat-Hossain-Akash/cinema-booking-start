import Legend from './Legend'
import { rowLabel } from '#/utils/rowLetter'
import Seat from './Seat'
import { useState } from 'react'

const MovieSeat = ({ movie }: { movie: Movie }) => {
  const { columns, rows } = movie
  const seats: SeatStatus[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 'available'),
  )
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(
    () => new Set<string>(),
  )

  const handleSeatClick = (seat: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev)
      if (next.has(seat)) {
        next.delete(seat)
      } else {
        if (next.size === 1) return prev
        next.add(seat)
      }
      return next
    })
  }

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
          {Array.from({ length: columns }).map((_, col) => (
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
              const isSelected = selectedSeats.has(title)
              return (
                <Seat
                  key={`seat-${rowIdx}-${colIdx}`}
                  title={title}
                  status={isSelected ? 'held-by-me' : status}
                  onClick={() => handleSeatClick(title)}
                />
              )
            })}
          </div>
        ))}
      </div>

      <Legend />
    </div>
  )
}

export default MovieSeat
