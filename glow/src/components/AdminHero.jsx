import { useState } from 'react'
import ImageUploader from './ImageUploader'

const SERVICE_LABELS = {
  'premium-experience':   'Premium Experience',
  'spa-premium':          'Spa Premium',
  'kids-wedding-lounger': 'The Kids Wedding Lounger',
}

function AdminHero({ data, onSave }) {
  const [form, setForm] = useState(() => {
    const init = {}
    Object.keys(SERVICE_LABELS).forEach((id) => {
      init[id] = Array.isArray(data[id]) ? [...data[id]] : data[id] ? [data[id]] : []
    })
    return init
  })
  const [status, setStatus] = useState(null)

  const addImage = (serviceId, url = '') =>
    setForm({ ...form, [serviceId]: [...form[serviceId], url] })

  const removeImage = (serviceId, idx) =>
    setForm({ ...form, [serviceId]: form[serviceId].filter((_, i) => i !== idx) })

  const updateImage = (serviceId, idx, val) =>
    setForm({ ...form, [serviceId]: form[serviceId].map((src, i) => (i === idx ? val : src)) })

  const handleSave = async () => {
    setStatus('saving')
    try {
      await onSave(form)
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 3000)
  }

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
                  <button type="button" className="admin-remove-btn" onClick={() => removeImage(serviceId, idx)}>✕ Remove</button>
                </div>
                <ImageUploader
                  value={src}
                  onChange={(url) => updateImage(serviceId, idx, url)}
                  folder={`hero/${serviceId}`}
                />
              </div>
            ))}
          </div>

          {form[serviceId].length === 0 && (
            <p className="admin-empty-msg">No images yet. Click "+ Add Image" to add one.</p>
          )}
        </div>
      ))}

      <div className="admin-actions">
        <button type="button" className={`admin-save-btn${status === 'error' ? ' admin-save-btn--error' : ''}`} onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — check Firestore rules' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default AdminHero
