import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', formData)
      localStorage.setItem('adflowToken', res.data.token)
      localStorage.setItem('adflowUser', JSON.stringify(res.data.user))
      if (res.data.user.role === 'super_admin') navigate('/setup')
      else if (res.data.user.role === 'moderator') navigate('/moderator')
      else if (res.data.user.role === 'admin') navigate('/admin')
      else navigate('/client')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <section className='page-section-top'>
      <div className='card auth-card'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
            {error && <div className='alert alert-error'>{error}</div>}
            <button className='btn btn-primary'>Login</button>
          </div>
        </form>
        <p><Link to='/forgot-password'>Forgot password?</Link></p>
        <p>New user? <Link to='/register'>Register here</Link></p>
      </div>
    </section>
  )
}

export default Login


