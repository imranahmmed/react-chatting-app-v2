import React, { useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Div from './Div'
import FriendCard from './FriendCard';

const Friends = () => {
    const db = getDatabase();
    const data = useSelector((state) => state);
    const loggedInUser = data.authData.userInfo.uid;

    const [friendList, setFriendList] = useState([]);

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
    }, [db]);


    return (
        <Div className="box">
            <Div className="boxHeading">
                <h3>Friends</h3>
            </Div>
            <Div className="boxBody">
                {friendList &&
                    friendList.map((item, index) => (
                        <FriendCard key={index} data={item} activeUser={loggedInUser} />
                    ))
                }
            </Div>
        </Div>
    )
}

export default Friends