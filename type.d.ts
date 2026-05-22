interface Movie {
  id: string
  title: string
  rows: number
  seats_per_row: number
  total_seats: number
}
type SeatBooking = {
  seat_id: string
  user_id: string
  booked: boolean
  confirmed: boolean
}
type SeatStatus = 'available' | 'held-by-me' | 'others-hold' | 'booked'
