import { useEffect, useRef, useState } from 'react'

function Home({
  title,
  summary,
  packages = [],
  heroBackground,
  reviews = { items: [], googleUrl: '', writeUrl: '' },
  contactInfo = {},
  onNavigateServices,
  onNavigateAbout,
  onNavigateContact,
  onChangeExperience,
}) {
  const year = new Date().getFullYear()
  const previewPackages = packages

  // Las tarjetas de resumen alinean sus filas entre si con subgrid, asi que
  // todas deben tener el mismo numero de filas. La frase y la lista de
  // incluidos se reservan si al menos un paquete las trae; el hueco vacio en
  // los demas es lo que mantiene el boton y la lista a la misma altura.
  const showPhraseRow = previewPackages.some((pack) => pack.phrase)
  const showIncludesRow = previewPackages.some(
    (pack) => pack.includes && pack.includes.length > 0
  )
  const summaryRows = 3 + (showPhraseRow ? 1 : 0) + (showIncludesRow ? 1 : 0)

  const images = Array.isArray(heroBackground)
    ? heroBackground.filter(Boolean)
    : [heroBackground].filter(Boolean)

  const reviewItems = Array.isArray(reviews?.items) ? reviews.items : []
  const reviewTrackRef = useRef(null)
  // Scroll the track by roughly one card (card width + gap) in either direction.
  const scrollReviews = (dir) => {
    const track = reviewTrackRef.current
    if (!track) return
    const card = track.querySelector('.review-card')
    const amount = card ? card.offsetWidth + 16 : track.clientWidth
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const [slideIndex, setSlideIndex] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeNav = () => setNavOpen(false)

  // Restart the hero slideshow at the first image whenever the background set
  // changes (e.g. switching experience). Done during render by tracking the
  // previous value — this is React's recommended pattern and avoids the
  // cascading re-render that calling setState inside an effect triggers.
  const [prevBg, setPrevBg] = useState(heroBackground)
  if (heroBackground !== prevBg) {
    setPrevBg(heroBackground)
    setSlideIndex(0)
  }

  // Transparent nav at the top, frosted background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    const id = requestAnimationFrame(onScroll) // sync initial state (deferred)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <>
      <section id="home" className="hero hero--spotlight">
        <div className={`hero__nav${scrolled ? ' hero__nav--scrolled' : ''}`}>
          <a className="hero__brand" href="#home">
            <img className="hero__logo" src="/logo.png" alt="Glow Dreams" />
            <span className="hero__brand-title">Glow Dreams Parties & Events</span>
          </a>
          <button type="button" className="nav__toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu">
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--1 open' : 'nav__toggle-bar nav__toggle-bar--1'} />
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--2 open' : 'nav__toggle-bar nav__toggle-bar--2'} />
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--3 open' : 'nav__toggle-bar nav__toggle-bar--3'} />
          </button>
          {navOpen && <div className="nav__backdrop" onClick={closeNav} />}
          <nav className={navOpen ? 'nav nav--open' : 'nav'}>
            <a href="#home" onClick={closeNav}>Home</a>
            <button type="button" className="nav__link" onClick={() => { onNavigateServices(); closeNav() }}>
              Services
            </button>
            <button type="button" className="nav__link" onClick={() => { onNavigateAbout(); closeNav() }}>
              About Us
            </button>
            <button type="button" className="nav__link" onClick={() => { onNavigateContact(); closeNav() }}>
              Contact
            </button>
            <button type="button" className="swap" onClick={() => { onChangeExperience(); closeNav() }}>
              Change experience
            </button>
          </nav>
        </div>
        <div className="hero__inner">
          <div className="hero__content">
            <img
              className="hero__logo hero__logo--center"
              src="/logo.png"
              alt="Glow Dreams"
            />
            <h1 className="hero__title">{title}</h1>
            <p className="hero__caption">{summary}</p>
            <div className="hero__actions">
              <button type="button" className="primary" onClick={onNavigateServices}>
                Explore packages
              </button>
              <button type="button" className="ghost" onClick={onNavigateContact}>
                Contact us
              </button>
            </div>
          </div>

          <div className="hero__gallery">
            <div className="hero__slides">
              {images.map((src, i) => (
                <div
                  key={src + i}
                  className={`hero__slide${i === slideIndex ? ' hero__slide--active' : ''}`}
                  style={{ backgroundImage: `url('${src}')` }}
                />
              ))}
            </div>
            {images.length > 1 && (
              <div className="hero__dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`hero__dot${i === slideIndex ? ' hero__dot--active' : ''}`}
                    onClick={() => setSlideIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="services" className="home-section home-section--packages">
        <div className="home-section__header">
          <h2>What’s Included</h2>
          <p>Everything you need for an unforgettable spa celebration.</p>
        </div>

        <article className="spa-includes">
          <h3 className="spa-includes__title">Every Spa Party Includes:</h3>
          <ul className="spa-includes__list">
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 15v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V15" fill="currentColor" fillOpacity="0.14" />
                  <path d="M4 16 16 5l12 11" />
                  <path d="M16 25c-2.6-1.8-4.2-3.3-4.2-5.2A2.3 2.3 0 0 1 16 18.2 2.3 2.3 0 0 1 20.2 19.9c0 1.9-1.6 3.3-4.2 5.1z" fill="currentColor" fillOpacity="0.4" stroke="none" />
                </svg>
              </span>
              <span>Complete Spa Party setup.</span>
            </li>
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="11" r="3.4" fill="currentColor" fillOpacity="0.14" />
                  <path d="M6 26a6 6 0 0 1 12 0" fill="currentColor" fillOpacity="0.14" />
                  <circle cx="22" cy="12.5" r="2.8" />
                  <path d="M20 26a5 5 0 0 1 8-4" />
                  <path d="M26 5l.7 1.9 1.9.7-1.9.7L26 11l-.7-1.9L23.4 8.4l1.9-.7z" fill="currentColor" fillOpacity="0.55" stroke="none" />
                </svg>
              </span>
              <span>Spa Party Hosts.</span>
            </li>
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 8 7.5V26a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.5L21 5" fill="currentColor" fillOpacity="0.14" />
                  <path d="M11 5l5 5 5-5" />
                  <path d="M16 10v16" />
                  <path d="M8.5 18h5" />
                  <path d="M18.5 18h5" />
                </svg>
              </span>
              <span>Special robe for the Birthday Girl and robe for her guests.</span>
            </li>
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="12" y="4" width="8" height="15" rx="4" fill="currentColor" fillOpacity="0.14" />
                  <path d="M8 15a8 8 0 0 0 16 0" />
                  <path d="M16 23v5" />
                  <path d="M12 28h8" />
                  <path d="M25 5l.6 1.7 1.7.6-1.7.6L25 10.2l-.6-1.7L22.7 7.9l1.7-.6z" fill="currentColor" fillOpacity="0.55" stroke="none" />
                </svg>
              </span>
              <span>Karaoke machine for extra fun.</span>
            </li>
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 11h16l-1.3 14.6a1 1 0 0 1-1 .9H10.3a1 1 0 0 1-1-.9z" fill="currentColor" fillOpacity="0.14" />
                  <path d="M12 11V8.5a4 4 0 0 1 8 0V11" />
                  <path d="M16 21.5c-2-1.4-3.3-2.5-3.3-3.9A1.85 1.85 0 0 1 16 16.2 1.85 1.85 0 0 1 19.3 17.6c0 1.4-1.3 2.5-3.3 3.9z" fill="currentColor" fillOpacity="0.4" stroke="none" />
                </svg>
              </span>
              <span>Gift Bags.</span>
            </li>
            <li>
              <span className="spa-includes__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4.5c2.1 2.6 3.2 4.3 3.2 5.9a3.2 3.2 0 0 1-6.4 0C12.8 8.8 13.9 7.1 16 4.5Z" fill="currentColor" fillOpacity="0.34" />
                  <path d="M16 13V11" />
                  <rect x="8.5" y="13" width="15" height="14.5" rx="3" fill="currentColor" fillOpacity="0.14" />
                  <path d="M9 16.5h14" />
                  <path d="M24 6.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L21.5 8.5l1.5-.5z" fill="currentColor" fillOpacity="0.5" stroke="none" />
                </svg>
              </span>
              <span>Headbands for facial treatments.</span>
            </li>
          </ul>
        </article>

        <div
          className="packages-summary"
          style={{ '--summary-rows': summaryRows }}
        >
          {previewPackages.map((pack) => (
            <article key={pack.name} className="package-summary-card">
              <h3>{pack.name}</h3>
              {showPhraseRow && (
                <p className="package-summary-card__phrase">{pack.phrase}</p>
              )}
              <p>{pack.detail}</p>
              {showIncludesRow && (
                <ul className="package-summary-card__includes">
                  {(pack.includes || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <button type="button" className="ghost" onClick={onNavigateServices}>
                Details
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="review" className="home-section home-section--review">
        <div className="home-section__header">
          <h2>Loved By Families</h2>
          <p>See why so many families choose Glow Dreams to celebrate life’s most special moments.</p>
        </div>

        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat__value">5.0</span>
            <span className="home-stat__label">Average rating</span>
          </div>
          <div className="home-stat">
            <span className="home-stat__value">50+</span>
            <span className="home-stat__label">Happy families</span>
          </div>
          <div className="home-stat">
            <span className="home-stat__value">100+</span>
            <span className="home-stat__label">Events celebrated</span>
          </div>
        </div>

        {reviewItems.length ? (
          <div className="review-slider">
            {reviewItems.length > 3 && (
              <button
                type="button"
                className="review-carousel__arrow review-carousel__arrow--prev"
                onClick={() => scrollReviews(-1)}
                aria-label="Previous reviews"
              >
                ‹
              </button>
            )}

            <div className="review-track" ref={reviewTrackRef}>
              {reviewItems.map((review, i) => (
                <article className="review-card" key={i}>
                  <p className="review-card__quote">"{review.text}"</p>
                  <div className="review-card__author">
                    <div>
                      <h3>{review.name}</h3>
                      {review.role && <span>{review.role}</span>}
                    </div>
                    {review.rating != null && (
                      <span
                        className="review-card__rating"
                        aria-label={`${Number(review.rating).toFixed(1)} out of 5`}
                      >
                        <span
                          className="review-stars"
                          style={{ '--rating': Number(review.rating) }}
                          aria-hidden="true"
                        />
                        <span className="review-card__rating-num">
                          {Number(review.rating).toFixed(1)}
                        </span>
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {reviewItems.length > 3 && (
              <button
                type="button"
                className="review-carousel__arrow review-carousel__arrow--next"
                onClick={() => scrollReviews(1)}
                aria-label="Next reviews"
              >
                ›
              </button>
            )}
          </div>
        ) : (
          <p className="review-empty">No reviews yet — be the first to share yours!</p>
        )}

        <div className="review-actions">
          {reviews?.googleUrl && (
            <a className="primary" href={reviews.googleUrl} target="_blank" rel="noreferrer">
              Read More Reviews
            </a>
          )}
          {(reviews?.writeUrl || reviews?.googleUrl) && (
            <a
              className="ghost"
              href={reviews.writeUrl || reviews.googleUrl}
              target="_blank"
              rel="noreferrer"
            >
              Share Your Experience
            </a>
          )}
        </div>
      </section>

      <section id="contact" className="home-section home-section--contact">
        <div className="home-section__header">
          <h2>Let’s Connect</h2>
          <p>We are here to help you plan your perfect celebration.</p>
        </div>
        <div className="contact-cards">
          {contactInfo.phone && (
            <a className="contact-card" href={`sms:${contactInfo.phone.replace(/[^\d+]/g, '')}`}>
              <div className="contact-card__head">
                <span className="contact-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <h3>iMessage</h3>
              </div>
              <p>Text us your date and we will reply within the hour.</p>
              <span>{contactInfo.phone}</span>
            </a>
          )}
          {contactInfo.instagram && (
            <a
              className="contact-card"
              href={contactInfo.instagramUrl || `https://instagram.com/${contactInfo.instagram.replace(/^@/, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-card__head">
                <span className="contact-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </span>
                <h3>Instagram</h3>
              </div>
              <p>Send a DM and see the latest glow moments.</p>
              <span>{contactInfo.instagram}</span>
            </a>
          )}
          {contactInfo.email && (
            <a
              className="contact-card"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactInfo.email)}&su=${encodeURIComponent('Consulta - Glow Dreams')}&body=${encodeURIComponent('Hola Glow Dreams,\n\nTengo algunas dudas sobre sus servicios:\n\n')}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-card__head">
                <span className="contact-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </span>
                <h3>Email</h3>
              </div>
              <p>Share your vision and we will craft a proposal.</p>
              <span>{contactInfo.email}</span>
            </a>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Where every celebration becomes a beautiful memory.</p>
        <span className="home-footer__copy">{year} Glow Dreams Parties and Events</span>
      </footer>
    </>
  )
}

export default Home
