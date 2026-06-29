import { useEffect, useState } from 'react'

const DISMISS_KEY = 'glow-install-dismissed'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

const isIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
  !window.MSStream

// Floating "Install app" button. On Chrome/Android/desktop it triggers the
// native install prompt; on iOS Safari (which has no prompt API) it shows the
// manual "Add to Home Screen" instructions.
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIosHelp, setShowIosHelp] = useState(false)
  // iOS never fires beforeinstallprompt, so surface the button there from the
  // start (unless already installed or dismissed this session).
  const [visible, setVisible] = useState(
    () => isIos() && !isStandalone() && !sessionStorage.getItem(DISMISS_KEY)
  )

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    const onInstalled = () => setVisible(false)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!visible) return null

  const handleInstall = async () => {
    if (isIos()) {
      setShowIosHelp(true)
      return
    }
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === 'accepted') setVisible(false)
  }

  const dismiss = () => {
    setVisible(false)
    setShowIosHelp(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  return (
    <div className="pwa-install">
      {showIosHelp ? (
        <div className="pwa-install__card">
          <p className="pwa-install__title">Instalar Glow Dreams</p>
          <p className="pwa-install__text">
            Toca <strong>Compartir</strong> &#x2191; y luego{' '}
            <strong>«Agregar a inicio»</strong> para instalar la app.
          </p>
          <button type="button" className="pwa-install__close" onClick={dismiss}>
            Entendido
          </button>
        </div>
      ) : (
        <button type="button" className="pwa-install__btn" onClick={handleInstall}>
          <span className="pwa-install__icon" aria-hidden="true">&#x2913;</span>
          Instalar app
          <span
            className="pwa-install__x"
            role="button"
            aria-label="Cerrar"
            onClick={(e) => {
              e.stopPropagation()
              dismiss()
            }}
          >
            &times;
          </span>
        </button>
      )}
    </div>
  )
}

export default InstallPrompt
