import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const Health = () => {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    api.get('/health/db').then(res => setHealth(res.data)).catch(err => setHealth({ status: 'failed', message: err.message }))
  }, [])

  return (
    <section className='page-section-top'>
      <div className='card auth-card'>
        <h2>System Health</h2>
        <p><strong>Status:</strong> {health?.status || 'checking'}</p>
        <p>{health?.message}</p>
        <p>Cron endpoints are available for scheduled publishing, expiry, notifications, and heartbeat logs.</p>
      </div>
    </section>
  )
}

export default Health


