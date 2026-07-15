import { useState } from 'react'
import useScrolled from '../useScrolled'

function AboutPage({ cards = [], gallery = [], onNavigateHomeSection, onNavigateServices, onNavigateContact, onChangeExperience }) {
  const year = new Date().getFullYear()
  const scrolled = useScrolled()
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)

  return (
    <main className="about-page">
      <header className="page-hero">
        <div className={`page-hero__top${scrolled ? ' page-hero__top--scrolled' : ''}`}>
          <a
            className="page-brand"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              onNavigateHomeSection('home')
            }}
          >
            <img src="/logo.png" alt="Glow Dreams" />
            <span>Glow Dreams Parties & Events</span>
          </a>
          <button type="button" className="nav__toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu">
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--1 open' : 'nav__toggle-bar nav__toggle-bar--1'} />
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--2 open' : 'nav__toggle-bar nav__toggle-bar--2'} />
            <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--3 open' : 'nav__toggle-bar nav__toggle-bar--3'} />
          </button>
          {navOpen && <div className="nav__backdrop" onClick={closeNav} />}
          <nav className={navOpen ? 'nav nav--open' : 'nav'}>
            <button
              type="button"
              className="nav__link"
              onClick={() => { onNavigateHomeSection('home'); closeNav() }}
            >
              Home
            </button>
            <button type="button" className="nav__link" onClick={() => { onNavigateServices(); closeNav() }}>
              Services
            </button>
            <button type="button" className="nav__link nav__link--active" onClick={closeNav}>
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
        <h1>About Us</h1>
        <p>Meet the team behind Glow Dreams and what inspires us.</p>
      </header>

      <section className="about-page__cards">
        {cards.map((card) => (
          <article key={card.title} className="about-card">
            <img className="about-card__image" src={card.image} alt={card.title} />
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="about-page__gallery">
        <h2>Gallery</h2>
        <div className="about-gallery-track">
          <div className="about-gallery-reel">
            {[...gallery, ...gallery].map((src, index) => (
              <img key={index} src={src} alt="Glow moments" />
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Where every celebration becomes a beautiful memory.</p>
        <span className="home-footer__copy">{year} Glow Dreams Parties and Events</span>
      </footer>
    </main>
  )
}

export default AboutPage
