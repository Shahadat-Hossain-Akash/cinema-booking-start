import HTTPKit from "./HTTPkit"

const APIkit = {
    movies: {
        getMovies: () => {
            const url = "/movies"
            return HTTPKit.get(url)
        },
        getSeatsBookings: (movie_id: string) => {
            const url = `/movies/${movie_id}/seats`
            return HTTPKit.get(url)
        }
    },

}

export default APIkit