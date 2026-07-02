import React from 'react'

const Info_banner = ({ message, color }) => {
  if (!message) return null

  return (
    <div className="info-banner" style={{ backgroundColor: color || "#e63946" }}>
      {message}
    </div>
  )
}

export default Info_banner
