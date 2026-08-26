import { useState } from 'react'
import useScrolled from '../useScrolled'

function ServicesPage({
  service,
  onNavigateHomeSection,
  onNavigateServices,
  onNavigateAbout,
  onNavigateContact,
  onSelectPackage,
  onChangeExperience,
}) {
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)
  const scrolled = useScrolled()

  if (!service) {
    return null
  }

  const year = new Date().getFullYear()

  // Las tarjetas de paquetes alinean sus filas entre si con subgrid, asi que
  // todas deben tener el mismo numero de filas: la frase y el tagline se
  // reservan si al menos un paquete los trae. El hueco vacio en los demas es
  // lo que mantiene cada bloque a la misma altura aunque el titulo ocupe una
  // o dos lineas.
  const packs = service.packages || []
  const showPhraseRow = packs.some((pack) => pack.phrase)
  const showTaglineRow = packs.some((pack) => pack.tagline)
  const menuRows = 9 + (showPhraseRow ? 1 : 0) + (showTaglineRow ? 1 : 0)

  return (
    <main className="services-page">
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
            <button type="button" className="nav__link" onClick={() => { onNavigateHomeSection('home'); closeNav() }}>
              Home
            </button>
            <button type="button" className="nav__link nav__link--active" onClick={() => { onNavigateServices(); closeNav() }}>
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
        <h1>{service.name}</h1>
        <p>{service.summary}</p>
      </header>

      <section className="services-page__packages">
        <div className="section-title">
          <h2>Available packages</h2>
          <p>More detail to help you choose the ideal experience.</p>
        </div>
        <div
          className="services-page__grid"
          style={{ '--menu-rows': menuRows }}
        >
          {packs.map((pack) => (
            <article key={pack.name} className="menu-card">
              {pack.image
                ? <img className="menu-card__image" src={pack.image} alt={pack.name} />
                : <div className="menu-card__image-placeholder" />
              }
              <h3 className="menu-card__title">{pack.name}</h3>

              <hr className="menu-card__rule" />

              {showPhraseRow && (
                <p className="menu-card__phrase">{pack.phrase}</p>
              )}

              <hr className="menu-card__rule" />

              <div className="menu-card__body">
                <span className="menu-card__includes-label">Includes:</span>
                <p className="menu-card__detail">{pack.detail}</p>
              </div>

              <hr className="menu-card__rule" />

              <div className="menu-card__pricing">
                {pack.price && (
                  <p>Package price: <strong>{pack.price}</strong></p>
                )}
                {pack.additionalPrice && (
                  <p>Additional guest: <strong>{pack.additionalPrice}</strong></p>
                )}
              </div>

              {showTaglineRow && (
                <p className="menu-card__tagline">{pack.tagline}</p>
              )}

              <button
                type="button"
                className="menu-card__select primary"
                onClick={() => onSelectPackage?.(pack.name)}
              >
                Select
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="services-page__extras">
        <div className="services-page__additions">
          <div>
            <h2>Add-ons</h2>
            <p>Extras you can choose to personalize your event.</p>
          </div>
          <div className="services-additions-grid">
            {service.additions.map((item) => (
              <article key={item.title} className="services-card services-card--package">
                <img className="services-card__image" src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                {item.description && <p className="services-card__desc">{item.description}</p>}
                <p className="services-card__price">{item.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-page__reserve">
        <article className="services-card services-card--accent">
          <h3>Booking & payment</h3>
          <p>To book a spa party package:</p>
          <p>
            A $100.00 non-refundable reservation fee is required to secure your party date.
            The remaining balance is due at the end of the party.
          </p>
        </article>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Where every celebration becomes a beautiful memory.</p>
        <span className="home-footer__copy">{year} Glow Dreams Parties and Events</span>
      </footer>
    </main>
  )
}

export default ServicesPage
