import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const MAX_ATTEMPTS = 3
const LOCK_MS = 15 * 60 * 1000 // 15 minutes
const ATTEMPTS_KEY = 'glow_admin_login_attempts'
const LOCK_KEY = 'glow_admin_lock_until'
// Basic but effective email shape check: something@something.tld
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const readNum = (key) => {
  try { return Number(localStorage.getItem(key)) || 0 } catch { return 0 }
}

function Login({ onLogin, onBack }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(() => readNum(ATTEMPTS_KEY))
  const [lockUntil, setLockUntil] = useState(() => readNum(LOCK_KEY))
  const [now, setNow] = useState(() => Date.now())

  const locked = now < lockUntil

  // While locked, tick every second so the countdown updates and the form
  // re-enables automatically once the lock expires.
  useEffect(() => {
    if (!locked) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [locked])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const registerFailure = () => {
    const next = attempts + 1
    setAttempts(next)
    try { localStorage.setItem(ATTEMPTS_KEY, String(next)) } catch { /* ignore */ }
    if (next >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_MS
      setLockUntil(until)
      try { localStorage.setItem(LOCK_KEY, String(until)) } catch { /* ignore */ }
    }
    return next
  }

  const resetAttempts = () => {
    setAttempts(0)
    setLockUntil(0)
    try {
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCK_KEY)
    } catch { /* ignore */ }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (locked) return

    const email = form.email.trim()
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, form.password)
      resetAttempts()
      onLogin()
    } catch (err) {
      let counts = false
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
          counts = true
          break
        case 'auth/too-many-requests':
          // Firebase's own server-side per-IP throttling kicked in.
          setError('Too many attempts from this network. Please try again later.')
          break
        default:
          setError('Could not sign in. Please try again.')
      }
      if (counts) {
        const n = registerFailure()
        const left = MAX_ATTEMPTS - n
        if (left > 0) {
          setError(`Incorrect email or password. ${left} attempt${left === 1 ? '' : 's'} left.`)
        } else {
          setError('Too many failed attempts. Access locked for 15 minutes.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const minutesLeft = Math.max(1, Math.ceil((lockUntil - now) / 60000))

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo.png" alt="Glow Dreams" className="login-logo" />
        <h1 className="login-title">Admin Panel</h1>
        <p className="login-sub">Glow Dreams Parties & Events</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="login-label">
            Email
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="Email"
              autoComplete="username"
              className="login-input"
              disabled={locked}
              required
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
              disabled={locked}
              minLength={8}
              required
            />
          </label>
          {locked ? (
            <span className="login-error">
              Access locked. Try again in {minutesLeft} minute{minutesLeft === 1 ? '' : 's'}.
            </span>
          ) : (
            error && <span className="login-error">{error}</span>
          )}
          <button type="submit" className="login-btn" disabled={loading || locked}>
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
