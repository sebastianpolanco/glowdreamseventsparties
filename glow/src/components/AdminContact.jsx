import { useState } from 'react'
import AdminToast from './AdminToast'

function AdminContact({ data, onSave }) {
  const [form, setForm] = useState({ ...data })
  const [status, setStatus] = useState(null)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const save = async () => {
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
        <label className="admin-label">
          TikTok Handle
          <input type="text" value={form.tiktok || ''} onChange={set('tiktok')} className="admin-input" placeholder="@yourhandle" />
        </label>
        <label className="admin-label">
          TikTok URL
          <input type="text" value={form.tiktokUrl || ''} onChange={set('tiktokUrl')} className="admin-input" placeholder="https://www.tiktok.com/@yourhandle" />
        </label>
        <label className="admin-label">
          Location
          <input type="text" value={form.location || ''} onChange={set('location')} className="admin-input" placeholder="e.g. Area DMV" />
        </label>
        <label className="admin-label">
          Location Detail
          <input type="text" value={form.locationDetail || ''} onChange={set('locationDetail')} className="admin-input" placeholder="e.g. Washington DC · Maryland · Virginia" />
        </label>
        <label className="admin-label">
          Location Map URL (optional)
          <input type="text" value={form.locationUrl || ''} onChange={set('locationUrl')} className="admin-input" placeholder="https://maps.google.com/…" />
        </label>
        <div className="admin-card__actions">
          <button type="button" className="admin-update-btn" onClick={save} disabled={status === 'saving'}>↻ Update</button>
        </div>
      </div>

      <AdminToast status={status} />
    </section>
  )
}

export default AdminContact
