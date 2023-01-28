import React from 'react'
const CButton = (props) => {
    return (
        <props.buttonType onClick={props.onClick} className={props.className} variant="contained" disableRipple>
            {props.children}
        </props.buttonType>
    )
}

export default CButton