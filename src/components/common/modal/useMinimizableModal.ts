import { useState, useCallback, useContext, createContext } from 'react'
import type { ModalContextValue } from './modal.types'

// ─── Modal Context ────────────────────────────────────────────────────────────

export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used inside <Modal>')
  return ctx
}

// ─── useMinimizableModal ──────────────────────────────────────────────────────
// Convenience hook — manages isOpen + isMinimized state together.

export function useMinimizableModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMinimized, setIsMinimized] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
    setIsMinimized(false)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setIsMinimized(false)
  }, [])

  const minimize = useCallback(() => setIsMinimized(true), [])
  const restore = useCallback(() => setIsMinimized(false), [])
  const toggle = useCallback(() => setIsMinimized((v) => !v), [])

  return {
    isOpen,
    isMinimized,
    open,
    close,
    minimize,
    restore,
    toggle,
    setIsOpen,
  }
}
