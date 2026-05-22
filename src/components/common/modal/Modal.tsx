import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import type {
  MinimizedTabBarProps,
  ModalAction,
  ModalContextValue,
  ModalPlacement,
  ModalProps,
  ModalSize,
} from './modal.types'
import { ModalContext } from './useMinimizableModal'

const SIZE_CLASSES: Record<ModalSize, string> = {
  xs: 'max-w-xs w-full',
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
  xl: 'max-w-2xl w-full',
  full: 'max-w-[calc(100vw-2rem)] w-full h-[calc(100vh-2rem)]',
}

const PLACEMENT_CLASSES: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
  bottom: 'items-end pb-16',
}

// ─── Action button variants ───────────────────────────────────────────────────

const ACTION_VARIANTS: Record<NonNullable<ModalAction['variant']>, string> = {
  primary:
    'bg-stone-900 text-white hover:bg-stone-700 active:bg-stone-800 disabled:opacity-50',
  secondary:
    'bg-white text-stone-800  hover:bg-stone-50 active:bg-stone-100 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 disabled:opacity-50',
  ghost:
    'text-stone-600 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-50',
}

function IconX({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconMinus({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

function IconMaximize({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}

export function MinimizedTabBar({ tabs }: MinimizedTabBarProps) {
  if (!tabs.length) return null
  return (
    <div className="fixed bottom-0 right-0 z-50 flex gap-2 p-2 pointer-events-none">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="pointer-events-auto flex items-center gap-1 bg-white border border-slate-200 rounded-t-lg shadow-lg px-3 py-2 text-sm font-medium text-slate-700 max-w-[200px]"
        >
          <button
            onClick={tab.onRestore}
            className="flex items-center gap-2 flex-1 min-w-0 hover:text-slate-900"
            title="Restore"
          >
            <IconMaximize className="w-3 h-3 shrink-0 text-slate-400" />
            <span className="truncate">{tab.title}</span>
          </button>
          <button
            onClick={tab.onClose}
            className="ml-1 text-slate-400 hover:text-slate-700 shrink-0"
            title="Close"
          >
            <IconX className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  footer,
  hideFooter = false,
  size = 'md',
  placement = 'center',
  backdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  style,
  panelClassName = '',
  minimizable = false,
  isMinimized = false,
  onMinimize,
  onRestore,
  minimizedLabel,
  showCloseButton = true,
  header,
  hideHeader = false,
  disableAnimation = false,
  initialFocus,
  'aria-label': ariaLabel,
}: ModalProps) {
  const showDialog = isOpen && !isMinimized

  const isEscapeDown = useRef(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') isEscapeDown.current = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') isEscapeDown.current = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      /* cleanup */
    }
  }, [])

  const handleDialogClose = useCallback(() => {
    if (isEscapeDown.current) {
      if (!closeOnEscape) return // ← Escape key path
    } else {
      if (!closeOnBackdropClick) return // ← backdrop click path
    }
    // onClose()
    minimizable && onMinimize && onMinimize()
  }, [closeOnBackdropClick, closeOnEscape, onClose, minimizable])

  const contextValue: ModalContextValue = {
    onClose,
    isMinimized,
    onMinimize,
    onRestore,
  }

  const resolvedLabel =
    typeof minimizedLabel === 'string'
      ? minimizedLabel
      : typeof title === 'string'
        ? title
        : 'Modal'

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ModalContext.Provider value={contextValue}>
      <Transition show={showDialog} as={Fragment}>
        <Dialog
          onClose={handleDialogClose}
          initialFocus={initialFocus}
          aria-label={ariaLabel}
          className={`relative z-50 ${className}`}
          style={style}
        >
          {/* ── Backdrop ── */}
          {backdrop && (
            <TransitionChild
              as={Fragment}
              enter={disableAnimation ? '' : 'transition-opacity duration-200'}
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave={disableAnimation ? '' : 'transition-opacity duration-150'}
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 bg-black/5 backdrop-blur-[2px]"
                aria-hidden="true"
                onClick={handleDialogClose}
              />
            </TransitionChild>
          )}

          {/* ── Panel wrapper ── */}
          <div
            className={`fixed inset-0 flex w-screen justify-center p-4 ${PLACEMENT_CLASSES[placement]}`}
          >
            <TransitionChild
              as={Fragment}
              enter={disableAnimation ? '' : 'transition duration-200 ease-out'}
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave={disableAnimation ? '' : 'transition duration-150 ease-in'}
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <DialogPanel
                className={[
                  SIZE_CLASSES[size],
                  'bg-white rounded ring-1 ring-black/5 flex flex-col overflow-hidden',
                  panelClassName,
                ].join(' ')}
              >
                {/* ── Header ── */}
                {!hideHeader && (
                  <>
                    {header ? (
                      <div className="shrink-0">{header}</div>
                    ) : (
                      <div className="flex items-start justify-between gap-4 p-4 pb-2 shrink-0">
                        <div className="min-w-0">
                          {title && (
                            <DialogTitle className="text-xl text-stone-900 leading-snug truncate">
                              {title}
                            </DialogTitle>
                          )}
                          {description && (
                            <Description className="mt-1 text-sm text-slate-500 leading-relaxed">
                              {description}
                            </Description>
                          )}
                        </div>

                        {/* Window control buttons */}
                        <div className="flex items-center gap-1 shrink-0 -mt-0.5">
                          {minimizable && onMinimize && (
                            <button
                              type="button"
                              onClick={onMinimize}
                              className="rounded-md p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                              title={`Minimize — ${resolvedLabel}`}
                              aria-label={`Minimize ${resolvedLabel}`}
                            >
                              <IconMinus />
                            </button>
                          )}
                          {showCloseButton && (
                            <button
                              type="button"
                              onClick={onClose}
                              className="rounded-md p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                              title="Close"
                              aria-label="Close modal"
                            >
                              <IconX />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-4 text-sm text-stone-600 leading-relaxed">
                  {children}
                </div>

                {/* ── Footer ── */}
                {!hideFooter && (
                  <>
                    {footer ? (
                      <div className="shrink-0">{footer}</div>
                    ) : actions && actions.length > 0 ? (
                      <div className="shrink-0 flex items-center justify-end gap-2 p-4 pt-2">
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            disabled={action.disabled || action.loading}
                            onClick={action.onClick}
                            className={[
                              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400',
                              ACTION_VARIANTS[action.variant ?? 'secondary'],
                            ].join(' ')}
                          >
                            {action.loading ? <Spinner /> : action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* ── Minimized tab (rendered outside the Dialog for correct stacking) ── */}
      {isOpen && isMinimized && onRestore && (
        <div className="fixed bottom-0 right-4 z-50">
          <div className="flex items-center gap-1 bg-white border border-slate-200 border-b-0 rounded-t shadow-lg px-3 py-2 text-sm font-medium text-[#666]">
            <button
              onClick={onRestore}
              className="flex items-center gap-2 flex-1 min-w-0 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
              title="Restore"
            >
              <IconMaximize className="w-3 h-3 shrink-0 text-[#666]" />
              <span className="truncate max-w-[160px]">{resolvedLabel}</span>
            </button>
            {/* <button
                            onClick={onClose}
                            className="ml-2 text-slate-400 hover:text-slate-700 shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            title="Close"
                        >
                            <IconX className="w-3 h-3" />
                        </button> */}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export default Modal
