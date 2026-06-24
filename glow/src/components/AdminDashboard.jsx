import { useState } from 'react'
import AdminHero from './AdminHero'
import AdminServices from './AdminServices'
import AdminGallery from './AdminGallery'
import AdminAbout from './AdminAbout'
import AdminContact from './AdminContact'
import AdminReviews from './AdminReviews'
import { ConfirmProvider } from './ConfirmDialog'

const SECTIONS = [
  { id: 'hero',     label: 'Hero Images' },
  { id: 'services', label: 'Services' },
  { id: 'gallery',  label: 'Gallery' },
  { id: 'about',    label: 'About Us' },
  { id: 'reviews',  label: 'Reviews' },
  { id: 'contact',  label: 'Contact Info' },
]

function AdminDashboard({
  heroBackgrounds, onSaveHero,
  services, onSaveServices,
  galleryImages, onSaveGallery,
  aboutCards, onSaveAbout,
  reviews, onSaveReviews,
  contactInfo, onSaveContact,
  onLogout,
}) {
  const [active, setActive] = useState('hero')
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)

  return (
    <ConfirmProvider>
    <div className="admin-layout">
      {/* Barra superior — visible solo en móvil */}
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-topbar__toggle"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
        >
          <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--1 open' : 'nav__toggle-bar nav__toggle-bar--1'} />
          <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--2 open' : 'nav__toggle-bar nav__toggle-bar--2'} />
          <span className={navOpen ? 'nav__toggle-bar nav__toggle-bar--3 open' : 'nav__toggle-bar nav__toggle-bar--3'} />
        </button>
        <div className="admin-topbar__brand">
          <img src="/logo.png" alt="Glow Dreams" />
          <span>Admin Panel</span>
        </div>
        <button type="button" className="admin-logout admin-topbar__logout" onClick={onLogout}>
          Sign Out
        </button>
      </header>

      {navOpen && <div className="admin-backdrop" onClick={closeNav} />}

      <aside className={`admin-sidebar${navOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <img src="/logo.png" alt="Glow Dreams" />
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`admin-nav__item${active === s.id ? ' admin-nav__item--active' : ''}`}
              onClick={() => { setActive(s.id); closeNav() }}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={onLogout}>
          Sign Out
        </button>
      </aside>

      <main className="admin-main">
        {active === 'hero'     && <AdminHero     data={heroBackgrounds} onSave={onSaveHero} />}
        {active === 'services' && <AdminServices data={services}        onSave={onSaveServices} />}
        {active === 'gallery'  && <AdminGallery  data={galleryImages}   onSave={onSaveGallery} />}
        {active === 'about'    && <AdminAbout    data={aboutCards}      onSave={onSaveAbout} />}
        {active === 'reviews'  && <AdminReviews  data={reviews}         onSave={onSaveReviews} />}
        {active === 'contact'  && <AdminContact  data={contactInfo}     onSave={onSaveContact} />}
      </main>
    </div>
    </ConfirmProvider>
  )
}

export default AdminDashboard
