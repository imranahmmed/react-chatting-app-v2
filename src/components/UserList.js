import React, { useState } from 'react';
import Div from './Div'
import UserCard from './UserCard'
import GroupCreate from './GroupCreate';
import { getDatabase, ref, set, push, remove, onValue } from "firebase/database";
import { toast } from 'react-toastify';
import GroupJoinRequest from './GroupJoinRequest';
import GroupMembers from './GroupMembers';

const UserList = ({ title, groupsFlag, friendsFlag, myGroups, peopleFlag, blockedFlag, myGroupsFlag, peoplesData, cancleFriendReq, activeUser, friendReqData, pendingReq, friendListData, friends, blockedUsersData, userListShowblocked, groupList, myGroupList, showGroupReqPending, showJoined }) => {
    const db = getDatabase();
    let handleFriendReq = (info) => {
        if (info.photoURL && activeUser.authData.userInfo.photoURL) {
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
        } else if (info.photoURL) {
            set(push(ref(db, 'friendRequests/')), {
                senderName: activeUser.authData.userInfo.displayName,
                senderEmail: activeUser.authData.userInfo.email,
                senderId: activeUser.authData.userInfo.uid,

                receiverName: info.username,
                receiverEmail: info.email,
                receiverPhotoURL: info.photoURL,
                receiverId: info.id,
            });
        } else if (activeUser.authData.userInfo.photoURL) {
            set(push(ref(db, 'friendRequests/')), {
                senderName: activeUser.authData.userInfo.displayName,
                senderEmail: activeUser.authData.userInfo.email,
                senderId: activeUser.authData.userInfo.uid,
                senderPhotoURL: activeUser.authData.userInfo.photoURL,

                receiverName: info.username,
                receiverEmail: info.email,
                receiverId: info.id,
            });
        } else {
            set(push(ref(db, 'friendRequests/')), {
                senderName: activeUser.authData.userInfo.displayName,
                senderEmail: activeUser.authData.userInfo.email,
                senderId: activeUser.authData.userInfo.uid,

                receiverName: info.username,
                receiverEmail: info.email,
                receiverId: info.id,
            });
        }
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

    let handleUnfriend = (info) => {
        remove(ref(db, 'friends/' + info.id)).then(() => {
            toast.success(`You Unfriend ${info.senderName} From Your FriendList.`)
        })
    }

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


    let uid = activeUser;
    let [modalOpen, setModalOpen] = useState(false);
    let [groupJoinReqModalOpen, setGroupJoinReqModalOpen] = useState(false);
    let [groupMembersModalOpen, setGroupMembersModalOpen] = useState(false);
    let [groupJoinReqList, setGroupJoinReqList] = useState([]);
    let [groupMembersList, setGroupMembersList] = useState([]);

    let handleModalClose = () => {
        setModalOpen(false);
    }

    let handleModalOpen = () => {
        setModalOpen(true);
    };

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
                if(item.val().groupId === groupId){
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

    let handleGroupJoin = (e) => {
        set(push(ref(db, 'groupJoinRequest/')), {
            groupId: e.groupId,
            groupName: e.groupName,
            userId: activeUser.authData.userInfo.uid,
            userName: activeUser.authData.userInfo.displayName,
            userEmail: activeUser.authData.userInfo.email,
            userPhoto: activeUser.authData.userInfo.photoURL,

        }).then(() => {
            toast.success(`You Sent Join Request.`)
        })
    }

    return (
        <Div className='box'>
            <Div className="boxHeading">
                <h3>{title}</h3>
                {groupsFlag ?
                    myGroupsFlag ?
                        ""
                        :
                        <button className='btn' onClick={handleModalOpen}>Create</button>
                    :
                    ""
                }
            </Div>
            <Div className="boxBody">
                {peoplesData &&
                    peoplesData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }

                {friendReqData &&
                    friendReqData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} blockedData={item} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} handleUnfriend={handleUnfriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }
                {friendListData &&
                    friendListData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} blockedData={item} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} handleUnfriend={handleUnfriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }
                {blockedUsersData &&
                    blockedUsersData.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} blockedData={item} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} handleUnfriend={handleUnfriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }

                {groupList &&
                    groupList.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} blockedData={item} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} handleUnfriend={handleUnfriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }

                {myGroupList &&
                    myGroupList.map((item, index) => (
                        <UserCard key={index} userData={item} friendReqData={item} friendsData={item} pendingReq={pendingReq} userListShowblocked={userListShowblocked} friends={friends} blockedData={item} activeUser={activeUser} groupData={item} myGroupData={item} groupsFlag={groupsFlag} friendsFlag={friendsFlag} myGroups={myGroups} peopleFlag={peopleFlag} blockedFlag={blockedFlag} handleFriendReq={handleFriendReq} handleFriendReqCancle={handleFriendReqCancle} handleFriendReqReject={handleFriendReqReject} handleFriendReqAccept={handleFriendReqAccept} handleBlockFriend={handleBlockFriend} handleUnblockFriend={handleUnblockFriend} handleUnfriend={handleUnfriend} cancleFriendReq={cancleFriendReq} handleGroupJoin={handleGroupJoin} handleGroupReqModalOpen={handleGroupReqModalOpen} handleGroupMembersModalOpen={handleGroupMembersModalOpen} showGroupReqPending={showGroupReqPending} showJoined={showJoined}/>
                    ))
                }
            </Div>


            <GroupCreate modalOpen={modalOpen} modalClose={handleModalClose} uid={uid} />
            <GroupJoinRequest groupJoinReqModalOpen={groupJoinReqModalOpen} handleGroupReqModalClose={handleGroupReqModalClose} groupJoinReqList={groupJoinReqList} />

            <GroupMembers groupMembersModalOpen={groupMembersModalOpen} handleGroupMembersModalClose={handleGroupMembersModalClose} groupMembersList={groupMembersList} />

            <>
                {
                    groupsFlag
                        ?
                        myGroups
                            ?
                            myGroupList && myGroupList <= 0 &&
                            <h3>No Group Available</h3>
                            :
                            groupList && groupList <= 0 &&
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