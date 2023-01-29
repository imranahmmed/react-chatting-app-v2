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
    let [friendList, setFriendList] = useState([])
    let [friends, setFriends] = useState([])

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
                    freqArr.push({ ...item.val(), id: item.key })
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


    useEffect(() => {
        const friendList = ref(db, 'friends');
        onValue(friendList, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo.uid === item.val().receiverId || data.authData.userInfo.uid === item.val().senderId) {
                    friendsArr.push(item.val())
                }
            });
            setFriendList(friendsArr)
        })
    }, [])

    useEffect(() => {
        const friends = ref(db, 'friends/');
        onValue(friends, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                friendsArr.push(item.val().receiverId + item.val().senderId)
            })
            setFriends(friendsArr);
        });
    }, [])

    return (
        <>
            <Grid className='py-10' item xs={4}>
                <UserList activeUser={data} pendingReq={pendingReq} title="Groups List" groupsFlag={true} />
                <UserList friendReqData={friendReq} activeUser={data} title="Friend  Request" groupsFlag={false} />
            </Grid>
            <Grid item xs={3}>
                <UserList friendListData={friendList} activeUser={data} pendingReq={pendingReq} title="Friends" groupsFlag={false} friendsFlag={true} myGroups={false} />
                <UserList activeUser={data} title="My Groups" groupsFlag={true} friendsFlag={false} myGroups={true} />
            </Grid>
            <Grid item xs={4}>
                <UserList peoplesData={peoples} activeUser={data} pendingReq={pendingReq} friends={friends} title="Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={true} />
                <UserList activeUser={data} title="Blocked Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={false} blockedFlag={true} />
                <h1>Home</h1>
            </Grid>
        </>
    )
}

export default Home