import React from 'react'
import { Link } from 'react-router-dom'

const AuthConfirmationLink = ({ className, title, href, hrefTitle, onClick }) => {
    return (
        <p onClick={onClick} className={className}>{title} <Link to={href}>{hrefTitle}</Link></p>
    )
}

export default AuthConfirmationLink