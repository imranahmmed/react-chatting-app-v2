import React from 'react'

const Div = ({ children, className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>{children}</div>
  )
}

export default Div