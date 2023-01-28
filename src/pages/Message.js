import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Message = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const userAuthData = useSelector(state => state)

    useEffect(() => {
        if (!userAuthData.authData.userInfo) {
            navigate("/login")
        }
    }, [])

    return (
        <>
            <Grid item xs={4}>
                <h1>Message</h1>
            </Grid>
            <Grid item xs={3}>
                <h1>Message</h1>
            </Grid>
            <Grid item xs={3}>
                <h1>Message</h1>
            </Grid>
        </>
    )
}

export default Message