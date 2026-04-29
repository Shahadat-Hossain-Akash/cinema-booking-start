const SEAT_COLORS: Record<SeatStatus, string> = {
  available: '#c8c8c8',
  'held-by-me': '#4DC80B',
  'others-hold': '#F2C01E',
  booked: '#EE1F1F',
}

const Seat = ({
  title,
  status,
  onClick,
}: {
  title: string
  status: SeatStatus
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex cursor-pointer rounded-t-2xl h-10 w-10 items-center justify-center rounded-lg text-[10px] font-medium text-white transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100 sm:h-12 sm:w-12"
      style={{ backgroundColor: SEAT_COLORS[status] }}
    >
      {title}
    </button>
  )
}

export default Seat
