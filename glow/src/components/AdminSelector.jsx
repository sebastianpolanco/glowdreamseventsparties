import { useState } from 'react'
import ImageUploader from './ImageUploader'
import AdminToast from './AdminToast'

function AdminSelector({ data, onSave }) {
  const [image, setImage] = useState(data || '')
  const [status, setStatus] = useState(null)

  // Firestore delivers the saved image asynchronously, after this component has
  // already mounted with the default. Re-sync whenever the incoming data changes.
  const [prevData, setPrevData] = useState(data)
  if (data !== prevData) {
    setPrevData(data)
    setImage(data || '')
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

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Selector Background</h2>
        <p className="admin-section__sub">
          The full-screen image behind the experience selector. Images are
          compressed automatically before saving.
        </p>
      </div>

      <div className="admin-grid admin-grid--4">
        <div className="admin-card admin-card--gallery">
          <div className="admin-card__pkg-header">
            <span className="admin-card__pkg-num">Background</span>
          </div>
          <ImageUploader
            value={image}
            onChange={setImage}
            folder="selector"
          />
          <div className="admin-card__actions">
            <button
              type="button"
              className="admin-update-btn"
              onClick={() => save(image)}
              disabled={status === 'saving'}
            >
              ↻ Update
            </button>
          </div>
        </div>
      </div>

      <AdminToast status={status} />
    </section>
  )
}

export default AdminSelector
