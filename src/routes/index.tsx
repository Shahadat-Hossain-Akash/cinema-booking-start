import MovieList from '#/components/feature/cinema/MovieList'
import MovieSeat from '#/components/feature/cinema/MovieSeat'
import Screen from '#/components/feature/cinema/Screen'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,

  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      movies: [
        {
          name: 'Avenger',
          rows: 5,
          columns: 5,
        },
        {
          name: 'Avenger 2',
          rows: 10,
          columns: 10,
        },
      ],
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center mt-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

function App() {
  const { movies } = Route.useLoaderData()
  const [movie, setMovies] = useState<Movie | null>(null)
  console.log(movie)
  return (
    <main className="min-h-screen mt-4">
      <MovieList movies={movies} setSelectedMovie={setMovies} />

      <Screen />
      {movie && <MovieSeat key={movie.name} movie={movie} />}
    </main>
  )
}
