import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useConfirm } from './ConfirmDialog'

const emptyReview = () => ({ name: '', role: '', rating: 5, text: '', image: '' })

function StarPicker({ value, onChange }) {
  return (
    <div className="admin-stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`admin-star${n <= value ? ' admin-star--on' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={n <= value}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function AdminReviews({ data, onSave }) {
  const initial = Array.isArray(data) ? { items: data } : (data || {})
  const [reviews, setReviews] = useState((initial.items || []).map((r) => ({ ...r })))
  const [googleUrl, setGoogleUrl] = useState(initial.googleUrl || '')
  const [writeUrl, setWriteUrl] = useState(initial.writeUrl || '')
  const [status, setStatus] = useState(null)
  const confirm = useConfirm()

  const add = () => setReviews([emptyReview(), ...reviews])
  const remove = async (idx) => {
    if (!(await confirm('Remove this review? This action cannot be undone.'))) return
    setReviews(reviews.filter((_, i) => i !== idx))
  }
  const update = (idx, field, value) =>
    setReviews(reviews.map((r, i) => (i !== idx ? r : { ...r, [field]: value })))

  const handleSave = async () => {
    setStatus('saving')
    try {
      await onSave({
        items: reviews.filter((r) => r.name.trim() || r.text.trim()),
        googleUrl: googleUrl.trim(),
        writeUrl: writeUrl.trim(),
      })
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
        <h2 className="admin-section__title">Reviews</h2>
        <p className="admin-section__sub">Add, edit, and remove the reviews that guests share about Glow Dreams.</p>
      </div>

      <div className="admin-card admin-card--wide">
        <h3 className="admin-card__title">Google links</h3>
        <label className="admin-label">
          "See all reviews" link (your Google Business reviews page)
          <input type="url" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} className="admin-input" placeholder="https://share.google/…" />
        </label>
        <label className="admin-label">
          "Write a review" link (Google write-a-review page)
          <input type="url" value={writeUrl} onChange={(e) => setWriteUrl(e.target.value)} className="admin-input" placeholder="https://search.google.com/local/writereview?placeid=…" />
        </label>
        <p className="admin-section__sub">Leave the write-a-review link empty to reuse the reviews link for both buttons.</p>
      </div>

      <div className="admin-packages-header">
        <h3 className="admin-section__sub-title">Reviews ({reviews.length})</h3>
        <button type="button" className="admin-add-btn" onClick={add}>+ Add Review</button>
      </div>

      <div className="admin-grid admin-grid--3">
        {reviews.map((review, idx) => (
          <div key={idx} className="admin-card">
            <div className="admin-card__pkg-header">
              <span className="admin-card__pkg-num">#{idx + 1}</span>
              <button type="button" className="admin-remove-btn" onClick={() => remove(idx)}>✕ Remove</button>
            </div>
            <label className="admin-label">
              Name
              <input type="text" value={review.name} onChange={(e) => update(idx, 'name', e.target.value)} className="admin-input" placeholder="Guest name" />
            </label>
            <label className="admin-label">
              Event / Role
              <input type="text" value={review.role} onChange={(e) => update(idx, 'role', e.target.value)} className="admin-input" placeholder="e.g. Birthday party" />
            </label>
            <label className="admin-label">Rating</label>
            <StarPicker value={review.rating} onChange={(n) => update(idx, 'rating', n)} />
            <label className="admin-label">
              Review
              <textarea rows="4" value={review.text} onChange={(e) => update(idx, 'text', e.target.value)} className="admin-input" placeholder="What did they say?" />
            </label>
            <label className="admin-label">Photo (optional)</label>
            <ImageUploader
              value={review.image}
              onChange={(url) => update(idx, 'image', url)}
              folder="reviews"
            />
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="admin-empty-msg">No reviews yet. Click "+ Add Review" to add one.</p>
      )}

      <div className="admin-actions">
        <button type="button" className={`admin-save-btn${status === 'error' ? ' admin-save-btn--error' : ''}`} onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — check Firestore rules' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default AdminReviews
