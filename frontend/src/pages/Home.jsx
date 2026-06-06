import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <section className='page-section-top'>
      <div className='hero-simple'>
        <h1>AdFlow Pro</h1>
        <p>Sponsored listing marketplace with client ads, moderator review, admin payment verification, package ranking, analytics, and scheduled expiry.</p>
        <div className='button-row'>
          <Link className='btn btn-primary' to='/register'>Register Role</Link>
          <Link className='btn btn-success' to='/explore'>Explore Ads</Link>
        </div>
      </div>
      <div className='dashboard-grid'>
        <div className='info-card'><h3>Client</h3><p>Create ads and submit payment proof.</p></div>
        <div className='info-card'><h3>Moderator</h3><p>Approve or reject submitted ad content.</p></div>
        <div className='info-card'><h3>Admin</h3><p>Verify payments and publish listings.</p></div>
        <div className='info-card'><h3>Super Admin</h3><p>Create packages, categories, cities, and questions.</p></div>
      </div>
    </section>
  )
}

export default Home
