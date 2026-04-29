const MovieCard = ({
  name,
  rows,
  columns,
  onClick,
}: Movie & { onClick: () => void }) => {
  return (
    <section className="movie-card" onClick={onClick}>
      <h2 className="text-2xl">{name}</h2>
      <div className="flex flex-col">
        <span>Rows: {rows}</span> <span>Columns: {columns}</span>
      </div>
    </section>
  )
}

export default MovieCard
