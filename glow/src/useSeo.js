import { useEffect } from 'react'

// Site origin used to build absolute canonical URLs. Kept here so every route
// points at the production domain regardless of where the app is served from.
const SITE_ORIGIN = 'https://glowdreamspartiesandevents.com'

// Client-side SEO: React renders the pages, so each route sets its own <title>,
// meta description and canonical link at runtime. Googlebot renders JS, so it
// picks these up per URL. Elements are created once and reused across routes.
export default function useSeo({ title, description, path, noindex = false }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) setMetaTag('description', description)

    const canonicalPath = path || window.location.pathname
    setCanonical(`${SITE_ORIGIN}${canonicalPath}`)
    setMetaProperty('og:url', `${SITE_ORIGIN}${canonicalPath}`)
    if (title) setMetaProperty('og:title', title)
    if (description) setMetaProperty('og:description', description)
    setRobots(noindex)
  }, [title, description, path, noindex])
}

function setMetaTag(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaProperty(property, content) {
  let el = document.head.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Rutas privadas (admin) que no deben llegar al indice. El <head> sobrevive a
// la navegacion client-side, asi que la etiqueta se retira al volver a una
// ruta publica; si no, el noindex se quedaria pegado en todo el sitio.
function setRobots(noindex) {
  let el = document.head.querySelector('meta[name="robots"]')
  if (!noindex) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'robots')
    document.head.appendChild(el)
  }
  el.setAttribute('content', 'noindex, nofollow')
}
