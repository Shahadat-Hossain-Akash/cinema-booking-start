interface Movie {
  name: string
  rows: number
  columns: number
}
type SeatStatus = 'available' | 'held-by-me' | 'others-hold' | 'booked'
