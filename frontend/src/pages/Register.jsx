import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', formData)
      localStorage.setItem('adflowToken', res.data.token)
      localStorage.setItem('adflowUser', JSON.stringify(res.data.user))
      if (res.data.user.role === 'super_admin') navigate('/setup')
      else if (res.data.user.role === 'moderator') navigate('/moderator')
      else if (res.data.user.role === 'admin') navigate('/admin')
      else navigate('/client')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <section className='page-section-top'>
      <div className='card auth-card'>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input type='text' name='name' placeholder='Full name' value={formData.name} onChange={handleChange} required />
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
            <select name='role' value={formData.role} onChange={handleChange}>
              <option value='client'>Client</option>
              <option value='moderator'>Moderator</option>
              <option value='admin'>Admin</option>
              <option value='super_admin'>Super Admin</option>
            </select>
            {error && <div className='alert alert-error'>{error}</div>}
            <button className='btn btn-primary'>Register</button>
          </div>
        </form>
        <p>Already registered? <Link to='/login'>Login here</Link></p>
      </div>
    </section>
  )
}

export default Register
