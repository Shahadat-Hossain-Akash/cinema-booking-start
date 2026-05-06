const MovieCard = ({
  id,
  title,
  rows,
  seats_per_row,
  onClick,
}: Movie & { onClick: () => void }) => {
  return (
    <section className="movie-card" onClick={onClick}>
      <h2 className="text-2xl">{title}</h2>
      <div className="flex flex-col">
        <span>Rows: {rows}</span> <span>Columns: {seats_per_row}</span>
      </div>
    </section>
  )
}

export default MovieCard
