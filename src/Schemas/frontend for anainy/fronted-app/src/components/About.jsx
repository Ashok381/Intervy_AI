import React, { useContext } from 'react'
import { AboutContext } from '../App'

import "./About.css";

function About() {
  const user = useContext(AboutContext)?.data

  if (!user) {
    return <h2>No profile data available</h2>
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  return (
    <div className="about">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="info">
          <label>Username</label>
          <p>{user.username}</p>
        </div>

        <div className="info">
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        <div className="info">
          <label>Account Created</label>
          <p>{formatDate(user.createdAt)}</p>
        </div>

        <div className="info">
          <label>Last Updated</label>
          <p>{formatDate(user.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}

export default About
