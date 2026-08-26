import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useConfirm } from './ConfirmDialog'
import AdminToast from './AdminToast'

const EMPTY_PACKAGE = {
  name: 'New Package',
  phrase: '',
  detail: '',
  tagline: '',
  price: '',
  additionalPrice: '',
  image: '',
}

const EMPTY_ADDITION = { title: '', price: '', description: '', image: '' }

function AdminServices({ data, onSave }) {
  const [services, setServices] = useState(data.map((s) => ({
    ...s,
    packages: s.packages.map((p) => ({ ...p })),
    additions: (s.additions || []).map((a) => ({ ...a })),
  })))
  const [activeIdx, setActiveIdx] = useState(0)
  const [status, setStatus] = useState(null)
  const confirm = useConfirm()

  const save = async (next) => {
    setStatus('saving')
    try {
      await onSave(next)
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 3000)
  }

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

  const removePackage = async (pIdx) => {
    if (!(await confirm('Remove this package? This action cannot be undone.'))) return
    const next = services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      packages: s.packages.filter((_, pi) => pi !== pIdx),
    })
    setServices(next)
    await save(next)
  }

  const updateAddition = (aIdx, field, value) =>
    setServices(services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      additions: s.additions.map((a, ai) => ai !== aIdx ? a : { ...a, [field]: value }),
    }))

  const addAddition = () =>
    setServices(services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      additions: [...(s.additions || []), { ...EMPTY_ADDITION }],
    }))

  const removeAddition = async (aIdx) => {
    if (!(await confirm('Remove this add-on? This action cannot be undone.'))) return
    const next = services.map((s, i) => i !== activeIdx ? s : {
      ...s,
      additions: s.additions.filter((_, ai) => ai !== aIdx),
    })
    setServices(next)
    await save(next)
  }

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
          Subtitle (selector card)
          <input type="text" value={service.subtitle || ''} onChange={(e) => updateService('subtitle', e.target.value)} className="admin-input" />
        </label>
        <label className="admin-label">
          Summary
          <textarea rows="3" value={service.summary} onChange={(e) => updateService('summary', e.target.value)} className="admin-input" />
        </label>
        <div className="admin-card__actions">
          <button type="button" className="admin-update-btn" onClick={() => save(services)} disabled={status === 'saving'}>↻ Update</button>
        </div>
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
            <div className="admin-card__actions">
              <button type="button" className="admin-update-btn" onClick={() => save(services)} disabled={status === 'saving'}>↻ Update</button>
              <button type="button" className="admin-remove-btn" onClick={() => removePackage(pIdx)} title="Delete package">🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {service.packages.length === 0 && (
        <p className="admin-empty-msg">No packages yet. Click "+ Add Package" to create one.</p>
      )}

      <div className="admin-packages-header">
        <h3 className="admin-section__sub-title">Add-ons ({(service.additions || []).length})</h3>
        <button type="button" className="admin-add-btn" onClick={addAddition}>+ Add Add-on</button>
      </div>

      <div className="admin-grid admin-grid--3">
        {(service.additions || []).map((item, aIdx) => (
          <div key={aIdx} className="admin-card admin-card--package">
            <div className="admin-card__pkg-header">
              <span className="admin-card__pkg-num">#{aIdx + 1}</span>
            </div>

            <label className="admin-label">
              Title
              <input type="text" value={item.title} onChange={(e) => updateAddition(aIdx, 'title', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Price
              <input type="text" value={item.price || ''} onChange={(e) => updateAddition(aIdx, 'price', e.target.value)} className="admin-input" placeholder="e.g. $120" />
            </label>
            <label className="admin-label">
              Description
              <textarea rows="3" value={item.description || ''} onChange={(e) => updateAddition(aIdx, 'description', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">Image</label>
            <ImageUploader
              value={item.image}
              onChange={(url) => updateAddition(aIdx, 'image', url)}
              folder="services"
            />
            <div className="admin-card__actions">
              <button type="button" className="admin-update-btn" onClick={() => save(services)} disabled={status === 'saving'}>↻ Update</button>
              <button type="button" className="admin-remove-btn" onClick={() => removeAddition(aIdx)} title="Delete add-on">🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {(service.additions || []).length === 0 && (
        <p className="admin-empty-msg">No add-ons yet. Click "+ Add Add-on" to create one.</p>
      )}

      <AdminToast status={status} />
    </section>
  )
}

export default AdminServices
