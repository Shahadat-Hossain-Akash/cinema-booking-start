import MovieCard from './MovieCard'

function MovieListComponent({
  movies,
  setSelectedMovie,
}: {
  movies: Movie[]
  setSelectedMovie: (movie: Movie) => void
}) {
  function handleMovieClick(movie: Movie) {
    setSelectedMovie(movie)
  }
  return (
    <div className="movie-list">
      {movies.length === 0 ? (
        <div>No movies found</div>
      ) : (
        movies.map((item) => (
          <MovieCard
            key={item.name}
            {...item}
            onClick={() => handleMovieClick(item)}
          />
        ))
      )}
    </div>
  )
}
export default MovieListComponent
