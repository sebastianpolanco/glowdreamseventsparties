import { useState } from 'react'
import ImageUploader from './ImageUploader'
import AdminToast from './AdminToast'

function AdminAbout({ data, onSave }) {
  const [cards, setCards] = useState(data.map((c) => ({ ...c })))
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const update = (idx, field, value) =>
    setCards(cards.map((c, i) => (i !== idx ? c : { ...c, [field]: value })))

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

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">About Us</h2>
        <p className="admin-section__sub">Edit the title, text, and image for each card on the About page.</p>
      </div>

      <div className="admin-grid admin-grid--3">
        {cards.map((card, idx) => (
          <div key={idx} className="admin-card">
            <h3 className="admin-card__title">{card.title}</h3>
            <label className="admin-label">
              Title
              <input type="text" value={card.title} onChange={(e) => update(idx, 'title', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">
              Text
              <textarea rows="4" value={card.text} onChange={(e) => update(idx, 'text', e.target.value)} className="admin-input" />
            </label>
            <label className="admin-label">Image</label>
            <ImageUploader
              value={card.image}
              onChange={(url) => update(idx, 'image', url)}
              folder="about"
            />
            <div className="admin-card__actions">
              <button type="button" className="admin-update-btn" onClick={() => save(cards)} disabled={status === 'saving'}>↻ Update</button>
            </div>
          </div>
        ))}
      </div>

      <AdminToast status={status} error={error} />
    </section>
  )
}

export default AdminAbout
