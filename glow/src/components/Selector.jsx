const SELECTOR_BACKGROUND_VIDEO = '/Spapremium.MOV'

function Selector({ services, onSelect, loaded = true }) {
  return (
    <main className="selector selector--split">
      <video
        className="selector__background"
        src={SELECTOR_BACKGROUND_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="selector__backdrop" aria-hidden="true" />
      <header className="selector__overlay">
        <img className="selector__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="lead">
          Select the atmosphere that matches your celebration. Each option is
          curated to feel magical, elegant, and unforgettable.
        </p>
      </header>
      <div
        className={`selector__grid selector__grid--split${
          loaded ? ' is-loaded' : ''
        }`}
      >
        {loaded && services.map((service, index) => (
          <div
            key={service.id}
            className={`service-panel service-panel--${index + 1}`}
          >
            <div className="service-panel__content">
              <div className="service-card">
                <div className="service-card__tag">Select</div>
                <h2>{service.name}</h2>
                <p>{service.subtitle}</p>
                <button
                  type="button"
                  className="service-panel__cta"
                  onClick={() => onSelect(service.id)}
                >
                  Select experience
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Selector
