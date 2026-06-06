import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const SetupDashboard = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('adflowUser') || 'null')
  const [message, setMessage] = useState('')
  const [packageForm, setPackageForm] = useState({ name: '', durationDays: '', weight: '', price: '', benefits: '', isFeatured: false })
  const [categoryName, setCategoryName] = useState('')
  const [cityName, setCityName] = useState('')
  const [questionForm, setQuestionForm] = useState({ question: '', answer: '', topic: '' })

  if (!user || user.role !== 'super_admin') {
    return <section className='page-section-top'><p className='empty-state'>Only super admin can open setup page.</p></section>
  }

  const createPackage = async (e) => {
    e.preventDefault()
    try {
      await api.post('/super-admin/packages', {
        ...packageForm,
        durationDays: Number(packageForm.durationDays),
        weight: Number(packageForm.weight),
        price: Number(packageForm.price),
        benefits: packageForm.benefits.split(',').map(item => item.trim()).filter(Boolean)
      })
      setMessage('Package created successfully')
      setPackageForm({ name: '', durationDays: '', weight: '', price: '', benefits: '', isFeatured: false })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Package creation failed')
    }
  }

  const createCategory = async (e) => {
    e.preventDefault()
    await api.post('/super-admin/categories', { name: categoryName })
    setCategoryName('')
    setMessage('Category created successfully')
  }

  const createCity = async (e) => {
    e.preventDefault()
    await api.post('/super-admin/cities', { name: cityName })
    setCityName('')
    setMessage('City created successfully')
  }

  const createQuestion = async (e) => {
    e.preventDefault()
    await api.post('/super-admin/questions', questionForm)
    setQuestionForm({ question: '', answer: '', topic: '' })
    setMessage('Learning question created successfully')
  }

  return (
    <section className='page-section-top'>
      <div className='page-heading'>
        <h2>Super Admin Setup</h2>
        <button className='btn btn-success btn-sm' onClick={() => navigate('/client')}>Go Workflow</button>
      </div>
      {message && <div className='alert alert-success'>{message}</div>}
      <div className='dashboard-grid'>
        <div className='card'><h2>Add Package</h2><form onSubmit={createPackage}><div className='form-group'>
          <input name='name' placeholder='Package name' value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} required />
          <input name='durationDays' type='number' placeholder='Duration days' value={packageForm.durationDays} onChange={(e) => setPackageForm({ ...packageForm, durationDays: e.target.value })} required />
          <input name='weight' type='number' placeholder='Weight' value={packageForm.weight} onChange={(e) => setPackageForm({ ...packageForm, weight: e.target.value })} required />
          <input name='price' type='number' placeholder='Price' value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} required />
          <input name='benefits' placeholder='Benefits comma separated' value={packageForm.benefits} onChange={(e) => setPackageForm({ ...packageForm, benefits: e.target.value })} />
          <label><input type='checkbox' checked={packageForm.isFeatured} onChange={(e) => setPackageForm({ ...packageForm, isFeatured: e.target.checked })} /> Featured</label>
          <button className='btn btn-primary'>Create Package</button>
        </div></form></div>

        <div className='card'><h2>Add Category</h2><form onSubmit={createCategory}><div className='form-group'>
          <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder='Category name' required />
          <button className='btn btn-primary'>Create Category</button>
        </div></form></div>

        <div className='card'><h2>Add City</h2><form onSubmit={createCity}><div className='form-group'>
          <input value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder='City name' required />
          <button className='btn btn-primary'>Create City</button>
        </div></form></div>

        <div className='card'><h2>Add Learning Question</h2><form onSubmit={createQuestion}><div className='form-group'>
          <input placeholder='Question' value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} required />
          <input placeholder='Answer' value={questionForm.answer} onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })} required />
          <input placeholder='Topic' value={questionForm.topic} onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })} />
          <button className='btn btn-primary'>Create Question</button>
        </div></form></div>
      </div>
    </section>
  )
}

export default SetupDashboard
