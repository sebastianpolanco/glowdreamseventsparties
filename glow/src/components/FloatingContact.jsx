function FloatingContact({ contactInfo = {} }) {
  const { phone = '', instagram = '', instagramUrl = '', tiktok = '', tiktokUrl = '' } = contactInfo

  const imessageHref = phone ? `sms:${phone.replace(/[^\d+]/g, '')}` : ''
  const instagramHref = instagram
    ? instagramUrl || `https://instagram.com/${instagram.replace(/^@/, '')}`
    : ''
  const tiktokHref = tiktok
    ? tiktokUrl || `https://www.tiktok.com/@${tiktok.replace(/^@/, '')}`
    : ''

  if (!imessageHref && !instagramHref && !tiktokHref) {
    return null
  }

  return (
    <div className="floating-contact">
      {imessageHref && (
        <a
          className="floating-contact__btn floating-contact__btn--imessage"
          href={imessageHref}
          aria-label="Message us on iMessage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 5.94 2 10.8c0 2.77 1.46 5.23 3.74 6.84-.13 1.2-.6 2.5-1.46 3.6-.16.2-.02.5.24.46 1.9-.27 3.42-1.02 4.5-1.76.78.17 1.6.26 2.44.26 5.523 0 10-3.94 10-8.8S17.523 2 12 2z" />
          </svg>
        </a>
      )}
      {instagramHref && (
        <a
          className="floating-contact__btn floating-contact__btn--instagram"
          href={instagramHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Follow us on Instagram"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
          </svg>
        </a>
      )}
      {tiktokHref && (
        <a
          className="floating-contact__btn floating-contact__btn--tiktok"
          href={tiktokHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Follow us on TikTok"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6v2.6c-1.2.1-2.4-.2-3.5-.8v5.7c0 3.2-2.3 5.6-5.4 5.6-2.9 0-5.1-2.1-5.1-4.9 0-2.9 2.3-5 5.3-4.7v2.7c-.4-.1-.8-.2-1.2-.1-1.2.1-2 .9-1.9 2.1.1 1.1 1 1.9 2.1 1.8 1.2-.1 1.9-1 1.9-2.3V3h2.7z" />
          </svg>
        </a>
      )}
    </div>
  )
}

export default FloatingContact
