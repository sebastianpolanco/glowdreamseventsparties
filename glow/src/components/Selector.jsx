function Selector({ services, onSelect }) {
  const handlePanelEnter = (event) => {
    const video = event.currentTarget.querySelector('video')

    if (!video) {
      return
    }

    video.play().catch(() => {})
  }

  const handlePanelLeave = (event) => {
    const video = event.currentTarget.querySelector('video')

    if (!video) {
      return
    }

    video.pause()
    video.currentTime = 0
  }

  return (
    <main className="selector selector--split">
      <header className="selector__overlay">
        <img className="selector__logo" src="/logo.png" alt="Glow Dreams" />
        <p className="lead">
          Select the atmosphere that matches your celebration. Each option is
          curated to feel magical, elegant, and unforgettable.
        </p>
      </header>
      <div className="selector__grid selector__grid--split">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`service-panel service-panel--${index + 1}`}
            onPointerEnter={handlePanelEnter}
            onPointerLeave={handlePanelLeave}
          >
            {service.backgroundMedia?.type === 'video' ? (
              <video
                className="service-panel__media"
                src={service.backgroundMedia.src}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            ) : (
              <img
                className="service-panel__media"
                src={service.backgroundMedia?.src}
                alt=""
                aria-hidden="true"
              />
            )}
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
