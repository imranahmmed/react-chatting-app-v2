import React from 'react'
import Div from './Div'
import UserCard from './UserCard'
import { getDatabase, ref, set, push, remove } from "firebase/database";
import { toast } from 'react-toastify';
const UserList = ({ title, groupsFlag, friendsFlag, myGroups, peopleFlag, blockedFlag, peoplesData, activeUser, friendReqData, pendingReq, friendListData, friends }) => {

    const db = getDatabase();

    let handleFriendReq = (info) => {
        set(push(ref(db, 'friendRequests/')), {
            senderName: activeUser.authData.userInfo.displayName,
            senderEmail: activeUser.authData.userInfo.email,
            senderPhotoURL: activeUser.authData.userInfo.photoURL,
            senderId: activeUser.authData.userInfo.uid,

            receiverName: info.username,
            receiverEmail: info.email,
            receiverPhotoURL: info.photoURL,
            receiverId: info.id,
        });

        console.log(info)
        console.log(activeUser.authData.userInfo)
    }

    let handleFriendReqReject = (info) => {
        remove(ref(db, 'friendRequests/' + info.id)).then(() => {
            toast.error(`${info.senderName}'s Friend Request Rejected!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });
        console.log(info)
    }

    let handleFriendReqAccept = (info) => {
        set(push(ref(db, 'friends/')), {
            ...info,
            date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
        }).then(() => {
            remove(ref(db, 'friendRequests/' + info.id)).then(() => {
                toast.success(`You Accepted ${info.senderName}'s Friend Request.`)
            })
        })

        console.log(info)
    }


    return (
        <Div className='box'>
            <div className="boxHeading">
                <h3>{title}</h3>
                {groupsFlag && <button className='btn'>Create</button>}
            </div>
            <div className="boxBody">
                {peoplesData &&
                    peoplesData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} />
                    ))
                }

                {friendReqData &&
                    friendReqData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} />
                    ))
                }
                {friendListData &&
                    friendListData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} />
                    ))
                }
            </div>


            <>
                {
                    groupsFlag
                        ?
                        myGroups
                            ?
                            <h3>No Group Available</h3>
                            :
                            <h3>No Group Created Yet</h3>
                        :
                        friendsFlag
                            ?
                            peopleFlag
                                ?
                                peoplesData && peoplesData <= 0 &&
                                <h3>No Registered User Available</h3>
                                :
                                blockedFlag
                                    ?
                                    <h3>No blocked User Available</h3>
                                    :
                                    friendListData && friendListData <= 0 &&
                                    <h3>No Friend Available</h3>
                            :
                            friendReqData && friendReqData <= 0 &&
                            <h3>No Friend Request Available</h3>
                }
            </>


        </Div>
    )
}

export default UserList