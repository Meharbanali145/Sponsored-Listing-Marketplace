import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const requestToken = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setResetToken(res.data.resetToken)
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset token')
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await api.post('/auth/reset-password', { email, resetToken, newPassword })
      setMessage(res.data.message)
      setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed')
    }
  }

  return (
    <section className='page-section-top'>
      <div className='card auth-card'>
        <h2>Forgot Password</h2>
        <form onSubmit={requestToken}>
          <div className='form-group'>
            <input type='email' placeholder='Enter registered email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className='btn btn-primary'>Generate Reset Token</button>
          </div>
        </form>

        {resetToken && (
          <div className='reset-token-box'>
            <p><strong>Reset Token:</strong></p>
            <p>{resetToken}</p>
          </div>
        )}

        <form onSubmit={resetPassword} style={{ marginTop: '16px' }}>
          <div className='form-group'>
            <input placeholder='Paste reset token' value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
            <input type='password' placeholder='New password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button className='btn btn-success'>Reset Password</button>
          </div>
        </form>

        {message && <div className='alert alert-success'>{message}</div>}
        {error && <div className='alert alert-error'>{error}</div>}
        <p><Link to='/login'>Back to login</Link></p>
      </div>
    </section>
  )
}

export default ForgotPassword
