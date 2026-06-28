import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('adflowUser') || 'null')
  const [tab, setTab] = useState('payments')
  const [payments, setPayments] = useState([])
  const [publishAds, setPublishAds] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    const paymentRes = await api.get('/admin/payment-queue')
    const publishRes = await api.get('/admin/publish-queue')
    const analyticsRes = await api.get('/admin/analytics/summary')
    setPayments(paymentRes.data)
    setPublishAds(publishRes.data)
    setAnalytics(analyticsRes.data)
  }

  useEffect(() => { if (user && ['admin', 'super_admin'].includes(user.role)) fetchData().catch(err => setMessage(err.response?.data?.message || 'Failed to load')) }, [])

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <section className='page-section-top'><p className='empty-state'>Login as admin to verify payments.</p></section>
  }

  const verifyPayment = async (id, decision) => {
    try {
      await api.patch(`/admin/payments/${id}/verify`, { decision, note: 'Checked by admin' })
      setMessage('Payment updated')
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment update failed')
    }
  }

  const publishAd = async (id) => {
    try {
      await api.patch(`/admin/ads/${id}/publish`, { adminBoost: 5, isFeatured: true })
      setMessage('Ad published successfully')
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Publish failed')
    }
  }

  return (
    <section className='page-section-top'>
      <div className='page-heading'>
        <h2>Admin Panel</h2>
        <div className='button-row'>
          <button className='btn btn-sm btn-primary' onClick={() => setTab('payments')}>Payments ({payments.length})</button>
          <button className='btn btn-sm btn-success' onClick={() => setTab('publish')}>Publish ({publishAds.length})</button>
          <button className='btn btn-sm btn-success' onClick={() => setTab('analytics')}>Analytics</button>
        </div>
      </div>
      {message && <div className='alert alert-success'>{message}</div>}

      {tab === 'payments' && (
        payments.length === 0 ? <p className='empty-state'>No payment proofs pending.</p> : payments.map(payment => (
          <div key={payment._id} className='order-card'>
            <h3>{payment.ad?.title}</h3>
            <span className='status-badge status-pending'>{payment.status}</span>
            <p><strong>Method:</strong> {payment.method}</p>
            <p><strong>Transaction:</strong> {payment.transactionRef}</p>
            <p><strong>Amount:</strong> PKR {payment.amount}</p>
            <div className='button-row'>
              <button className='btn btn-success btn-sm' onClick={() => verifyPayment(payment._id, 'verify')}>Verify</button>
              <button className='btn btn-danger btn-sm' onClick={() => verifyPayment(payment._id, 'reject')}>Reject</button>
            </div>
          </div>
        ))
      )}

      {tab === 'publish' && (
        publishAds.length === 0 ? <p className='empty-state'>No verified ads waiting to publish.</p> : publishAds.map(ad => (
          <div key={ad._id} className='order-card'>
            <h3>{ad.title}</h3>
            <span className='status-badge status-pending'>{ad.status}</span>
            <p>{ad.package?.name} - {ad.category?.name} - {ad.city?.name}</p>
            <button className='btn btn-primary btn-sm' onClick={() => publishAd(ad._id)}>Publish Now</button>
          </div>
        ))
      )}

      {tab === 'analytics' && (
        <div className='dashboard-grid'>
          <div className='info-card'><h3>Users</h3><p>{analytics?.users || 0}</p></div>
          {(analytics?.adsByStatus || []).map(item => <div key={item._id} className='info-card'><h3>{item._id}</h3><p>{item.count}</p></div>)}
        </div>
      )}
    </section>
  )
}

export default AdminDashboard


