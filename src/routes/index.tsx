import MovieList from '#/components/feature/cinema/MovieList'
import MovieSeat from '#/components/feature/cinema/MovieSeat'
import Screen from '#/components/feature/cinema/Screen'
import { getMovies } from '#/server-fns/movies.functions'
import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    try {
      return await getMovies()
    } catch (e) {
      return []
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center mt-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />
  }
})

function App() {
  const movies = Route.useLoaderData()
  const [movie, setMovies] = useState<Movie | null>(null)
  return (
    <main className="min-h-screen mt-4">
      <MovieList movies={movies} setSelectedMovie={setMovies} />

      <Screen />
      {movie && <MovieSeat key={movie.title} movie={movie} />}
    </main>
  )
}
