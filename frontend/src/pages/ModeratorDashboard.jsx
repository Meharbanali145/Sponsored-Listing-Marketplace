import React, { useEffect, useState } from 'react'
import api from '../utils/api'
<<<<<<< HEAD
import { getStoredUser } from '../utils/authStorage'

const ModeratorDashboard = () => {
  const user = getStoredUser()
=======

const ModeratorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('adflowUser') || 'null')
>>>>>>> 8c3c81f3521e853ef147c4816dd9e7f4c7ae4e98
  const [ads, setAds] = useState([])
  const [message, setMessage] = useState('')

  const fetchAds = async () => {
    const res = await api.get('/moderator/review-queue')
    setAds(res.data)
  }

  useEffect(() => { if (user && ['moderator', 'admin', 'super_admin'].includes(user.role)) fetchAds().catch(err => setMessage(err.response?.data?.message || 'Failed to load')) }, [])

  if (!user || !['moderator', 'admin', 'super_admin'].includes(user.role)) {
    return <section className='page-section-top'><p className='empty-state'>Login as moderator to review ads.</p></section>
  }

  const reviewAd = async (id, decision) => {
    try {
      await api.patch(`/moderator/ads/${id}/review`, { decision, note: decision === 'approve' ? 'Content approved' : 'Content rejected' })
      setMessage('Review saved successfully')
      fetchAds()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Review failed')
    }
  }

  return (
    <section className='page-section-top'>
      <div className='page-heading'><h2>Moderator Review Queue</h2></div>
      {message && <div className='alert alert-success'>{message}</div>}
      {ads.length === 0 ? <p className='empty-state'>No ads waiting for review.</p> : ads.map(ad => (
        <div key={ad._id} className='order-card'>
          <h3>{ad.title}</h3>
          <span className='status-badge status-pending'>{ad.status}</span>
          <p><strong>Category:</strong> {ad.category?.name}</p>
          <p><strong>City:</strong> {ad.city?.name}</p>
          <p>{ad.description}</p>
          <div className='button-row'>
            <button className='btn btn-success btn-sm' onClick={() => reviewAd(ad._id, 'approve')}>Approve</button>
            <button className='btn btn-danger btn-sm' onClick={() => reviewAd(ad._id, 'reject')}>Reject</button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ModeratorDashboard


