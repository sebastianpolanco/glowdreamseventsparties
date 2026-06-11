import { useState } from 'react'

function AdminContact({ data, onSave }) {
  const [form, setForm] = useState({ ...data })
  const [status, setStatus] = useState(null)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

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
        <h2 className="admin-section__title">Contact Info</h2>
        <p className="admin-section__sub">Update the contact information shown on the Contact page.</p>
      </div>

      <div className="admin-card admin-card--wide">
        <label className="admin-label">
          Phone Number
          <input type="tel" value={form.phone} onChange={set('phone')} className="admin-input" placeholder="000-000-0000" />
        </label>
        <label className="admin-label">
          Email Address
          <input type="email" value={form.email} onChange={set('email')} className="admin-input" placeholder="hello@example.com" />
        </label>
        <label className="admin-label">
          Instagram Handle
          <input type="text" value={form.instagram} onChange={set('instagram')} className="admin-input" placeholder="@yourhandle" />
        </label>
        <label className="admin-label">
          Instagram URL
          <input type="text" value={form.instagramUrl || ''} onChange={set('instagramUrl')} className="admin-input" placeholder="https://instagram.com/yourhandle" />
        </label>
      </div>

      <div className="admin-actions">
        <button type="button" className={`admin-save-btn${status === 'error' ? ' admin-save-btn--error' : ''}`} onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — check Firestore rules' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default AdminContact
