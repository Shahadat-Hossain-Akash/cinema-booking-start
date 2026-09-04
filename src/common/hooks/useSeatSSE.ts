import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useSeatSSE(movieId: string) {
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const url = `/movies/${movieId}/seat/events`

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['seats', movieId] })
    }

    eventSource.addEventListener('seat.held', invalidate)
    eventSource.addEventListener('seat.confirmed', invalidate)
    eventSource.addEventListener('seat.released', invalidate)
    eventSource.addEventListener('seat.expired', invalidate)

    eventSource.onerror = (e) => {
      console.warn(`[SSE] connection error for movie ${movieId}`, e)
      // EventSource will automatically retry — no action needed here.
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [movieId, queryClient])
}