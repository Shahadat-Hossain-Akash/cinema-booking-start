import type { ReactNode, CSSProperties } from 'react'

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalPlacement = 'center' | 'top' | 'bottom'
export type ModalScrollBehavior = 'inside' | 'outside'

export interface ModalAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
}

export interface MinimizedTab {
  id: string
  title: string
  onRestore: () => void
  onClose: () => void
}

export interface ModalContextValue {
  onClose: () => void
  isMinimized: boolean
  onMinimize?: () => void
  onRestore?: () => void
}

export interface ModalProps {
  // ── Core ────────────────────────────────────────────────────────────────
  isOpen: boolean
  onClose: () => void

  // ── Content ─────────────────────────────────────────────────────────────
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode

  // ── Footer actions ───────────────────────────────────────────────────────
  actions?: ModalAction[]
  /** Completely replaces the footer */
  footer?: ReactNode
  /** Hide footer altogether */
  hideFooter?: boolean

  // ── Appearance ───────────────────────────────────────────────────────────
  size?: ModalSize
  placement?: ModalPlacement
  /** Show darkened backdrop (default: true) */
  backdrop?: boolean
  /** Close when clicking the backdrop (default: true) */
  closeOnBackdropClick?: boolean
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean
  className?: string
  style?: CSSProperties
  panelClassName?: string

  // ── Minimize ─────────────────────────────────────────────────────────────
  minimizable?: boolean
  isMinimized?: boolean
  onMinimize?: () => void
  onRestore?: () => void
  /** Label shown in the minimized tab (falls back to `title`) */
  minimizedLabel?: string

  // ── Header ───────────────────────────────────────────────────────────────
  showCloseButton?: boolean
  /** Replace entire header */
  header?: ReactNode
  hideHeader?: boolean

  // ── Transitions ──────────────────────────────────────────────────────────
  disableAnimation?: boolean

  // ── Accessibility ────────────────────────────────────────────────────────
  initialFocus?: React.MutableRefObject<HTMLElement | null>
  'aria-label'?: string
}

export interface MinimizedTabBarProps {
  tabs: MinimizedTab[]
}
