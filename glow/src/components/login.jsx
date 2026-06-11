import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function Login({ onLogin, onBack }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password)
      onLogin()
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address.')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled.')
          break
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Incorrect email or password.')
          break
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.')
          break
        default:
          setError('Could not sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo.png" alt="Glow Dreams" className="login-logo" />
        <h1 className="login-title">Admin Panel</h1>
        <p className="login-sub">Glow Dreams Parties & Events</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Email
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="Email"
              autoComplete="username"
              className="login-input"
            />
          </label>
          <label className="login-label">
            Password
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Password"
              autoComplete="current-password"
              className="login-input"
            />
          </label>
          {error && <span className="login-error">{error}</span>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <button type="button" className="login-back" onClick={onBack}>
          ← Back to site
        </button>
      </div>
    </div>
  )
}

export default Login
