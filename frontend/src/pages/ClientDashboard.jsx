import React, { useEffect, useState } from 'react'
import api from '../utils/api'
<<<<<<< HEAD
import { getStoredUser } from '../utils/authStorage'

const ClientDashboard = () => {
  const user = getStoredUser()
=======

const ClientDashboard = () => {
  const user = JSON.parse(localStorage.getItem('adflowUser') || 'null')
>>>>>>> 8c3c81f3521e853ef147c4816dd9e7f4c7ae4e98
  const [meta, setMeta] = useState({ packages: [], categories: [], cities: [] })
  const [ads, setAds] = useState([])
  const [message, setMessage] = useState('')
  const [showAdForm, setShowAdForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [adForm, setAdForm] = useState({ title: '', category: '', city: '', package: '', description: '', price: '', sellerPhone: '', mediaUrl: '' })
  const [paymentForm, setPaymentForm] = useState({ ad: '', package: '', method: '', transactionRef: '', senderName: '', screenshotUrl: '' })

  const fetchData = async () => {
    const metaRes = await api.get('/meta')
    setMeta(metaRes.data)
    const dashboardRes = await api.get('/client/dashboard')
    setAds(dashboardRes.data.ads || [])
  }

  useEffect(() => { if (user?.role === 'client') fetchData().catch(err => setMessage(err.response?.data?.message || 'Failed to load')) }, [])

  if (!user || user.role !== 'client') {
    return <section className='page-section-top'><p className='empty-state'>Login as client to create ads.</p></section>
  }

  const handleAdSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/client/ads', { ...adForm, price: Number(adForm.price), mediaUrls: [adForm.mediaUrl], submit: true })
      setMessage('Ad submitted for moderator review')
      setShowAdForm(false)
      setAdForm({ title: '', category: '', city: '', package: '', description: '', price: '', sellerPhone: '', mediaUrl: '' })
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ad submission failed')
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/client/payments', paymentForm)
      setMessage('Payment proof submitted')
      setShowPaymentForm(false)
      setPaymentForm({ ad: '', package: '', method: '', transactionRef: '', senderName: '', screenshotUrl: '' })
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed')
    }
  }

  const paymentAds = ads.filter(ad => ad.status === 'payment_pending' || ad.status === 'rejected')

  return (
    <section className='page-section-top'>
      <div className='page-heading'><h2>Client Dashboard</h2><div><button className='btn btn-success btn-sm' onClick={() => setShowAdForm(!showAdForm)}>+ New Ad</button><button className='btn btn-primary btn-sm' onClick={() => setShowPaymentForm(!showPaymentForm)}>Submit Payment</button></div></div>
      {message && <div className='alert alert-success'>{message}</div>}
      {showAdForm && <div className='card auth-card'><h2>Create Ad</h2><form onSubmit={handleAdSubmit}><div className='form-group'>
        <input name='title' placeholder='Ad title' value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} required />
        <select value={adForm.category} onChange={(e) => setAdForm({ ...adForm, category: e.target.value })} required><option value=''>Select category</option>{meta.categories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <select value={adForm.city} onChange={(e) => setAdForm({ ...adForm, city: e.target.value })} required><option value=''>Select city</option>{meta.cities.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <select value={adForm.package} onChange={(e) => setAdForm({ ...adForm, package: e.target.value })} required><option value=''>Select package</option>{meta.packages.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <input type='number' placeholder='Price' value={adForm.price} onChange={(e) => setAdForm({ ...adForm, price: e.target.value })} />
        <input placeholder='Phone' value={adForm.sellerPhone} onChange={(e) => setAdForm({ ...adForm, sellerPhone: e.target.value })} />
        <input placeholder='External image or YouTube URL' value={adForm.mediaUrl} onChange={(e) => setAdForm({ ...adForm, mediaUrl: e.target.value })} />
        <textarea placeholder='Description' value={adForm.description} onChange={(e) => setAdForm({ ...adForm, description: e.target.value })} required />
        <button className='btn btn-primary'>Submit Ad</button>
      </div></form></div>}
      {showPaymentForm && <div className='card auth-card'><h2>Payment Proof</h2><form onSubmit={handlePaymentSubmit}><div className='form-group'>
        <select value={paymentForm.ad} onChange={(e) => setPaymentForm({ ...paymentForm, ad: e.target.value })} required><option value=''>Select payment pending ad</option>{paymentAds.map(ad => <option key={ad._id} value={ad._id}>{ad.title}</option>)}</select>
        <select value={paymentForm.package} onChange={(e) => setPaymentForm({ ...paymentForm, package: e.target.value })} required><option value=''>Select package</option>{meta.packages.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <input placeholder='Method' value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} required />
        <input placeholder='Transaction ref' value={paymentForm.transactionRef} onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })} required />
        <input placeholder='Sender name' value={paymentForm.senderName} onChange={(e) => setPaymentForm({ ...paymentForm, senderName: e.target.value })} required />
        <input placeholder='Screenshot URL optional' value={paymentForm.screenshotUrl} onChange={(e) => setPaymentForm({ ...paymentForm, screenshotUrl: e.target.value })} />
        <button className='btn btn-primary'>Submit Payment</button>
      </div></form></div>}
      {ads.length === 0 ? <p className='empty-state'>No ads yet.</p> : ads.map(ad => <div key={ad._id} className='order-card'><h3>{ad.title}</h3><span className='status-badge status-pending'>{ad.status}</span><p>{ad.category?.name} - {ad.city?.name}</p><p>{ad.description}</p></div>)}
    </section>
  )
}

export default ClientDashboard


