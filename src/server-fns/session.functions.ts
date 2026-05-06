import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export const ensureSession = createServerFn({ method: 'GET' })
    .handler(async () => {
        let sessionId = getCookie('session_id')

        if (!sessionId) {
            sessionId = crypto.randomUUID()
            setCookie('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
            })
        }

        return sessionId
    })
