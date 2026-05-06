interface Movie {
  id: string
  title: string
  rows: number
  seats_per_row: number
  total_seats: number

}
type SeatStatus = 'available' | 'held-by-me' | 'others-hold' | 'booked'
