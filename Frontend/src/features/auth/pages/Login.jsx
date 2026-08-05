import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim() || !password) {
            setError("Please fill in both fields to continue.")
            return
        }

        const result = await handleLogin({ email: email.trim(), password })

        if (result.success) {
            navigate('/')
        } else {
            setError(result.message || "Login failed. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className="auth-shell">
                <div className="auth-card auth-card--loading">
                    <div className="spinner" />
                    <p>Preparing your secure workspace…</p>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-shell">
            <div className="auth-card">
                <div className="auth-card__hero">
                    <p className="eyebrow">Secure access</p>
                    <h1>Welcome back</h1>
                    <p>Sign in to continue building your interview strategy with confidence.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-field">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button className="button primary-button">Sign in</button>
                </form>

                <p className="auth-switch">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login