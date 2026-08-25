function Selector({ services, onSelect, loaded = true, background = '' }) {
  return (
    <main className="selector selector--split">
      {background && (
        <img
          className="selector__background"
          src={background}
          alt=""
          aria-hidden="true"
        />
      )}
      <div className="selector__backdrop" aria-hidden="true" />
      <header className="selector__overlay">
        <img className="selector__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="lead">
          <span className="lead__highlight">
            Choose the perfect experience for your celebration.
          </span>
          <span className="lead__line">
            Every package is thoughtfully designed to create magical moments
          </span>
          <span className="lead__line">and unforgettable memories.</span>
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
                <h2>{service.name}</h2>
                <p>{service.subtitle}</p>
                <button
                  type="button"
                  className="service-panel__cta"
                  onClick={() => onSelect(service.id)}
                >
                  EXPLORE
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
