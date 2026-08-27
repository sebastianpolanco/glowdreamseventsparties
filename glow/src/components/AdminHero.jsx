import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useConfirm } from './ConfirmDialog'
import AdminToast from './AdminToast'
import { approxDocBytes, compressDataUrl, FIRESTORE_DOC_LIMIT } from '../imageCompression'

const SERVICE_LABELS = {
  'premium-experience':   'Premium Experience',
  'spa-premium':          'Spa Premium',
  'kids-wedding-lounger': 'The Kids Wedding Lounger',
}

// Each experience is stored in its own Firestore document, so the 1 MB ceiling
// applies per experience. Surface how much of it is used — running out is what
// made uploads fail silently before.
function usage(images) {
  const bytes = approxDocBytes(images)
  return { kb: Math.round(bytes / 1024), pct: Math.round((bytes / FIRESTORE_DOC_LIMIT) * 100) }
}

function HeroServiceTitle({ label, images }) {
  const { kb, pct } = usage(images)
  return (
    <h3 className="admin-section__sub-title">
      {label} ({images.length})
      <span className={`admin-hero-usage${pct >= 80 ? ' admin-hero-usage--full' : ''}`}>
        {kb} KB of 1024 KB used
      </span>
    </h3>
  )
}

function buildForm(data) {
  const init = {}
  Object.keys(SERVICE_LABELS).forEach((id) => {
    init[id] = Array.isArray(data?.[id]) ? [...data[id]] : data?.[id] ? [data[id]] : []
  })
  return init
}

function AdminHero({ data, onSave }) {
  const [form, setForm] = useState(() => buildForm(data))
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [optimizing, setOptimizing] = useState(false)
  const confirm = useConfirm()

  // Firestore delivers the real hero images asynchronously, after this
  // component has already mounted with the default (placeholder) data. Re-sync
  // the form whenever the incoming data changes so saved images actually show.
  const [prevData, setPrevData] = useState(data)
  if (data !== prevData) {
    setPrevData(data)
    setForm(buildForm(data))
  }

  const save = async (next) => {
    setError(null)
    setStatus('saving')
    try {
      await onSave(next)
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setError(err)
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 3000)
  }

  // Re-encode every stored image to the current byte budget. Images added
  // before the budget existed weigh 150-220 KB each; this typically cuts an
  // experience to a third of its size and is a no-op for anything already small.
  const optimize = async () => {
    setOptimizing(true)
    try {
      const next = {}
      for (const serviceId of Object.keys(SERVICE_LABELS)) {
        next[serviceId] = []
        for (const src of form[serviceId]) next[serviceId].push(await compressDataUrl(src))
      }
      setForm(next)
      await save(next)
    } catch (err) {
      console.error(err)
      setError(err)
      setStatus('error')
    } finally {
      setOptimizing(false)
    }
  }

  const addImage = (serviceId, url = '') =>
    setForm({ ...form, [serviceId]: [...form[serviceId], url] })

  const removeImage = async (serviceId, idx) => {
    if (!(await confirm('Remove this image? This action cannot be undone.'))) return
    const next = { ...form, [serviceId]: form[serviceId].filter((_, i) => i !== idx) }
    setForm(next)
    await save(next)
  }

  const updateImage = (serviceId, idx, val) =>
    setForm({ ...form, [serviceId]: form[serviceId].map((src, i) => (i === idx ? val : src)) })

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Hero Images</h2>
        <p className="admin-section__sub">Add multiple images per experience — they cycle automatically every 5 seconds.</p>
        <button
          type="button"
          className="admin-add-btn"
          onClick={optimize}
          disabled={optimizing || status === 'saving'}
        >
          {optimizing ? 'Optimizing…' : '⚡ Optimize images'}
        </button>
      </div>

      {Object.keys(SERVICE_LABELS).map((serviceId) => (
        <div key={serviceId} className="admin-hero-service">
          <div className="admin-packages-header">
            <HeroServiceTitle label={SERVICE_LABELS[serviceId]} images={form[serviceId]} />
            <button type="button" className="admin-add-btn" onClick={() => addImage(serviceId)}>+ Add Image</button>
          </div>

          <div className="admin-grid admin-grid--4">
            {form[serviceId].map((src, idx) => (
              <div key={idx} className="admin-card admin-card--gallery">
                <div className="admin-card__pkg-header">
                  <span className="admin-card__pkg-num">Slide {idx + 1}</span>
                </div>
                <ImageUploader
                  value={src}
                  onChange={(url) => updateImage(serviceId, idx, url)}
                />
                <div className="admin-card__actions">
                  <button type="button" className="admin-update-btn" onClick={() => save(form)} disabled={status === 'saving'}>↻ Update</button>
                  <button type="button" className="admin-remove-btn" onClick={() => removeImage(serviceId, idx)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>

          {form[serviceId].length === 0 && (
            <p className="admin-empty-msg">No images yet. Click "+ Add Image" to add one.</p>
          )}
        </div>
      ))}

      <AdminToast status={status} error={error} />
    </section>
  )
}

export default AdminHero
