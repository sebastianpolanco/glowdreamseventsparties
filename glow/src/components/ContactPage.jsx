function ContactPage({ service, contactInfo = {}, onNavigateHomeSection, onNavigateServices, onNavigateAbout, onChangeExperience }) {
  const year = new Date().getFullYear()
  const { phone = '', email = '', instagram = '', instagramUrl = '' } = contactInfo

  return (
    <main className="contact-page">
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
            <button type="button" className="nav__link" onClick={onNavigateAbout}>
              About Us
            </button>
            <button type="button" className="nav__link nav__link--active">
              Contact
            </button>
            <button type="button" className="swap" onClick={onChangeExperience}>
              Change experience
            </button>
          </nav>
        </div>
        <h1>Contact Us</h1>
        <p>
          If you'd like more information, don't hesitate to reach out to our sales team
          — we'll be happy to help.
        </p>
      </header>

      <section className="contact-page__content">
        <div className="contact-page__info">
          <article className="contact-info-card">
            <h2>Phone</h2>
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="contact-info-card__value">{phone}</a>
            <span>Available Monday through Friday.</span>
          </article>
          <article className="contact-info-card">
            <h2>Email</h2>
            <a href={`mailto:${email}`} className="contact-info-card__value">{email}</a>
            <span>We respond within 24 hours.</span>
          </article>
          <article className="contact-info-card">
            <h2>Instagram</h2>
            <a
              href={instagramUrl || `https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="contact-info-card__value"
            >
              {instagram}
            </a>
            <span>Send us a DM with your date.</span>
          </article>
        </div>

        <form className="contact-page__form">
          <h3 className="contact-page__form-title">Request a Quote</h3>

          <label>
            Full Name
            <input type="text" placeholder="Your full name" />
          </label>
          <label>
            Phone Number
            <input type="tel" placeholder="(000) 000-0000" />
          </label>
          <label>
            Email Address
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Tentative Date
            <input type="date" />
          </label>
          <label>
            Package
            <select defaultValue="">
              <option value="" disabled>Select a package</option>
              {service?.packages.map((pack) => (
                <option key={pack.name} value={pack.name}>{pack.name}</option>
              ))}
            </select>
          </label>
          <label>
            Number of Children
            <input type="number" placeholder="0" min="0" max="100" />
          </label>

          <button type="button" className="primary">Send Request</button>
        </form>
      </section>

      <footer className="home-footer">
        <img className="home-footer__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="home-footer__phrase">Every celebration deserves a glow.</p>
        <span className="home-footer__copy">Copyright {year} Glow Dreams</span>
      </footer>
    </main>
  )
}

export default ContactPage
