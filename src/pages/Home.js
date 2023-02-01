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
    let [cancleFriendReq, setCancleFriendReq] = useState([])
    let [blockedList, setBlockedList] = useState([])
    let [userListShowblocked, setUserListShowblocked] = useState([])

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
    }, [db])

    useEffect(() => {
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
    }, [db])

    useEffect(() => {
        const friendRequests = ref(db, 'friendRequests/');
        onValue(friendRequests, (snapshot) => {
            let prendingArr = [];
            let cancleArr = [];
            snapshot.forEach((item) => {
                prendingArr.push(item.val().receiverId + item.val().senderId)
                cancleArr.push({ ...item.val(), id: item.key })
            })
            setPendingReq(prendingArr);
            setCancleFriendReq(cancleArr)
        });
    }, [db])


    useEffect(() => {
        const friendRequests = ref(db, 'blockedList/');
        onValue(friendRequests, (snapshot) => {
            let blockedArr = []
            snapshot.forEach((item) => {
                blockedArr.push(item.val().blockedUserId + item.val().blockedById)
            })
            setUserListShowblocked(blockedArr)
        });
    }, [db])


    useEffect(() => {
        const friendList = ref(db, 'friends');
        onValue(friendList, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo.uid === item.val().receiverId || data.authData.userInfo.uid === item.val().senderId) {
                    friendsArr.push({ ...item.val(), id: item.key })
                }
            });
            setFriendList(friendsArr)
        })
    }, [db])

    useEffect(() => {
        const friends = ref(db, 'friends/');
        onValue(friends, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                friendsArr.push(item.val().receiverId + item.val().senderId)
            })
            setFriends(friendsArr);
        });
    }, [db])

    useEffect(() => {
        const blockedlist = ref(db, 'blockedList/');
        onValue(blockedlist, (snapshot) => {
            let blockedsArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo.uid === item.val().blockedById) {
                    blockedsArr.push({ ...item.val(), id: item.key })
                }
            })
            setBlockedList(blockedsArr);
        });
    }, [db])

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
                <UserList peoplesData={peoples} activeUser={data} pendingReq={pendingReq} userListShowblocked={userListShowblocked} cancleFriendReq={cancleFriendReq} friends={friends} title="Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={true} />
                <UserList blockedUsersData={blockedList} activeUser={data} title="Blocked Peoples" groupsFlag={false} friendsFlag={true} myGroups={false} peopleFlag={false} blockedFlag={true} />
                <h1>Home</h1>
            </Grid>
        </>
    )
}

export default Home