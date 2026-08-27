import { useState } from 'react'
import { useConfirm } from './ConfirmDialog'
import AdminToast from './AdminToast'

const emptyReview = () => ({ name: '', role: '', rating: 5, text: '' })

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
  const [error, setError] = useState(null)
  const confirm = useConfirm()

  // Build the full section payload from the given reviews list (defaults to
  // current state) plus the shared Google links.
  const save = async (nextReviews = reviews) => {
    setError(null)
    setStatus('saving')
    try {
      await onSave({
        items: nextReviews.filter((r) => r.name.trim() || r.text.trim()),
        googleUrl: googleUrl.trim(),
        writeUrl: writeUrl.trim(),
      })
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setError(err)
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 3000)
  }

  const add = () => setReviews([emptyReview(), ...reviews])
  const remove = async (idx) => {
    if (!(await confirm('Remove this review? This action cannot be undone.'))) return
    const next = reviews.filter((_, i) => i !== idx)
    setReviews(next)
    await save(next)
  }
  const update = (idx, field, value) =>
    setReviews(reviews.map((r, i) => (i !== idx ? r : { ...r, [field]: value })))

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
        <div className="admin-card__actions">
          <button type="button" className="admin-update-btn" onClick={() => save()} disabled={status === 'saving'}>↻ Update</button>
        </div>
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
            <div className="admin-card__actions">
              <button type="button" className="admin-update-btn" onClick={() => save()} disabled={status === 'saving'}>↻ Update</button>
              <button type="button" className="admin-remove-btn" onClick={() => remove(idx)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="admin-empty-msg">No reviews yet. Click "+ Add Review" to add one.</p>
      )}

      <AdminToast status={status} error={error} />
    </section>
  )
}

export default AdminReviews
