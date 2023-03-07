import React, { useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Div from './Div'
import GroupCard from './GroupCard';


const MyGroups = ({handleGroupReqModalOpen, handleGroupMembersModalOpen}) => {
    const db = getDatabase();
    const data = useSelector((state) => state);
    const loggedInUser = data.authData.userInfo.uid;


    let [myGroupList, setMyGroupList] = useState([]);
    let [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        const groupMembers = ref(db, 'groupMembers');
        onValue(groupMembers, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().groupId + item.val().userId)
            });
            setGroupMembers(arr)
        })
    }, []);

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
        <Div className='box'>
            <Div className="boxHeading">
                <h3>My Groups</h3>
            </Div>
            <Div className="boxBody">
                {myGroupList.map((item, index) => (
                    <GroupCard key={index} data={item} activeUser={loggedInUser} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen}/>
                ))}
            </Div>
        </Div>
        // <FriendCard key={index} data={item} activeUser={loggedInUser} />
        // <UserList myGroupList={myGroupList} activeUser={data} title="My Groups" groupsFlag={true} myGroupsFlag={true} friendsFlag={false} myGroups={true} />
    )
}

export default MyGroups