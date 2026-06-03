import React, { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface BookingSession {
  session_id: string
  expires_at: string
  seat_id: string
}

export type Sessions = Record<
  string,
  Record<string, BookingSession> | undefined
>

interface BookingSessionContextType {
  sessions: Sessions
  getMovieSessions: (movieId: string) => BookingSession[]
  getSeatSession: (movieId: string, seatId: string) => BookingSession | null
  addSession: (movieId: string, session: BookingSession) => void
  removeSession: (movieId: string, seatId: string) => void
  clearMovieSessions: (movieId: string) => void
  getEarliestExpiry: (movieId: string) => string | null
}

const BookingSessionContext = createContext<BookingSessionContextType | null>(
  null,
)

export function BookingSessionProvider({ children }: { children: ReactNode }) {
  // Store structure: { [movieId]: { [seatId]: BookingSession } }
  const [sessions, setSessions] = useState<Sessions>({})

  const getMovieSessions = useCallback(
    (movieId: string): BookingSession[] => {
      const movieSessions = sessions[movieId]
      return movieSessions ? Object.values(movieSessions) : []
    },
    [sessions],
  )

  const getSeatSession = useCallback(
    (movieId: string, seatId: string): BookingSession | null => {
      return sessions[movieId]?.[seatId] ?? null
    },
    [sessions],
  )

  const addSession = useCallback((movieId: string, session: BookingSession) => {
    setSessions((prev) => {
      const nextMovieSessions = { ...(prev[movieId] || {}) }
      nextMovieSessions[session.seat_id] = session
      return {
        ...prev,
        [movieId]: nextMovieSessions,
      }
    })
  }, [])

  const removeSession = useCallback((movieId: string, seatId: string) => {
    setSessions((prev) => {
      const nextMovieSessions = { ...(prev[movieId] || {}) }
      delete nextMovieSessions[seatId]

      const next = { ...prev }
      if (Object.keys(nextMovieSessions).length === 0) {
        delete next[movieId]
      } else {
        next[movieId] = nextMovieSessions
      }
      return next
    })
  }, [])

  const clearMovieSessions = useCallback((movieId: string) => {
    setSessions((prev) => {
      const next = { ...prev }
      delete next[movieId]
      return next
    })
  }, [])

  const getEarliestExpiry = useCallback(
    (movieId: string): string | null => {
      const movieSessions = sessions[movieId]
      if (!movieSessions) return null
      const list = Object.values(movieSessions)
      if (list.length === 0) return null

      let earliest: string | null = null
      for (const session of list) {
        if (!earliest || new Date(session.expires_at) < new Date(earliest)) {
          earliest = session.expires_at
        }
      }
      return earliest
    },
    [sessions],
  )

  return React.createElement(
    BookingSessionContext.Provider,
    {
      value: {
        sessions,
        getMovieSessions,
        getSeatSession,
        addSession,
        removeSession,
        clearMovieSessions,
        getEarliestExpiry,
      },
    },
    children,
  )
}

export function useBookingSessions() {
  const context = useContext(BookingSessionContext)
  if (!context) {
    throw new Error(
      'useBookingSessions must be used within a BookingSessionProvider',
    )
  }
  return context
}
