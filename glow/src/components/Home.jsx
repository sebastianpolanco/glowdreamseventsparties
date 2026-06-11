import { useEffect, useState } from 'react'

function Home({
  title,
  summary,
  packages = [],
  heroBackground,
  onNavigateServices,
  onNavigateAbout,
  onNavigateContact,
  onChangeExperience,
  onNavigateAdmin,
}) {
  const year = new Date().getFullYear()
  const previewPackages = packages

  const images = Array.isArray(heroBackground)
    ? heroBackground.filter(Boolean)
    : [heroBackground].filter(Boolean)

  const [slideIndex, setSlideIndex] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)

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
        <div className="hero__nav">
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
            <button type="button" className="primary">
              Book your date
            </button>
            <button type="button" className="ghost">
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
              <button type="button" className="ghost">
                Reserve this
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="review" className="home-section home-section--review">
        <div className="home-section__header">
          <h2>Guest review</h2>
          <p>One highlight from our latest celebration.</p>
        </div>
        <article className="review-card">
          <p className="review-card__quote">
            "The glow lounge felt like a dream. Every station was magical, and
            the team handled every detail with so much care."
          </p>
          <div className="review-card__author">
            <div>
              <h3>Isabella R.</h3>
              <span>Birthday celebration</span>
            </div>
            <span className="review-card__rating">5.0</span>
          </div>
        </article>
      </section>

      <section id="contact" className="home-section home-section--contact">
        <div className="home-section__header">
          <h2>Contact cards</h2>
          <p>Choose the channel that feels the most effortless.</p>
        </div>
        <div className="contact-cards">
          <a className="contact-card" href="sms:+15550199">
            <h3>iMessage</h3>
            <p>Text us your date and we will reply within the hour.</p>
            <span>+1 (555) 0199</span>
          </a>
          <a
            className="contact-card"
            href="https://instagram.com/glowdreams"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Instagram</h3>
            <p>Send a DM and see the latest glow moments.</p>
            <span>@glowdreams</span>
          </a>
          <a className="contact-card" href="mailto:hello@glowdreams.com">
            <h3>Email</h3>
            <p>Share your vision and we will craft a proposal.</p>
            <span>hello@glowdreams.com</span>
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Every celebration deserves a glow.</p>
        <span className="home-footer__copy">Copyright {year} Glow Dreams</span>
        <button type="button" className="home-footer__admin" onClick={onNavigateAdmin}>
          Admin
        </button>
      </footer>
    </>
  )
}

export default Home
