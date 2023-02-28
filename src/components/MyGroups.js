import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import UserList from '../components/UserList';
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Div from './Div'


const MyGroups = () => {
    const db = getDatabase();
    const data = useSelector((state) => state);
    const loggedInUser = data.authData.userInfo.uid;


    let [myGroupList, setMyGroupList] = useState([]);

    useEffect(() => {
        const myGroups = ref(db, 'groups');
        onValue(myGroups, (snapshot) => {
            let myGroupssArr = [];
            snapshot.forEach((item) => {
                if (loggedInUser === item.val().adminId) {
                    myGroupssArr.push({ ...item.val(), groupId: item.key })
                }
            });
            setMyGroupList(myGroupssArr);
        });
    }, [db]);

    return (
        <UserList myGroupList={myGroupList} activeUser={data} title="My Groups" groupsFlag={true} myGroupsFlag={true} friendsFlag={false} myGroups={true} />
    )
}

export default MyGroups