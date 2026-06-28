import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const Packages = () => {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    api.get('/packages').then(res => setPackages(res.data)).catch(err => console.log(err))
  }, [])

  return (
    <section className='page-section-top'>
      <div className='page-heading'><h2>Packages</h2></div>
      {packages.length === 0 ? <p className='empty-state'>No packages created. Super admin can add packages from setup.</p> : (
        <div className='dashboard-grid'>
          {packages.map(pkg => (
            <div key={pkg._id} className='info-card'>
              <h3>{pkg.name}</h3>
              <p><strong>Price:</strong> PKR {pkg.price}</p>
              <p><strong>Duration:</strong> {pkg.durationDays} days</p>
              <p><strong>Weight:</strong> {pkg.weight}x</p>
              <p>{pkg.isFeatured ? 'Featured package' : 'Normal package'}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Packages


