import React from 'react'

const Heading = (props) => {
  const {content, className} = props
  return (
    props.as === "" || props.as === undefined
      ?
      <h1 className={className}>{content}</h1>
      :
      <props.as className={className}>{content}</props.as>
  )
}

export default Heading