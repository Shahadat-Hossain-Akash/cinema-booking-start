import axios from 'axios'

export const client = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

export const getOrCreateSessionId = (): string | null => {
    if (typeof window === 'undefined') return null

    const existing = sessionStorage.getItem('session_id')
    if (existing) return existing

    const fresh = crypto.randomUUID()
    sessionStorage.setItem('session_id', fresh)
    return fresh
}

client.interceptors.request.use((config) => {
    const sessionId = getOrCreateSessionId()
    if (sessionId) {
        config.headers['X-Session-ID'] = sessionId
    }
    return config
})

client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

const HTTPKit = {
    get: (url: string) => client.get(url),
    post: <T,>(url: string, data: T) => client.post(url, data),
    put: <T,>(url: string, data: T) => client.put(url, data),
    delete: (url: string) => client.delete(url),
}

export default HTTPKit