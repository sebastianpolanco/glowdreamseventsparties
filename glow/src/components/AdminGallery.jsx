import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useConfirm } from './ConfirmDialog'

function AdminGallery({ data, onSave }) {
  const [images, setImages] = useState([...data])
  const [status, setStatus] = useState(null)
  const confirm = useConfirm()

  const add = () => setImages([...images, ''])
  const remove = async (idx) => {
    if (!(await confirm('Remove this image? This action cannot be undone.'))) return
    setImages(images.filter((_, i) => i !== idx))
  }
  const update = (idx, val) => setImages(images.map((img, i) => (i === idx ? val : img)))

  const handleSave = async () => {
    setStatus('saving')
    try {
      await onSave(images.filter(Boolean))
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
        <h2 className="admin-section__title">Gallery</h2>
        <p className="admin-section__sub">Manage the images shown in the About Us carousel.</p>
      </div>

      <div className="admin-packages-header">
        <h3 className="admin-section__sub-title">Images ({images.length})</h3>
        <button type="button" className="admin-add-btn" onClick={add}>+ Add Image</button>
      </div>

      <div className="admin-grid admin-grid--4">
        {images.map((src, idx) => (
          <div key={idx} className="admin-card admin-card--gallery">
            <div className="admin-card__pkg-header">
              <span className="admin-card__pkg-num">#{idx + 1}</span>
              <button type="button" className="admin-remove-btn" onClick={() => remove(idx)}>✕ Remove</button>
            </div>
            <ImageUploader
              value={src}
              onChange={(url) => update(idx, url)}
              folder="gallery"
            />
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="admin-empty-msg">No images yet. Click "+ Add Image" to add one.</p>
      )}

      <div className="admin-actions">
        <button type="button" className={`admin-save-btn${status === 'error' ? ' admin-save-btn--error' : ''}`} onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — check Firestore rules' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default AdminGallery
