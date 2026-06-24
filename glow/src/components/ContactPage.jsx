import { useState } from 'react'
import useScrolled from '../useScrolled'

function ContactPage({ service, contactInfo = {}, selectedPackage = '', onNavigateHomeSection, onNavigateServices, onNavigateAbout, onChangeExperience }) {
  const year = new Date().getFullYear()
  const {
    phone = '', email = '', instagram = '', instagramUrl = '',
    tiktok = '', tiktokUrl = '', location = '', locationDetail = '', locationUrl = '',
  } = contactInfo

  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', children: '', message: '' })
  const [pkg, setPkg] = useState(selectedPackage)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)

  // Local YYYY-MM-DD strings — date inputs compare lexicographically in this format.
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-CA')
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA')

  const validate = (values, pkgValue) => {
    const e = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const name = values.name.trim()
    if (!name) e.name = 'Please enter your full name.'
    else if (name.length > 50) e.name = 'Name must be 50 characters or less.'

    const phoneDigits = values.phone.replace(/\D/g, '')
    if (!values.phone.trim()) e.phone = 'Please enter your phone number.'
    else if (values.phone.length > 50) e.phone = 'Phone must be 50 characters or less.'
    else if (phoneDigits.length !== 10) e.phone = 'Phone number must have exactly 10 digits.'

    const mail = values.email.trim()
    if (!mail) e.email = 'Please enter your email address.'
    else if (mail.length > 50) e.email = 'Email must be 50 characters or less.'
    else if (!emailRegex.test(mail)) e.email = 'Please enter a valid email (e.g. you@example.com).'

    if (!values.date) e.date = 'Please choose a tentative date.'
    else if (values.date <= todayStr) e.date = 'The tentative date must be after today.'

    if (!pkgValue) e.pkg = 'Please select a package.'

    if (values.children === '') e.children = 'Please enter the number of children.'
    else if (!/^\d+$/.test(values.children)) e.children = 'Enter a valid number.'
    else if (Number(values.children) < 1) e.children = 'There must be at least 1 child.'
    else if (Number(values.children) > 100) e.children = 'Maximum 100 children.'

    if (values.message.length > 500) e.message = 'Message must be 500 characters or less.'

    return e
  }

  // After the first submit attempt, re-validate live so messages clear as fields are fixed.
  const setField = (field) => (e) => {
    const next = { ...form, [field]: e.target.value }
    setForm(next)
    setSubmitted(false)
    if (attempted) setErrors(validate(next, pkg))
  }

  const handlePkgChange = (value) => {
    setPkg(value)
    setSubmitted(false)
    if (attempted) setErrors(validate(form, value))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAttempted(true)
    const found = validate(form, pkg)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setSubmitted(false)
      return
    }

    const subject = `Quote request - ${pkg}${service?.name ? ` (${service.name})` : ''}`
    const body = [
      'New quote request from the website:',
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim()}`,
      `Tentative date: ${form.date}`,
      `Package: ${pkg}`,
      `Number of children: ${form.children}`,
      '',
      `Message: ${form.message.trim() || '(none)'}`,
    ].join('\n')

    const gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(email)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`

    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  const tiktokHref = tiktokUrl || (tiktok ? `https://www.tiktok.com/@${tiktok.replace('@', '')}` : '')
  const mapsHref =
    locationUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location, locationDetail].filter(Boolean).join(' '))}`
  const emailComposeUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent('Consulta - Glow Dreams')}` +
    `&body=${encodeURIComponent('Hola Glow Dreams,\n\nTengo algunas dudas:\n\n')}`

  const scrolled = useScrolled()

  return (
    <main className="contact-page">
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
            <button type="button" className="nav__link" onClick={() => { onNavigateAbout(); closeNav() }}>
              About Us
            </button>
            <button type="button" className="nav__link nav__link--active" onClick={closeNav}>
              Contact
            </button>
            <button type="button" className="swap" onClick={() => { onChangeExperience(); closeNav() }}>
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
          {phone && (
            <a className="contact-info-card" href={`tel:${phone.replace(/\D/g, '')}`}>
              <h2>Phone</h2>
              <span className="contact-info-card__value">{phone}</span>
              <span>Available Monday through Friday.</span>
            </a>
          )}
          {email && (
            <a className="contact-info-card" href={emailComposeUrl} target="_blank" rel="noreferrer">
              <h2>Email</h2>
              <span className="contact-info-card__value">{email}</span>
              <span>We respond within 24 hours.</span>
            </a>
          )}
          {instagram && (
            <a
              className="contact-info-card"
              href={instagramUrl || `https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <h2>Instagram</h2>
              <span className="contact-info-card__value">{instagram}</span>
              <span>Send us a DM with your date.</span>
            </a>
          )}
          {tiktok && (
            <a className="contact-info-card" href={tiktokHref} target="_blank" rel="noreferrer">
              <h2>TikTok</h2>
              <span className="contact-info-card__value">{tiktok}</span>
              <span>Follow our latest glow moments.</span>
            </a>
          )}
          {location && (
            <a className="contact-info-card" href={mapsHref} target="_blank" rel="noreferrer">
              <h2>Location</h2>
              <span className="contact-info-card__value">{location}</span>
              {locationDetail && <span>{locationDetail}</span>}
            </a>
          )}
        </div>

        <form className="contact-page__form" onSubmit={handleSubmit} noValidate>
          <h3 className="contact-page__form-title">Request a Quote</h3>

          <label>
            Full Name
            <input
              type="text"
              placeholder="Your full name"
              maxLength={50}
              value={form.name}
              onChange={setField('name')}
              className={errors.name ? 'input--error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              placeholder="(000) 000-0000"
              maxLength={50}
              value={form.phone}
              onChange={setField('phone')}
              className={errors.phone ? 'input--error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
          <label>
            Email Address
            <input
              type="email"
              placeholder="you@example.com"
              maxLength={50}
              value={form.email}
              onChange={setField('email')}
              className={errors.email ? 'input--error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Tentative Date
            <input
              type="date"
              min={tomorrowStr}
              value={form.date}
              onChange={setField('date')}
              className={errors.date ? 'input--error' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </label>
          <label>
            Package
            <select
              value={pkg}
              onChange={(e) => handlePkgChange(e.target.value)}
              className={errors.pkg ? 'input--error' : ''}
            >
              <option value="" disabled>Select a package</option>
              {service?.packages.map((pack) => (
                <option key={pack.name} value={pack.name}>{pack.name}</option>
              ))}
            </select>
            {errors.pkg && <span className="field-error">{errors.pkg}</span>}
          </label>
          <label>
            Number of Children
            <input
              type="number"
              placeholder="0"
              min="1"
              max="100"
              value={form.children}
              onChange={setField('children')}
              className={errors.children ? 'input--error' : ''}
            />
            {errors.children && <span className="field-error">{errors.children}</span>}
          </label>
          <label>
            <span>Message <span className="label-optional">(optional)</span></span>
            <textarea
              rows="4"
              placeholder="Tell us about your event or any questions you have…"
              maxLength={500}
              value={form.message}
              onChange={setField('message')}
              className={errors.message ? 'input--error' : ''}
            />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>

          {submitted && (
            <p className="form-success">Gmail opened with your request — just press Send to deliver it. Thank you!</p>
          )}

          <button type="submit" className="primary">Send Request</button>
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
