import React from 'react'
import Div from './Div'
import UserCard from './UserCard'
import { getDatabase, ref, set, push, remove } from "firebase/database";
import { toast } from 'react-toastify';
const UserList = ({ title, groupsFlag, friendsFlag, myGroups, peopleFlag, blockedFlag, peoplesData, cancleFriendReq, activeUser, friendReqData, pendingReq, friendListData, friends, blockedUsersData }) => {
    // console.log(blockedUsersData)
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
    };

    let handleFriendReqCancle = (info) => {
        cancleFriendReq.map((i) => {
            if (info.id === i.receiverId) {
                remove(ref(db, 'friendRequests/' + i.id)).then(() => {
                    toast.error(`Friend Request Cancled.`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    })
                })
            }
        })
    };

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
    };

    let handleFriendReqAccept = (info) => {
        set(push(ref(db, 'friends/')), {
            ...info,
            date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
        }).then(() => {
            remove(ref(db, 'friendRequests/' + info.id)).then(() => {
                toast.success(`You Accepted ${info.senderName}'s Friend Request.`)
            })
        })
    };

    let handleBlockFriend = (info) => {
        activeUser.authData.userInfo.uid === info.senderId
            ?
            set(push(ref(db, 'blockedList/')), {
                friendsFromDate: info.date,
                blockedDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                blockedUserName: info.receiverName,
                blockedUserEmail: info.receiverEmail,
                blockedUserId: info.receiverId,
                blockedUserImg: info.receiverPhotoURL,

                blockedByName: info.senderName,
                blockedByEmail: info.senderEmail,
                blockedById: info.senderId,
                blockedByImg: info.senderPhotoURL
            }).then(() => {
                remove(ref(db, 'friends/' + info.id)).then(() => {
                    toast.success(`You Blocked ${info.receiverName} from your friend list.`)
                })
            })
            :
            set(push(ref(db, 'blockedList/')), {
                friendsFromDate: info.date,
                blockedDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                blockedUserName: info.senderName,
                blockedUserEmail: info.senderEmail,
                blockedUserId: info.senderId,
                blockedUserImg: info.senderPhotoURL,

                blockedByName: info.receiverName,
                blockedByEmail: info.receiverEmail,
                blockedById: info.receiverId,
                blockedByImg: info.receiverPhotoURL
            }).then(() => {
                remove(ref(db, 'friends/' + info.id)).then(() => {
                    toast.success(`You Blocked ${info.senderName} from your friend list.`)
                })
            })
    }

    let handleUnblockFriend = (info) => {
        console.log(info)
        set(push(ref(db, 'friends/')), {
            date: info.friendsFromDate,
            senderName: info.blockedUserName,
            senderEmail: info.blockedUserEmail,
            senderPhotoURL: info.blockedUserImg,
            senderId: info.blockedUserId,

            receiverName: activeUser.authData.userInfo.displayName,
            receiverEmail: activeUser.authData.userInfo.email,
            receiverPhotoURL: activeUser.authData.userInfo.photoURL,
            receiverId: activeUser.authData.userInfo.uid,
        }).then(() => {
            remove(ref(db, 'blockedList/' + info.id)).then(() => {
                toast.success(`You Unblocked ${info.blockedUserName} from your blocklist.`)
            })
        })
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
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} cancleFriendReq={cancleFriendReq} />
                    ))
                }

                {friendReqData &&
                    friendReqData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} blockedData={item} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} cancleFriendReq={cancleFriendReq} />
                    ))
                }
                {friendListData &&
                    friendListData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} blockedData={item} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} cancleFriendReq={cancleFriendReq} />
                    ))
                }
                {blockedUsersData &&
                    blockedUsersData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} friends={friends} blockedData={item} activeUser={activeUser} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} cancleFriendReq={cancleFriendReq} />
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
                                    blockedUsersData && blockedUsersData <= 0 &&
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