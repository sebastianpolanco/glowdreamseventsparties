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
    setSlideIndex(0)
  }, [heroBackground])

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
        <div className="hero__slides">
          {images.map((src, i) => (
            <div
              key={src + i}
              className={`hero__slide${i === slideIndex ? ' hero__slide--active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        <div className="hero__overlay"></div>
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
      </section>

      <section id="services" className="home-section home-section--packages">
        <div className="home-section__header">
          <h2>Services at a glance</h2>
          <p>
            A quick look at the packages included in this experience. Tap any
            package to plan the glow level you want.
          </p>
        </div>

        <article className="spa-includes">
          <h3 className="spa-includes__title">All Spa Party Packages Include:</h3>
          <ul className="spa-includes__list">
            <li>Complete Spa Party setup.</li>
            <li>Spa Party Hosts.</li>
            <li>Special robe for the Birthday Girl and robe for her guests.</li>
            <li>Karaoke machine for extra fun.</li>
            <li>Gift Bags.</li>
            <li>Headbands for facial treatments.</li>
          </ul>
        </article>

        <div className="packages-summary">
          {previewPackages.map((pack) => (
            <article key={pack.name} className="package-summary-card">
              <span className="package-summary-card__tag">Package</span>
              <h3>{pack.name}</h3>
              {pack.phrase && <p className="package-summary-card__phrase">{pack.phrase}</p>}
              <p>{pack.detail}</p>
              {pack.includes && pack.includes.length > 0 && (
                <ul className="package-summary-card__includes">
                  {pack.includes.map((item) => (
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
          <h2>Guest reviews</h2>
          <p>What our guests say about their celebrations.</p>
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
              See all reviews
            </a>
          )}
          {(reviews?.writeUrl || reviews?.googleUrl) && (
            <a
              className="ghost"
              href={reviews.writeUrl || reviews.googleUrl}
              target="_blank"
              rel="noreferrer"
            >
              Write a review
            </a>
          )}
        </div>
      </section>

      <section id="contact" className="home-section home-section--contact">
        <div className="home-section__header">
          <h2>Contact cards</h2>
          <p>Choose the channel that feels the most effortless.</p>
        </div>
        <div className="contact-cards">
          {contactInfo.phone && (
            <a className="contact-card" href={`sms:${contactInfo.phone.replace(/[^\d+]/g, '')}`}>
              <h3>iMessage</h3>
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
              <h3>Instagram</h3>
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
              <h3>Email</h3>
              <p>Share your vision and we will craft a proposal.</p>
              <span>{contactInfo.email}</span>
            </a>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Every celebration deserves a glow.</p>
        <span className="home-footer__copy">Copyright {year} Glow Dreams</span>
      </footer>
    </>
  )
}

export default Home
