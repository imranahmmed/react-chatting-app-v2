import React from 'react'
import TextField from '@mui/material/TextField';

const InputBox = ({ onChange ,label, variant, placeholder, type, className, name }) => {
    return (
        <TextField onChange={onChange} label={label} type={type} name={name} className={className} variant={variant} placeholder={placeholder} />
    )
}

export default InputBox