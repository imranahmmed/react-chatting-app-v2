import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyGroups from '../components/MyGroups';
import Friends from '../components/Friends';
import ChatBox from '../components/ChatBox';
import GroupJoinRequest from '../components/GroupJoinRequest';
import GroupMembers from '../components/GroupMembers';
import { getDatabase, ref, set, push, remove, onValue } from "firebase/database";
import { toast } from 'react-toastify';


const Message = () => {
    const auth = getAuth();
    const db = getDatabase();
    const navigate = useNavigate();
    const userAuthData = useSelector(state => state)
    const loggedinUser = userAuthData.authData.userInfo && userAuthData.authData.userInfo.uid;
    const loggedinUserName = userAuthData.authData.userInfo && userAuthData.authData.userInfo.displayName;
    const loggedinUserEmail = userAuthData.authData.userInfo && userAuthData.authData.userInfo.email;
    const loggedinUserPhoto = userAuthData.authData.userInfo && userAuthData.authData.userInfo.photoURL;
    useEffect(() => {
        if (!userAuthData.authData.userInfo) {
            navigate("/login")
        }
    }, [])




    let [groupJoinReqModalOpen, setGroupJoinReqModalOpen] = useState(false);
    let [groupMembersModalOpen, setGroupMembersModalOpen] = useState(false);
    let [groupJoinReqList, setGroupJoinReqList] = useState([]);
    let [groupMembersList, setGroupMembersList] = useState([]);

    let handleGroupReqModalClose = () => {
        setGroupJoinReqModalOpen(false);
    }
    let handleGroupMembersModalClose = () => {
        setGroupMembersModalOpen(false);
    }
    let handleGroupMembersModalOpen = (groupId) => {
        console.log(groupId)
        setGroupMembersModalOpen(true);
        const groupMembers = ref(db, 'groupMembers');
        onValue(groupMembers, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().groupId === groupId) {
                    arr.push({ ...item.val(), id: item.key })
                }
            });
            setGroupMembersList(arr)
        })
    }

    let handleGroupReqModalOpen = (groupId) => {
        setGroupJoinReqModalOpen(true);
        const groupsJoinRequest = ref(db, 'groupJoinRequest');
        onValue(groupsJoinRequest, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().groupId === groupId) {
                    arr.push({ ...item.val(), id: item.key })
                }
            });
            setGroupJoinReqList(arr);
        });

        console.log(groupJoinReqList)

    };


    return (
        <>
            <Grid item xs={4}>
                <MyGroups handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen}/>
                <Friends />
            </Grid>
            <Grid item xs={7}>
                <ChatBox />
            </Grid>

            <GroupJoinRequest groupJoinReqModalOpen={groupJoinReqModalOpen} handleGroupReqModalClose={handleGroupReqModalClose} groupJoinReqList={groupJoinReqList} />

            <GroupMembers groupMembersModalOpen={groupMembersModalOpen} handleGroupMembersModalClose={handleGroupMembersModalClose} groupMembersList={groupMembersList} />
        </>
    )
}

export default Message