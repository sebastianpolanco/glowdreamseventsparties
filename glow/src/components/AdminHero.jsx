import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useConfirm } from './ConfirmDialog'
import AdminToast from './AdminToast'

const SERVICE_LABELS = {
  'premium-experience':   'Premium Experience',
  'spa-premium':          'Spa Premium',
  'kids-wedding-lounger': 'The Kids Wedding Lounger',
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
      </div>

      {Object.keys(SERVICE_LABELS).map((serviceId) => (
        <div key={serviceId} className="admin-hero-service">
          <div className="admin-packages-header">
            <h3 className="admin-section__sub-title">{SERVICE_LABELS[serviceId]} ({form[serviceId].length})</h3>
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
                  folder={`hero/${serviceId}`}
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

      <AdminToast status={status} />
    </section>
  )
}

export default AdminHero
