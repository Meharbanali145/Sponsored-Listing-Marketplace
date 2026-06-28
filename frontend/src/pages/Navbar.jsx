import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { getStoredUser } from '../utils/authStorage'

const Navbar = () => {
  const navigate = useNavigate()
  const user = getStoredUser()
=======

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('adflowUser') || 'null')
>>>>>>> 8c3c81f3521e853ef147c4816dd9e7f4c7ae4e98

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


