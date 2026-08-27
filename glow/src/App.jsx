import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { collection, deleteDoc, doc, onSnapshot, setDoc, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from './firebase'
import { approxDocBytes, FIRESTORE_DOC_LIMIT } from './imageCompression'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import Home from './components/Home'
import Selector from './components/Selector'
import ServicesPage from './components/ServicesPage'
import FloatingContact from './components/FloatingContact'
import Login from './components/login'
import AdminDashboard from './components/AdminDashboard'
import InstallPrompt from './components/InstallPrompt'
import useSeo from './useSeo'
import './App.css'

const SERVICES_DEFAULT = [
  {
    id: 'premium-experience',
    name: 'Premium Experience',
    subtitle: 'Pampering, beauty and magical memories',
    summary:
      'Lighting, sound, welcome set, and interactive stations for an unforgettable party.',
    packages: [
      {
        name: 'Dream Starter',
        detail: 'DJ set, mocktails, illuminated backdrop, and welcome glam.',
        image: '/hero.png',
        phrase: 'Arranca la noche con energia y estilo.',
        tagline: 'Pensado para fiestas con ritmo.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Star Night',
        detail: 'Live show, glow bar, themed lounge, and keepsake delivery.',
        image: '/hero.png',
        phrase: 'Una noche con show y glamour.',
        tagline: 'Cada detalle crea un momento inolvidable.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Eternal Glow',
        detail: 'Full production, LED dance floor, premium hosting, and a surprise moment.',
        image: '/hero.png',
        phrase: 'Produccion completa con impacto.',
        tagline: 'La experiencia mas premium del show.',
        price: '',
        additionalPrice: '',
      },
    ],
    additions: [
      { title: 'Coreografia sorpresa', price: '$180', image: '/hero.png', description: 'Una coreografia preparada para sorprender a la homenajeada.' },
      { title: 'Makeup station',       price: '$140', image: '/hero.png', description: 'Estacion de maquillaje y glam para las invitadas.' },
      { title: 'Neon dessert table',   price: '$110', image: '/hero.png', description: 'Mesa de postres con detalles neon e iluminacion.' },
    ],
  },
  {
    id: 'spa-premium',
    name: 'Spa Premium',
    subtitle: 'Beautiful celebrations for every special occasion',
    summary:
      'An elegant spa with soft aromas, satin robes, and a glow oasis to celebrate in style.',
    packages: [
      {
        name: 'Luna Glow',
        detail: 'Express manicure, glow mask, aroma stations, and instant photos.',
        image: '/hero.png',
        phrase: 'El ritual perfecto para comenzar el glow.',
        tagline: 'Ideal para celebraciones intimas y elegantes.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Crystal Spa',
        detail: 'Deluxe manicure, skincare bar, sparkling drinks, and a relaxing lounge.',
        image: '/hero.png',
        phrase: 'Un spa completo con brillo y confort.',
        tagline: 'Para quien busca una experiencia deluxe.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Royal Retreat',
        detail: 'Full spa, hair styling, premium ambience, and gift bags.',
        image: '/hero.png',
        phrase: 'El retiro mas completo y sofisticado.',
        tagline: 'Para eventos que quieren el wow total.',
        price: '',
        additionalPrice: '',
      },
    ],
    additions: [
      { title: 'Perfume bar personalizado', price: '$120', image: '/hero.png', description: 'Cada invitada crea su propia fragancia para llevar.' },
      { title: 'Photobooth floral',         price: '$150', image: '/hero.png', description: 'Rincon floral con props para fotos inolvidables.' },
      { title: 'Velas y cards de afirmacion', price: '$90', image: '/hero.png', description: 'Velas aromaticas y tarjetas de afirmacion como recuerdo.' },
    ],
  },
  {
    id: 'kids-wedding-lounger',
    name: 'The Kids Wedding Lounger',
    subtitle: 'A magical space for little wedding guests',
    summary:
      'A kids lounge with a playful ceremony, dresses, mini banquet, and lots of glamour.',
    packages: [
      {
        name: 'Mini Vows',
        detail: 'Symbolic ceremony, lounge set, cupcakes, and a photo game.',
        image: '/hero.png',
        phrase: 'La primera version del gran dia.',
        tagline: 'Dulce, tierno y super divertido.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Sweet Ceremony',
        detail: 'Master of ceremonies, glam decor, and a mini dance floor.',
        image: '/hero.png',
        phrase: 'Una boda mini con mucho estilo.',
        tagline: 'Para las pequenas reinas del show.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Ever After',
        detail: 'Full show, mini banquet, gifts, and premium ambience.',
        image: '/hero.png',
        phrase: 'La version mas completa del magic.',
        tagline: 'Ideal para un gran recuerdo infantil.',
        price: '',
        additionalPrice: '',
      },
    ],
    additions: [
      { title: 'Outfits y accesorios fantasy', price: '$130', image: '/hero.png', description: 'Vestuario y accesorios de fantasia para la sesion.' },
      { title: 'Candy cart y algodon',          price: '$95',  image: '/hero.png', description: 'Carrito de dulces y algodon de azucar para los invitados.' },
      { title: 'Video highlight corto',          price: '$160', image: '/hero.png', description: 'Video corto con los mejores momentos del evento.' },
    ],
  },
]

// Full-screen image behind the experience selector. Owner replaces it from the
// admin panel; the saved value is a compressed Base64 string stored in Firestore.
const SELECTOR_BACKGROUND_DEFAULT = ''

const HERO_BACKGROUNDS_DEFAULT = {
  'premium-experience':   ['/heroexpe.png'],
  'spa-premium':          ['/herospa.png'],
  'kids-wedding-lounger': ['/herokigd.png'],
}

const DEFAULT_ABOUT_CARDS = [
  {
    title: 'Who we are',
    text: 'We are a creative team that designs glow experiences with personalized details for every event.',
    image: '/hero.png',
  },
  {
    title: 'Mission',
    text: 'To create memorable celebrations with careful, attentive production full of magic.',
    image: '/hero.png',
  },
  {
    title: 'Vision',
    text: 'To become the go-to boutique brand for social events in our city.',
    image: '/hero.png',
  },
]

const DEFAULT_GALLERY = ['/hero.png', '/hero.png', '/hero.png', '/hero.png']

const DEFAULT_REVIEWS = {
  items: [
    {
      name: 'Maria Gonzalez',
      role: 'Sweet 16 party',
      rating: 5,
      text: 'Glow Dreams made my daughter\'s party absolutely magical. Every detail was perfect!',
      image: '',
    },
    {
      name: 'Carla Ramirez',
      role: 'Spa Premium',
      rating: 5,
      text: 'The spa experience was so relaxing and elegant. The girls loved every minute of it.',
      image: '',
    },
  ],
  // Google Business links — owner pastes these from the admin panel.
  googleUrl: 'https://share.google/4LC7DXgVjoY2ZaVJO',
  writeUrl: '',
}

// Accepts the old array shape too, so existing Firestore data keeps working.
const normalizeReviews = (d) =>
  Array.isArray(d)
    ? { items: d, googleUrl: '', writeUrl: '' }
    : { items: [], googleUrl: '', writeUrl: '', ...d }

const DEFAULT_CONTACT_INFO = {
  phone: '910-899-6458',
  email: 'glowdreamsevents@gmail.com',
  instagram: '@glowdreamsevents',
  instagramUrl: 'https://instagram.com/glowdreamsevents',
  tiktok: '@glow.dreams.event',
  tiktokUrl: 'https://www.tiktok.com/@glow.dreams.event',
  location: 'Area DMV',
  locationDetail: 'Washington DC · Maryland · Virginia',
  locationUrl: '',
}

const siteDoc = (field) => doc(db, 'site', field)

// Hero images used to live together in a single site/hero document. Three
// experiences' worth of Base64 slides pushed it to ~958 KB of Firestore's
// 1,048,487-byte ceiling, so every new upload was rejected. Each experience now
// owns its own document and gets the full budget to itself.
const HERO_DOC_PREFIX = 'hero-'
const heroDocId = (serviceId) => `${HERO_DOC_PREFIX}${serviceId}`

// SEO-friendly URL slug for each experience id. New/renamed experiences fall
// back to their raw id as the slug, so links keep working even if the owner
// edits the services in the admin panel.
const SERVICE_SLUGS = {
  'premium-experience': 'signature-celebrations',
  'spa-premium': 'premium-spa-parties',
  'kids-wedding-lounger': 'wedding-kids-corner',
}

// Per-experience title + description, tuned around the target keywords and the
// Virginia / DMV location.
const SERVICE_SEO = {
  'spa-premium': {
    title: 'Premium Spa Parties in Virginia & DMV | Glow Dreams',
    description:
      'Premium Spa Parties for kids and teens in Virginia and the DMV Area — spa setup, robes, facials, karaoke and gift bags. Book your glow spa celebration.',
  },
  'premium-experience': {
    title: 'Signature Celebrations in Virginia & DMV | Glow Dreams',
    description:
      'Signature Celebrations with lighting, DJ, glow bar and full production in Virginia and the DMV Area. Unforgettable premium party experiences.',
  },
  'kids-wedding-lounger': {
    title: 'Wedding Kids Corner in Virginia & DMV | Glow Dreams',
    description:
      'Wedding Kids Corner — a magical lounge for little wedding guests in Virginia and the DMV Area. Mini ceremony, dress-up, treats and glamour.',
  },
}

const slugForId = (id) => SERVICE_SLUGS[id] || id
const idForSlug = (slug) =>
  Object.keys(SERVICE_SLUGS).find((id) => SERVICE_SLUGS[id] === slug) || slug

const seoForService = (service) =>
  SERVICE_SEO[service.id] || {
    title: `${service.name} | Glow Dreams Parties & Events`,
    description: service.summary,
  }

// Resolve the :serviceSlug URL param to a service object. The defaults already
// contain the three experiences, so deep links resolve before Firestore answers.
function useActiveService(services) {
  const { serviceSlug } = useParams()
  const id = idForSlug(serviceSlug)
  return services.find((s) => s.id === id) || null
}

// ─── Route wrappers ────────────────────────────────────────────────────────
// The page components already take navigation callbacks; each wrapper just
// supplies router-powered versions and sets the page's SEO metadata.

function SelectorRoute({ services, selectorBackground, dataLoaded }) {
  const navigate = useNavigate()
  useSeo({
    title: 'Glow Dreams Parties & Events | Premium Spa Parties · Virginia & DMV',
    description:
      'Premium Spa Parties, Signature Celebrations and Wedding Kids Corner. Themed glow parties and events in Virginia and the DMV Area — Washington DC, Maryland & Virginia.',
    path: '/',
  })
  return (
    <Selector
      services={services}
      onSelect={(id) => navigate(`/${slugForId(id)}`)}
      loaded={dataLoaded}
      background={selectorBackground}
    />
  )
}

function HomeRoute({ services, heroBackgrounds, reviews, contactInfo }) {
  const navigate = useNavigate()
  const service = useActiveService(services)
  const seo = service ? seoForService(service) : {}
  useSeo({
    title: seo.title,
    description: seo.description,
    path: service ? `/${slugForId(service.id)}` : undefined,
  })
  if (!service) return <Navigate to="/" replace />
  const slug = slugForId(service.id)
  return (
    <>
      <main className="experience">
        <Home
          title={service.name}
          summary={service.summary}
          packages={service.packages}
          heroBackground={heroBackgrounds[service.id]}
          reviews={reviews}
          contactInfo={contactInfo}
          onNavigateServices={() => navigate(`/${slug}/services`)}
          onNavigateAbout={() => navigate(`/${slug}/about`)}
          onNavigateContact={() => navigate(`/${slug}/contact`)}
          onChangeExperience={() => navigate('/')}
        />
      </main>
      <FloatingContact contactInfo={contactInfo} />
    </>
  )
}

function ServicesRoute({ services, contactInfo }) {
  const navigate = useNavigate()
  const service = useActiveService(services)
  useSeo({
    title: service ? `${service.name} Packages | Glow Dreams Parties & Events` : undefined,
    description: service ? service.summary : undefined,
    path: service ? `/${slugForId(service.id)}/services` : undefined,
  })
  if (!service) return <Navigate to="/" replace />
  const slug = slugForId(service.id)
  return (
    <>
      <ServicesPage
        service={service}
        onNavigateHomeSection={() => navigate(`/${slug}`)}
        onNavigateServices={() => navigate(`/${slug}/services`)}
        onNavigateAbout={() => navigate(`/${slug}/about`)}
        onNavigateContact={() => navigate(`/${slug}/contact`)}
        onSelectPackage={(pkg) => navigate(`/${slug}/contact`, { state: { pkg } })}
        onChangeExperience={() => navigate('/')}
      />
      <FloatingContact contactInfo={contactInfo} />
    </>
  )
}

function AboutRoute({ services, aboutCards, galleryImages, contactInfo }) {
  const navigate = useNavigate()
  const service = useActiveService(services)
  useSeo({
    title: 'About Us | Glow Dreams Parties & Events',
    description:
      'Meet the team behind Glow Dreams Parties and Events — creating themed glow celebrations in Virginia and the DMV Area.',
    path: service ? `/${slugForId(service.id)}/about` : undefined,
  })
  if (!service) return <Navigate to="/" replace />
  const slug = slugForId(service.id)
  return (
    <>
      <AboutPage
        cards={aboutCards}
        gallery={galleryImages}
        onNavigateHomeSection={() => navigate(`/${slug}`)}
        onNavigateServices={() => navigate(`/${slug}/services`)}
        onNavigateContact={() => navigate(`/${slug}/contact`)}
        onChangeExperience={() => navigate('/')}
      />
      <FloatingContact contactInfo={contactInfo} />
    </>
  )
}

function ContactRoute({ services, contactInfo }) {
  const navigate = useNavigate()
  const location = useLocation()
  const service = useActiveService(services)
  useSeo({
    title: 'Contact | Glow Dreams Parties & Events',
    description:
      'Contact Glow Dreams Parties and Events to book your celebration in Virginia and the DMV Area — Washington DC, Maryland & Virginia.',
    path: service ? `/${slugForId(service.id)}/contact` : undefined,
  })
  if (!service) return <Navigate to="/" replace />
  const slug = slugForId(service.id)
  return (
    <>
      <ContactPage
        service={service}
        contactInfo={contactInfo}
        selectedPackage={location.state?.pkg || ''}
        onNavigateHomeSection={() => navigate(`/${slug}`)}
        onNavigateServices={() => navigate(`/${slug}/services`)}
        onNavigateAbout={() => navigate(`/${slug}/about`)}
        onChangeExperience={() => navigate('/')}
      />
      <FloatingContact contactInfo={contactInfo} />
    </>
  )
}

function AdminRoute({ isAdminLoggedIn, dashboardProps }) {
  const navigate = useNavigate()
  useSeo({
    title: 'Admin | Glow Dreams',
    description: 'Glow Dreams admin panel.',
    path: '/admin',
    noindex: true,
  })
  if (!isAdminLoggedIn) {
    return (
      <>
        <Login onLogin={() => navigate('/admin')} onBack={() => navigate('/')} />
        <InstallPrompt />
      </>
    )
  }
  return (
    <>
      <AdminDashboard
        {...dashboardProps}
        onLogout={async () => {
          await signOut(auth)
          navigate('/')
        }}
      />
      <InstallPrompt />
    </>
  )
}

// Scroll to the top of the page on every route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const [selectorBackground, setSelectorBackground] = useState(SELECTOR_BACKGROUND_DEFAULT)
  const [heroBackgrounds, setHeroBackgrounds] = useState(HERO_BACKGROUNDS_DEFAULT)
  const [services, setServices] = useState(SERVICES_DEFAULT)
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY)
  const [aboutCards, setAboutCards] = useState(DEFAULT_ABOUT_CARDS)
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO)

  // False until Firestore answers for the first time, so we don't flash the
  // default (placeholder) content before the real data arrives.
  const [dataLoaded, setDataLoaded] = useState(false)

  const location = useLocation()

  // Firebase persists the session (localStorage), so on reload onAuthStateChanged
  // restores the logged-in user and /admin lands on the dashboard.
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setIsAdminLoggedIn(!!user))
  }, [])

  // Real-time listener — each section lives in its own doc to stay under Firestore's 1 MB limit
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'site'),
      (snapshot) => {
        // Hero is assembled from two layouts at once: the legacy site/hero map
        // and the per-experience site/hero-<id> docs, which win. Collect both
        // before setting state so the result never depends on snapshot order.
        let legacyHero = null
        const perServiceHero = {}

        snapshot.forEach((snap) => {
          const d = snap.data()?.data
          if (!d) return
          if (snap.id.startsWith(HERO_DOC_PREFIX)) {
            perServiceHero[snap.id.slice(HERO_DOC_PREFIX.length)] = d
            return
          }
          switch (snap.id) {
            case 'selector': setSelectorBackground(d); break
            case 'hero':     legacyHero = d;          break
            case 'services': setServices(d);        break
            case 'gallery':  setGalleryImages(d);   break
            case 'about':    setAboutCards(d);       break
            case 'reviews':  setReviews(normalizeReviews(d)); break
            case 'contact':  setContactInfo(d);      break
          }
        })

        if (legacyHero || Object.keys(perServiceHero).length) {
          setHeroBackgrounds({ ...legacyHero, ...perServiceHero })
        }
        setDataLoaded(true)
      },
      (err) => {
        console.error('Firestore listener error:', err)
        // Fall back to defaults rather than leaving the page blank forever.
        setDataLoaded(true)
      }
    )
    return () => unsubscribe()
  }, [])

  // The full-screen selector background locks scrolling; keep that on the
  // landing and admin routes (matches the previous behaviour), release it on
  // the scrollable experience pages.
  useEffect(() => {
    const lockScroll = location.pathname === '/' || location.pathname === '/admin'
    document.body.classList.toggle('selector-active', lockScroll)
  }, [location.pathname])

  // Each section is saved to its own Firestore document: site/services,
  // site/gallery, etc. Base64 images make the 1 MB per-document ceiling
  // reachable, so check before writing and fail with a message that says what
  // actually went wrong instead of letting the generic error blame the rules.
  const guardSize = (label, data) => {
    const bytes = approxDocBytes(data)
    if (bytes <= FIRESTORE_DOC_LIMIT) return
    const err = new Error(
      `${label} is ${Math.round(bytes / 1024)} KB and Firestore stores at most ` +
      `${Math.round(FIRESTORE_DOC_LIMIT / 1024)} KB per section. Remove an image or run "Optimize images".`
    )
    err.code = 'doc-too-large'
    throw err
  }

  // State is updated only after Firestore accepts the write, so a rejected save
  // never leaves the live site showing an image that was not stored.
  const persist = (field, setter) => async (data) => {
    guardSize('This section', data)
    await setDoc(siteDoc(field), { data })
    setter(data)
  }

  const persistHero = async (data) => {
    Object.entries(data).forEach(([serviceId, images]) =>
      guardSize(services.find((s) => s.id === serviceId)?.name || serviceId, images)
    )

    const batch = writeBatch(db)
    Object.entries(data).forEach(([serviceId, images]) => {
      batch.set(siteDoc(heroDocId(serviceId)), { data: images })
    })
    await batch.commit()
    setHeroBackgrounds(data)

    // The legacy single-document layout has just been fully superseded by the
    // per-experience docs above. Dropping it stops every visitor downloading a
    // ~1 MB dead copy; a failure here is cosmetic, so it must not fail the save.
    deleteDoc(siteDoc('hero')).catch((err) =>
      console.warn('Could not remove the legacy site/hero document:', err)
    )
  }

  const dashboardProps = {
    selectorBackground,
    onSaveSelector: persist('selector', setSelectorBackground),
    heroBackgrounds,
    onSaveHero: persistHero,
    services,
    onSaveServices: persist('services', setServices),
    galleryImages,
    onSaveGallery: persist('gallery', setGalleryImages),
    aboutCards,
    onSaveAbout: persist('about', setAboutCards),
    reviews,
    onSaveReviews: persist('reviews', setReviews),
    contactInfo,
    onSaveContact: persist('contact', setContactInfo),
  }

  const isAdmin = location.pathname === '/admin'

  return (
    <div className={isAdmin ? undefined : 'page'}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <SelectorRoute
              services={services}
              selectorBackground={selectorBackground}
              dataLoaded={dataLoaded}
            />
          }
        />
        <Route
          path="/admin"
          element={<AdminRoute isAdminLoggedIn={isAdminLoggedIn} dashboardProps={dashboardProps} />}
        />
        <Route
          path="/:serviceSlug"
          element={
            <HomeRoute
              services={services}
              heroBackgrounds={heroBackgrounds}
              reviews={reviews}
              contactInfo={contactInfo}
            />
          }
        />
        <Route
          path="/:serviceSlug/services"
          element={<ServicesRoute services={services} contactInfo={contactInfo} />}
        />
        <Route
          path="/:serviceSlug/about"
          element={
            <AboutRoute
              services={services}
              aboutCards={aboutCards}
              galleryImages={galleryImages}
              contactInfo={contactInfo}
            />
          }
        />
        <Route
          path="/:serviceSlug/contact"
          element={<ContactRoute services={services} contactInfo={contactInfo} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
