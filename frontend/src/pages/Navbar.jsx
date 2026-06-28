import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoredUser } from '../utils/authStorage'

const Navbar = () => {
  const navigate = useNavigate()
  const user = getStoredUser()

  const logout = () => {
    localStorage.removeItem('adflowUser')
    localStorage.removeItem('adflowToken')
    navigate('/login')
  }

  return (
    <nav className='nav'>
      <Link className='brand' to='/'>AdFlow Pro</Link>
      <div>
        <Link to='/explore'>Explore</Link>
        <Link to='/packages'>Packages</Link>
        <Link to='/setup'>Setup</Link>
        <Link to='/client'>Client</Link>
        <Link to='/moderator'>Moderator</Link>
        <Link to='/admin'>Admin</Link>
        <Link to='/health'>Health</Link>
        {user ? <button onClick={logout}>{user.name} logout</button> : <Link to='/login'>Login</Link>}
      </div>
    </nav>
  )
}

export default Navbar


