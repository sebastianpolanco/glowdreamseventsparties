function AboutPage({ cards = [], gallery = [], onNavigateHomeSection, onNavigateServices, onNavigateContact, onChangeExperience }) {
  const year = new Date().getFullYear()

  return (
    <main className="about-page">
      <header className="page-hero">
        <div className="page-hero__top">
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
          <nav className="nav">
            <button
              type="button"
              className="nav__link"
              onClick={() => onNavigateHomeSection('home')}
            >
              Home
            </button>
            <button type="button" className="nav__link" onClick={onNavigateServices}>
              Services
            </button>
            <button type="button" className="nav__link nav__link--active">
              About Us
            </button>
            <button type="button" className="nav__link" onClick={onNavigateContact}>
              Contact
            </button>
            <button type="button" className="swap" onClick={onChangeExperience}>
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
        <p className="home-footer__phrase">Every celebration deserves a glow.</p>
        <span className="home-footer__copy">Copyright {year} Glow Dreams</span>
      </footer>
    </main>
  )
}

export default AboutPage
