import React from 'react'

const Img = ({ src, alt, title, className, style }) => {
    return (
        <img className={className} src={src} alt={alt} title={title} style={style} />
    )
}

export default Img