import { useState } from 'react'
import ImageUploader from './ImageUploader'

const EMPTY_PACKAGE = {
  name: 'New Package',
  phrase: '',
  detail: '',
  tagline: '',
  price: '',
  additionalPrice: '',
  image: '',
  includes: [],
}

function AdminServices({ data, onSave }) {
  const [services, setServices] = useState(data.map((s) => ({ ...s, packages: s.packages.map((p) => ({ ...p })) })))
  const [activeIdx, setActiveIdx] = useState(0)
  const [status, setStatus] = useState(null)

  const updateService = (field, value) =>
    setServices(services.map((s, i) => i !== activeIdx ? s : { ...s, [field]: value }))

  const updatePackage = (pIdx, field, value) =>
    setServices(services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      packages: s.packages.map((p, pi) => pi !== pIdx ? p : { ...p, [field]: value }),
    }))

  const addPackage = () =>
    setServices(services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      packages: [...s.packages, { ...EMPTY_PACKAGE }],
    }))

  const removePackage = (pIdx) =>
    setServices(services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      packages: s.packages.filter((_, pi) => pi !== pIdx),
    }))

  const movePackage = (pIdx, dir) => {
    const newIdx = pIdx + dir
    setServices(services.map((s, i) => {
      if (i !== activeIdx) return s
      const pkgs = [...s.packages]
      const tmp = pkgs[pIdx]
      pkgs[pIdx] = pkgs[newIdx]
      pkgs[newIdx] = tmp
      return { ...s, packages: pkgs }
    }))
  }

  const handleSave = async () => {
    setStatus('saving')
    try {
      await onSave(services)
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 3000)
  }

  const service = services[activeIdx]

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Services</h2>
        <p className="admin-section__sub">Edit the name, summary, and packages for each experience.</p>
      </div>

      <div className="admin-tabs">
        {services.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`admin-tab${activeIdx === i ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="admin-card admin-card--wide">
        <h3 className="admin-card__title">General Info</h3>
        <label className="admin-label">
          Name
          <input type="text" value={service.name} onChange={(e) => updateService('name', e.target.value)} className="admin-input" />
        </label>
        <label className="admin-label">
          Summary
          <textarea rows="3" value={service.summary} onChange={(e) => updateService('summary', e.target.value)} className="admin-input" />
        </label>
      </div>

      <div className="admin-packages-header">
        <h3 className="admin-section__sub-title">Packages ({service.packages.length})</h3>
        <button type="button" className="admin-add-btn" onClick={addPackage}>+ Add Package</button>
      </div>

      <div className="admin-grid admin-grid--3">
        {service.packages.map((pack, pIdx) => (
          <div key={pIdx} className="admin-card admin-card--package">
            <div className="admin-card__pkg-header">
              <span className="admin-card__pkg-num">#{pIdx + 1}</span>
              <div className="admin-card__pkg-actions">
                <button
                  type="button"
                  className="admin-move-btn"
                  onClick={() => movePackage(pIdx, -1)}
                  disabled={pIdx === 0}
                  title="Move left"
                >←</button>
                <button
                  type="button"
                  className="admin-move-btn"
                  onClick={() => movePackage(pIdx, 1)}
                  disabled={pIdx === service.packages.length - 1}
                  title="Move right"
                >→</button>
                <button
                  type="button"
                  className="admin-remove-btn"
                  onClick={() => removePackage(pIdx)}
                  title="Delete package"
                >✕ Remove</button>
              </div>
            </div>

            <label className="admin-label">
              Name
              <input type="text" value={pack.name} onChange={(e) => updatePackage(pIdx, 'name', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Phrase (subtitle)
              <input type="text" value={pack.phrase || ''} onChange={(e) => updatePackage(pIdx, 'phrase', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Detail (description)
              <textarea rows="3" value={pack.detail} onChange={(e) => updatePackage(pIdx, 'detail', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Tagline (bottom text)
              <input type="text" value={pack.tagline || ''} onChange={(e) => updatePackage(pIdx, 'tagline', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Package Price
              <input type="text" value={pack.price || ''} onChange={(e) => updatePackage(pIdx, 'price', e.target.value)} className="admin-input" placeholder="e.g. $1,600" />
            </label>
            <label className="admin-label">
              Additional Guest Price
              <input type="text" value={pack.additionalPrice || ''} onChange={(e) => updatePackage(pIdx, 'additionalPrice', e.target.value)} className="admin-input" placeholder="e.g. $100" />
            </label>
            <label className="admin-label">Image</label>
            <ImageUploader
              value={pack.image}
              onChange={(url) => updatePackage(pIdx, 'image', url)}
              folder="services"
            />
          </div>
        ))}
      </div>

      {service.packages.length === 0 && (
        <p className="admin-empty-msg">No packages yet. Click "+ Add Package" to create one.</p>
      )}

      <div className="admin-actions">
        <button type="button" className={`admin-save-btn${status === 'error' ? ' admin-save-btn--error' : ''}`} onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — check Firestore rules' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default AdminServices
