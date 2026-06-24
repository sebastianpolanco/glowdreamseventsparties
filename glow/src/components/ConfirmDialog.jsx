import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ConfirmContext = createContext(null)

// Provides a confirm(message, options) -> Promise<boolean> backed by an on-brand modal.
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({
        message,
        title: options.title || 'Are you sure?',
        confirmLabel: options.confirmLabel || 'Remove',
        cancelLabel: options.cancelLabel || 'Cancel',
        resolve,
      })
    })
  }, [])

  const settle = useCallback((result) => {
    setState((s) => {
      s?.resolve(result)
      return null
    })
  }, [])

  useEffect(() => {
    if (!state) return
    const onKey = (e) => {
      if (e.key === 'Escape') settle(false)
      if (e.key === 'Enter') settle(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, settle])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="confirm-overlay" onClick={() => settle(false)}>
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="confirm-dialog__title">{state.title}</h3>
            <p className="confirm-dialog__message">{state.message}</p>
            <div className="confirm-dialog__actions">
              <button type="button" className="confirm-dialog__cancel" onClick={() => settle(false)}>
                {state.cancelLabel}
              </button>
              <button type="button" className="confirm-dialog__confirm" onClick={() => settle(true)} autoFocus>
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider')
  return ctx
}
