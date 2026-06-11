import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from './firebase'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import Home from './components/Home'
import Selector from './components/Selector'
import ServicesPage from './components/ServicesPage'
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
      type: 'image',
      src: '/exppremium.JPG',
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
      { title: 'Coreografia sorpresa', price: '$180', image: '/hero.png' },
      { title: 'Makeup station',       price: '$140', image: '/hero.png' },
      { title: 'Neon dessert table',   price: '$110', image: '/hero.png' },
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
      { title: 'Perfume bar personalizado', price: '$120', image: '/hero.png' },
      { title: 'Photobooth floral',         price: '$150', image: '/hero.png' },
      { title: 'Velas y cards de afirmacion', price: '$90', image: '/hero.png' },
    ],
  },
  {
    id: 'kids-wedding-lounger',
    name: 'The Kids Wedding Lounger',
    subtitle: 'Mini weddings, maximum magic',
    summary:
      'A kids lounge with a playful ceremony, dresses, mini banquet, and lots of glamour.',
    backgroundMedia: {
      type: 'image',
      src: '/kids.JPEG',
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
      { title: 'Outfits y accesorios fantasy', price: '$130', image: '/hero.png' },
      { title: 'Candy cart y algodon',          price: '$95',  image: '/hero.png' },
      { title: 'Video highlight corto',          price: '$160', image: '/hero.png' },
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

const DEFAULT_CONTACT_INFO = {
  phone: '910-899-6458',
  email: 'glowdreamsevents@gmail.com',
  instagram: '@glowdreamsevents',
  instagramUrl: 'https://instagram.com/glowdreamsevents',
}

const siteDoc = (field) => doc(db, 'site', field)

const isAdminPath = () => window.location.pathname.startsWith('/admin')

function App() {
  const [activeServiceId, setActiveServiceId] = useState(null)

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
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO)

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
            case 'contact':  setContactInfo(d);      break
          }
        })
      },
      (err) => console.error('Firestore listener error:', err)
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
        contactInfo={contactInfo}
        onSaveContact={persist('contact', setContactInfo)}
        onLogout={handleAdminLogout}
      />
    )
  }

  return (
    <div className="page">
      {!activeService && (
        <Selector services={services} onSelect={setActiveServiceId} />
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
                onNavigateServices={navigateToServices}
                onNavigateAbout={navigateToAbout}
                onNavigateContact={navigateToContact}
                onChangeExperience={handleChangeExperience}
                onNavigateAdmin={() => {
                  window.history.pushState(null, '', '/admin')
                  setPage('admin-login')
                }}
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
              onNavigateHomeSection={navigateToHomeSection}
              onNavigateServices={navigateToServices}
              onNavigateAbout={navigateToAbout}
              onChangeExperience={handleChangeExperience}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
