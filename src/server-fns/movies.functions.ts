import { client } from "#/common/helpers/HTTPkit";
import { createServerFn } from "@tanstack/react-start";

export const getMovies = createServerFn({ method: 'GET' }).handler(async () => {
    const res = await client.get("/movies")
    return res.data
})

export const getSeatsBookings = createServerFn({ method: 'GET' })
    .inputValidator((movieId: string) => movieId)
    .handler(async ({ data: movieId }) => {
        const res = await client.get(`/movies/${movieId}/seats`)
        return res.data
    })