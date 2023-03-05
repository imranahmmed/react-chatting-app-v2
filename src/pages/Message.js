import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyGroups from '../components/MyGroups';
import Friends from '../components/Friends';
import ChatBox from '../components/ChatBox';
import NewMassages from '../components/NewMassages';
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
                <MyGroups />
                <Friends />
            </Grid>

            <Grid item xs={7}>
                <ChatBox />
            </Grid>
        </>
    )
}

export default Message