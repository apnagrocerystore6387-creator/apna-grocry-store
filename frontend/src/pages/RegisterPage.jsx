import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const response = await register({ name, email, password })

    if (response?.token) {
      navigate('/dashboard')
    } else {
      setError(response?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-semibold">Create your AGS account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-slate-300">
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
          />
        </label>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Already have an account?
        {' '}
        <a href="/login" className="font-medium text-white hover:text-accent">
          Sign in
        </a>
      </p>
    </div>
  )
}
