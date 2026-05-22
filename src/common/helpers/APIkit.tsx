import HTTPKit from './HTTPkit'

const APIkit = {
  movies: {
    getMovies: () => {
      const url = '/movies'
      return HTTPKit.get(url)
    },
    getSeatsBookings: (movie_id: string) => {
      const url = `/movies/${movie_id}/seats`
      return HTTPKit.get(url)
    },
    postSeatBooking: (movieID: string, seatID: string, payload: any) => {
      const url = `/movies/${movieID}/seat/${seatID}/hold`
      return HTTPKit.post(url, payload)
    },
    putSeatConfirm: (sessionID: string, payload: any) => {
      const url = `/sessions/${sessionID}/confirm`
      return HTTPKit.put(url, payload)
    },
    deleteSeatBooking: (sessionID: string, payload: any) => {
      const url = `/sessions/${sessionID}/release`
      return HTTPKit.delete(url, payload)
    },
  },
}

export default APIkit
