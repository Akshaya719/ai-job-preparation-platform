import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className="auth-shell">
                <div className="auth-card auth-card--loading">
                    <div className="spinner" />
                    <p>Verifying your session…</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }

    return children
}

export default Protected