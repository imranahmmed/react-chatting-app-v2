import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const SelectBox = ({ onChange, value, label }) => {

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={value} label={label} onChange={onChange}>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectBox