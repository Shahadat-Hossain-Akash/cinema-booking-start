import APIkit from '#/common/helpers/APIkit'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const getMovies = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await APIkit.movies.getMovies()
  return res.data
})

export const getSeatsBookings = createServerFn({ method: 'GET' })
  .inputValidator((movieId: string) => movieId)
  .handler(async ({ data: movieId }) => {
    const res = await APIkit.movies.getSeatsBookings(movieId)
    return res.data
  })

export const postSeatBooking = createServerFn({ method: 'POST' })
  .inputValidator((data: { movieId: string; seatId: string }) => data)
  .handler(async ({ data: { movieId, seatId } }) => {
    const userId = getCookie('session_id')
    const res = await APIkit.movies.postSeatBooking(movieId, seatId, {
      user_id: userId,
    })
    return res.data
  })

export const putSeatConfirm = createServerFn({ method: 'POST' })
  .inputValidator((sessionID: string) => sessionID)
  .handler(async ({ data: sessionID }) => {
    const userId = getCookie('session_id')
    const res = await APIkit.movies.putSeatConfirm(sessionID, {
      user_id: userId,
    })
    return res.data
  })

export const deleteSeatBooking = createServerFn({ method: 'POST' })
  .inputValidator((sessionID: string) => sessionID)
  .handler(async ({ data: sessionID }) => {
    const userId = getCookie('session_id')
    const res = await APIkit.movies.deleteSeatBooking(sessionID, {
      user_id: userId,
    })
    return res.data
  })
