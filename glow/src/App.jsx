import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from './firebase'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import Home from './components/Home'
import Selector from './components/Selector'
import ServicesPage from './components/ServicesPage'
import FloatingContact from './components/FloatingContact'
import Login from './components/login'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

const SERVICES_DEFAULT = [
  {
    id: 'premium-experience',
    name: 'Premium Experience',
    subtitle: 'A night of show and glow',
    summary:
      'Lighting, sound, welcome set, and interactive stations for an unforgettable party.',
    backgroundMedia: {
      type: 'video',
      src: '/Spapremium.MOV',
    },
    packages: [
      {
        name: 'Dream Starter',
        detail: 'DJ set, mocktails, illuminated backdrop, and welcome glam.',
        image: '/hero.png',
        includes: ['DJ set con playlist curada', 'Mocktails y welcome glam', 'Backdrop iluminado para fotos'],
        phrase: 'Arranca la noche con energia y estilo.',
        tagline: 'Pensado para fiestas con ritmo.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Star Night',
        detail: 'Live show, glow bar, themed lounge, and keepsake delivery.',
        image: '/hero.png',
        includes: ['Live show y momento en escenario', 'Glow bar con accesorios custom', 'Lounge tematico con recuerdos'],
        phrase: 'Una noche con show y glamour.',
        tagline: 'Cada detalle crea un momento inolvidable.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Eternal Glow',
        detail: 'Full production, LED dance floor, premium hosting, and a surprise moment.',
        image: '/hero.png',
        includes: ['LED dance floor y lighting design', 'Host premium y coordinacion total', 'Momento sorpresa para la homenajeada'],
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
    subtitle: 'Glow rituals for queens',
    summary:
      'An elegant spa with soft aromas, satin robes, and a glow oasis to celebrate in style.',
    backgroundMedia: {
      type: 'video',
      src: '/Spapremium.MOV',
    },
    packages: [
      {
        name: 'Luna Glow',
        detail: 'Express manicure, glow mask, aroma stations, and instant photos.',
        image: '/hero.png',
        includes: ['Mini facial y glow mask', 'Aroma lounge con playlist suave', 'Esquina de fotos instantaneas'],
        phrase: 'El ritual perfecto para comenzar el glow.',
        tagline: 'Ideal para celebraciones intimas y elegantes.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Crystal Spa',
        detail: 'Deluxe manicure, skincare bar, sparkling drinks, and a relaxing lounge.',
        image: '/hero.png',
        includes: ['Skincare bar con productos premium', 'Sparkling drinks y postres', 'Lounge relajante con seating cozy'],
        phrase: 'Un spa completo con brillo y confort.',
        tagline: 'Para quien busca una experiencia deluxe.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Royal Retreat',
        detail: 'Full spa, hair styling, premium ambience, and gift bags.',
        image: '/hero.png',
        includes: ['Hair styling y finishing touch', 'Ambiente premium con iluminacion', 'Gift bags para cada invitado'],
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
    subtitle: 'Mini weddings, maximum magic',
    summary:
      'A kids lounge with a playful ceremony, dresses, mini banquet, and lots of glamour.',
    backgroundMedia: {
      type: 'video',
      src: '/Spapremium.MOV',
    },
    packages: [
      {
        name: 'Mini Vows',
        detail: 'Symbolic ceremony, lounge set, cupcakes, and a photo game.',
        image: '/hero.png',
        includes: ['Ceremonia simbolica con mini vows', 'Lounge setup y cupcakes', 'Juego de fotos con props'],
        phrase: 'La primera version del gran dia.',
        tagline: 'Dulce, tierno y super divertido.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Sweet Ceremony',
        detail: 'Master of ceremonies, glam decor, and a mini dance floor.',
        image: '/hero.png',
        includes: ['Master de ceremonias y script', 'Glam decor y mini dance floor', 'Sweet table con treats'],
        phrase: 'Una boda mini con mucho estilo.',
        tagline: 'Para las pequenas reinas del show.',
        price: '',
        additionalPrice: '',
      },
      {
        name: 'Ever After',
        detail: 'Full show, mini banquet, gifts, and premium ambience.',
        image: '/hero.png',
        includes: ['Mini banquet y show moment', 'Ambiente premium y styling', 'Gifts para cada invitada'],
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

const isAdminPath = () => window.location.pathname.startsWith('/admin')

function App() {
  const [activeServiceId, setActiveServiceId] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState('')

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const [page, setPage] = useState(() => (isAdminPath() ? 'admin-login' : 'home'))

  // Firebase persists the session (localStorage), so on reload onAuthStateChanged
  // restores the logged-in user and we land on the dashboard for /admin paths.
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const loggedIn = !!user
      setIsAdminLoggedIn(loggedIn)
      if (isAdminPath()) {
        setPage(loggedIn ? 'admin' : 'admin-login')
      }
    })
  }, [])

  const [heroBackgrounds, setHeroBackgrounds] = useState(HERO_BACKGROUNDS_DEFAULT)
  const [services, setServices] = useState(SERVICES_DEFAULT)
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY)
  const [aboutCards, setAboutCards] = useState(DEFAULT_ABOUT_CARDS)
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO)

  // False until Firestore answers for the first time, so we don't flash the
  // default (placeholder) text before the real content arrives.
  const [dataLoaded, setDataLoaded] = useState(false)

  // Real-time listener — each section lives in its own doc to stay under Firestore's 1 MB limit
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'site'),
      (snapshot) => {
        snapshot.forEach((snap) => {
          const d = snap.data()?.data
          if (!d) return
          switch (snap.id) {
            case 'hero':     setHeroBackgrounds(d); break
            case 'services': setServices(d);        break
            case 'gallery':  setGalleryImages(d);   break
            case 'about':    setAboutCards(d);       break
            case 'reviews':  setReviews(normalizeReviews(d)); break
            case 'contact':  setContactInfo(d);      break
          }
        })
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

  const activeService = useMemo(
    () => services.find((s) => s.id === activeServiceId),
    [activeServiceId, services]
  )

  useEffect(() => {
    const onPopState = () => {
      if (isAdminPath()) {
        setPage(isAdminLoggedIn ? 'admin' : 'admin-login')
      } else {
        setPage('home')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isAdminLoggedIn])

  useEffect(() => {
    if (activeServiceId) {
      document.body.classList.remove('selector-active')
      return
    }
    document.body.classList.add('selector-active')
    return () => document.body.classList.remove('selector-active')
  }, [activeServiceId])

  // When switching between pages, start the new page from the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  // Each section is saved to its own Firestore document: site/hero, site/services, etc.
  // This keeps each doc well under the 1 MB limit even with Base64 images.
  const persist = (field, setter) => async (data) => {
    setter(data)
    await setDoc(siteDoc(field), { data })
  }

  const handleAdminLogin = () => {
    // Auth already succeeded inside Login; onAuthStateChanged updates isAdminLoggedIn.
    window.history.pushState(null, '', '/admin')
    setPage('admin')
  }

  const handleAdminLogout = async () => {
    await signOut(auth)
    window.history.pushState(null, '', '/')
    setPage('home')
  }

  const navigateToHomeSection = (sectionId) => {
    setPage('home')
    window.setTimeout(() => { window.location.hash = sectionId ? `#${sectionId}` : '#home' }, 0)
  }
  const navigateToServices = () => { setPage('services'); window.history.pushState(null, '', '#services') }
  const navigateToAbout    = () => { setPage('about');    window.history.pushState(null, '', '#about') }
  const navigateToContact  = () => { setPage('contact');  window.history.pushState(null, '', '#contact') }
  const handleSelectPackage = (packageName) => {
    setSelectedPackage(packageName)
    setPage('contact')
    window.history.pushState(null, '', '#contact')
  }
  const handleChangeExperience = () => {
    setPage('home')
    setActiveServiceId(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  if (page === 'admin-login') {
    return (
      <Login
        onLogin={handleAdminLogin}
        onBack={() => setPage('home')}
      />
    )
  }

  if (page === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        heroBackgrounds={heroBackgrounds}
        onSaveHero={persist('hero', setHeroBackgrounds)}
        services={services}
        onSaveServices={persist('services', setServices)}
        galleryImages={galleryImages}
        onSaveGallery={persist('gallery', setGalleryImages)}
        aboutCards={aboutCards}
        onSaveAbout={persist('about', setAboutCards)}
        reviews={reviews}
        onSaveReviews={persist('reviews', setReviews)}
        contactInfo={contactInfo}
        onSaveContact={persist('contact', setContactInfo)}
        onLogout={handleAdminLogout}
      />
    )
  }

  return (
    <div className="page">
      {!activeService && (
        <Selector services={services} onSelect={setActiveServiceId} loaded={dataLoaded} />
      )}

      {activeService && (
        <>
          {page === 'home' && (
            <main className="experience">
              <Home
                title={activeService.name}
                summary={activeService.summary}
                packages={activeService.packages}
                heroBackground={heroBackgrounds[activeService.id]}
                reviews={reviews}
                contactInfo={contactInfo}
                onNavigateServices={navigateToServices}
                onNavigateAbout={navigateToAbout}
                onNavigateContact={navigateToContact}
                onChangeExperience={handleChangeExperience}
              />
            </main>
          )}
          {page === 'services' && (
            <ServicesPage
              service={activeService}
              onNavigateHomeSection={navigateToHomeSection}
              onNavigateServices={navigateToServices}
              onNavigateAbout={navigateToAbout}
              onNavigateContact={navigateToContact}
              onSelectPackage={handleSelectPackage}
              onChangeExperience={handleChangeExperience}
            />
          )}
          {page === 'about' && (
            <AboutPage
              cards={aboutCards}
              gallery={galleryImages}
              onNavigateHomeSection={navigateToHomeSection}
              onNavigateServices={navigateToServices}
              onNavigateContact={navigateToContact}
              onChangeExperience={handleChangeExperience}
            />
          )}
          {page === 'contact' && (
            <ContactPage
              service={activeService}
              contactInfo={contactInfo}
              selectedPackage={selectedPackage}
              onNavigateHomeSection={navigateToHomeSection}
              onNavigateServices={navigateToServices}
              onNavigateAbout={navigateToAbout}
              onChangeExperience={handleChangeExperience}
            />
          )}
          <FloatingContact contactInfo={contactInfo} />
        </>
      )}
    </div>
  )
}

export default App
