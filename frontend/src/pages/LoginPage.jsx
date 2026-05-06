import { useState } from 'react'

const emptyForm = {
  username: '',
  password: '',
}

function validateLogin(form) {
  const errors = {}

  if (!form.username.trim()) {
    errors.username = 'Username is required.'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required.'
  }

  return errors
}

function LoginPage() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateLogin(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setMessage('')
      return
    }

    setSubmitting(true)
    setErrors({})
    setMessage('')

    try {
      const response = await fetch('/api/products/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok || data.status !== 'success') {
        setErrors({
          username: data.errors?.username?.[0],
          password: data.errors?.password?.[0],
        })
        return
      }

      setMessage(`Welcome, ${data.data.user.username}.`)
      setForm(emptyForm)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Account access
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Sign in</h1>
        <p className="mt-3 text-sm text-slate-500">
          Enter your username and password to continue.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              placeholder="akira"
            />
            {errors.username ? (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              placeholder="Enter password"
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message ? (
          <p className="mt-5 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  )
}

export default LoginPage
