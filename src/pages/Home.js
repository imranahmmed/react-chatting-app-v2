import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import UserList from '../components/UserList';
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const db = getDatabase();
    let data = useSelector((state) => state);
    let [peoples, setPeoples] = useState([])
    let [friendReq, setFriendReq] = useState([])
    let [pendingReq, setPendingReq] = useState([])

    // console.log(data.authData.userInfo)
    // console.log(friendReq)
    useEffect(() => {
        const peoples = ref(db, 'users/');
        onValue(peoples, (snapshot) => {
            let usersArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo.uid !== item.key) {
                    usersArr.push(item.val())
                }
            })
            setPeoples(usersArr);
        });

        const friendRequests = ref(db, 'friendRequests/');
        onValue(friendRequests, (snapshot) => {
            let freqArr = [];
            snapshot.forEach((item) => {
                if (item.val().receiverId === data.authData.userInfo.uid) {
                    freqArr.push(item.val())
                }
            })
            setFriendReq(freqArr);
        });
    }, [])

    useEffect(() => {
        const friendRequests = ref(db, 'friendRequests/');
        onValue(friendRequests, (snapshot) => {
            let prendingArr = [];
            snapshot.forEach((item) => {
                prendingArr.push(item.val().receiverId + item.val().senderId)
            })
            setPendingReq(prendingArr);
        });
    }, [])

    return (
        <>
            <Grid className='py-10' item xs={4}>
                <UserList title="Groups List" groupsFlag={true} />
                <UserList friendReqData={friendReq} title="Friend  Request" groupsFlag={false} />
            </Grid>
            <Grid item xs={3}>
                <UserList title="Friends" groupsFlag={false} friendsFlag={true} myGroups={false} />
                <UserList title="My Groups" groupsFlag={true} friendsFlag={false} myGroups={true} />
            </Grid>
            <Grid item xs={4}>
                <UserList peoplesData={peoples} activeUser={data} pendingReq={pendingReq} title="Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={true} />
                <UserList title="Blocked Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={false} blockedFlag={true} />
                <h1>Home</h1>
            </Grid>
        </>
    )
}

export default Home