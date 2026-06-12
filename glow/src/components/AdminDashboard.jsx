import { useState } from 'react'
import AdminHero from './AdminHero'
import AdminServices from './AdminServices'
import AdminGallery from './AdminGallery'
import AdminAbout from './AdminAbout'
import AdminContact from './AdminContact'
import AdminReviews from './AdminReviews'

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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
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
              onClick={() => setActive(s.id)}
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
  )
}

export default AdminDashboard
