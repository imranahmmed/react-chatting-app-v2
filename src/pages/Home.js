import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import UserList from '../components/UserList';
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { useSelector } from 'react-redux';
const Home = () => {
    const db = getDatabase();
    const data = useSelector((state) => state);
    const loggedInUser = data.authData.userInfo && data.authData.userInfo.uid;

    let [peoples, setPeoples] = useState([]);
    let [friendReq, setFriendReq] = useState([]);
    let [pendingReq, setPendingReq] = useState([]);
    let [friendList, setFriendList] = useState([]);
    let [friends, setFriends] = useState([]);
    let [cancleFriendReq, setCancleFriendReq] = useState([]);
    let [blockedList, setBlockedList] = useState([]);
    let [userListShowblocked, setUserListShowblocked] = useState([]);

    let [groupMembers, setGroupMembers] = useState([]);
    let [groupList, setGroupList] = useState([]);
    let [myGroupList, setMyGroupList] = useState([]);
    let [showGroupReqPending, setShowGroupReqPending] = useState([]);
    let [showJoined, setShowJoined] = useState([]);

    useEffect(() => {
        const peoples = ref(db, 'users/');
        onValue(peoples, (snapshot) => {
            let usersArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo && data.authData.userInfo.uid !== item.key) {
                    usersArr.push(item.val())
                }
            })
            setPeoples(usersArr);
        });
    }, [db]);

    useEffect(() => {
        const friendRequests = ref(db, 'friendRequests/');
        onValue(friendRequests, (snapshot) => {
            let freqArr = [];
            snapshot.forEach((item) => {
                if (item.val().receiverId === data.authData.userInfo && data.authData.userInfo.uid) {
                    freqArr.push({ ...item.val(), id: item.key })
                }
            })
            setFriendReq(freqArr);
        });
    }, [db]);

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
    }, [db]);

    useEffect(() => {
        const friendRequests = ref(db, 'blockedList/');
        onValue(friendRequests, (snapshot) => {
            let blockedArr = []
            snapshot.forEach((item) => {
                blockedArr.push(item.val().blockedUserId + item.val().blockedById)
            })
            setUserListShowblocked(blockedArr)
        });
    }, [db]);

    useEffect(() => {
        const friendList = ref(db, 'friends');
        onValue(friendList, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo && data.authData.userInfo.uid === item.val().receiverId || data.authData.userInfo && data.authData.userInfo.uid === item.val().senderId) {
                    friendsArr.push({ ...item.val(), id: item.key })
                }
            });
            setFriendList(friendsArr)
        })
    }, [db]);

    useEffect(() => {
        const friends = ref(db, 'friends/');
        onValue(friends, (snapshot) => {
            let friendsArr = [];
            snapshot.forEach((item) => {
                friendsArr.push(item.val().receiverId + item.val().senderId)
            })
            setFriends(friendsArr);
        });
    }, [db]);

    useEffect(() => {
        const blockedlist = ref(db, 'blockedList/');
        onValue(blockedlist, (snapshot) => {
            let blockedsArr = [];
            snapshot.forEach((item) => {
                if (data.authData.userInfo && data.authData.userInfo.uid === item.val().blockedById) {
                    blockedsArr.push({ ...item.val(), id: item.key })
                }
            })
            setBlockedList(blockedsArr);
        });
    }, [db]);

    useEffect(() => {
        const groups = ref(db, 'groups');
        onValue(groups, (snapshot) => {
            let groupssArr = [];
            snapshot.forEach((item) => {
                if (item.val().adminId !== loggedInUser) {
                    groupssArr.push({ ...item.val(), groupId: item.key })
                }
            });
            setGroupList(groupssArr);
        });
    }, [db]);


    useEffect(() => {
        const groupRequests = ref(db, 'groupJoinRequest');
        onValue(groupRequests, (snapshot) => {
            let groupPendingArr = [];
            snapshot.forEach((item) => {
                groupPendingArr.push(item.val().groupId + item.val().userId)
            })
            setShowGroupReqPending(groupPendingArr);
        });
    }, [db]);

    useEffect(() => {
        const groupMembers = ref(db, 'groupMembers');
        onValue(groupMembers, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().groupId + item.val().userId)
            });
            setShowJoined(arr)
            setGroupMembers(arr)
        })
    }, [db]);


    useEffect(() => {
        const myGroups = ref(db, 'groups');
        onValue(myGroups, (snapshot) => {
            let myGroupssArr = [];
            snapshot.forEach((item) => {
                if (loggedInUser === item.val().adminId || groupMembers.includes(item.key + loggedInUser)) {
                    myGroupssArr.push({ ...item.val(), groupId: item.key })
                }
            });
            setMyGroupList(myGroupssArr);
        });
    }, [groupMembers]);

    return (
        <>
            <Grid className='py-10' item xs={4}>
                <UserList activeUser={data} pendingReq={pendingReq} groupList={groupList} title="Groups List" groupsFlag={true} showGroupReqPending={showGroupReqPending} showJoined={showJoined} />
                <UserList friendReqData={friendReq} activeUser={data} title="Friend  Request" groupsFlag={false} />
            </Grid>
            <Grid item xs={3}>
                <UserList friendListData={friendList} activeUser={data} pendingReq={pendingReq} title="Friends" groupsFlag={false} friendsFlag={true} myGroups={false} />
                <UserList myGroupList={myGroupList} activeUser={data} title="My Groups" groupsFlag={true} myGroupsFlag={true} friendsFlag={false} myGroups={true} />
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