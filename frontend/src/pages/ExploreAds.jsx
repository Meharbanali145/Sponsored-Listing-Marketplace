import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const ExploreAds = () => {
  const [ads, setAds] = useState([])
  const [search, setSearch] = useState('')

  const fetchAds = async () => {
    try {
      const res = await api.get(`/ads?q=${search}`)
      setAds(res.data.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { fetchAds() }, [search])

  return (
    <section className='page-section-top'>
      <div className='page-heading'>
        <h2>Explore Active Ads</h2>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search ads' />
      </div>
      {ads.length === 0 ? <p className='empty-state'>No published ads yet.</p> : (
        <div className='dashboard-grid'>
          {ads.map(ad => (
            <div key={ad._id} className='info-card'>
              <img className='card-img' src={ad.media?.[0]?.thumbnailUrl || 'https://placehold.co/600x400'} />
              <h3>{ad.title}</h3>
              <p><strong>Category:</strong> {ad.category?.name}</p>
              <p><strong>City:</strong> {ad.city?.name}</p>
              <p><strong>Package:</strong> {ad.package?.name}</p>
              <p><strong>Price:</strong> PKR {ad.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ExploreAds
