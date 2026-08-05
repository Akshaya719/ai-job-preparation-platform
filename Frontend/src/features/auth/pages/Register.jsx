import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username.trim() || !email.trim() || !password) {
            setError("Please fill in all fields to create your account.")
            return
        }

        const result = await handleRegister({ username: username.trim(), email: email.trim(), password })

        if (result.success) {
            navigate("/")
        } else {
            setError(result.message || "Registration failed. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className="auth-shell">
                <div className="auth-card auth-card--loading">
                    <div className="spinner" />
                    <p>Creating your account…</p>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-shell">
            <div className="auth-card">
                <div className="auth-card__hero">
                    <p className="eyebrow">Professional onboarding</p>
                    <h1>Create your account</h1>
                    <p>Join the platform and start preparing for interviews with tailored AI insights.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Choose a username"
                            autoComplete="username"
                        />
                    </div>

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
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button className="button primary-button">Create account</button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register