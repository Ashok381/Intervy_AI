import React, { useContext } from 'react'
// NOTE: was importing from 'react-router-dom', but the rest of the app
// (App.jsx) uses 'react-router' (v7) — that mismatched import would crash.
import { NavLink } from 'react-router'
import { AboutContext, loginContext, InfoContext } from '../App'
import './global.css'

const Navbar = () => {
  const functionlogin = useContext(loginContext)
  const showInfo = useContext(InfoContext)
  const user = useContext(AboutContext)?.data

  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        credentials: "include",
      })
      const Data = await response.json()
      if (!response.ok) {
        throw new Error(Data.message || "Logout failed")
      }
      if (Data.statuscode == 200) {
        functionlogin.setLogin(false)
      }
      localStorage.clear()
    } catch (err) {
      console.log(err)
      showInfo(err.message || "Something went wrong while logging out")
    }
  }

  return (  // here we don't use the anchor tag because it loads the whole page which we do not need so we use link or navlink
    <div className='nav_card '>
      <h2>Welcome Back <strong style={{ "color": "green", "textTransform": "uppercase" }}>{user?.username}</strong></h2>
      <ul className='navbar'>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) =>
            isActive ? "active_link" : ""}>Dashboard</NavLink>
        </li>
        <li><NavLink to="/home" className={({ isActive }) =>
          isActive ? "active_link" : ""}>Home</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) =>
          isActive ? "active_link" : ""}>About</NavLink></li>
        <li><input type="button" value="Log Out" onClick={handleLogout} /></li>
      </ul>
    </div>
  )
}

export default Navbar
