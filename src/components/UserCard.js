import React from 'react';
import Div from './Div';
import Img from './Img';

const UserCard = ({ groupsFlag, friendsFlag, myGroups, peopleFlag, blockedFlag, userData, handleFriendReq, handleFriendReqCancle, handleBlockFriend, handleUnblockFriend, friendReqData, friendsData, pendingReq, friends, blockedData, activeUser, handleFriendReqReject, handleFriendReqAccept }) => {
    let { username, photoURL, email, id } = userData;
    let { senderName, senderEmail, senderPhotoURL, senderId, receiverName, receiverEmail, receiverPhotoURL, receiverId } = friendReqData;
    let { date } = friendsData;
    let loggedInUser = activeUser.authData.userInfo.uid;
    // let { blockedUserName, blockedUserImg } = blockedData;
    // console.log(blockedData.blockedUserName)

    return (
        <>
            <Div className="user">
                <Div className="userInfo">
                    {groupsFlag
                        ?
                        myGroups
                            ?
                            <Div className="userName">
                                <h3>My Group Image</h3>
                            </Div>
                            :
                            <Div className="userName">
                                <h3>Join Group Image</h3>
                            </Div>
                        :
                        friendsFlag
                            ?
                            peopleFlag
                                ?
                                <Div className="userImg">
                                    {photoURL
                                        ?
                                        <Img src={photoURL} />
                                        :
                                        <Img src="../assets/images/08.png" />
                                    }
                                </Div>
                                :
                                blockedFlag
                                    ?
                                    <Div className="userImg">
                                        {blockedData && blockedData.blockedUserImg
                                            ?
                                            <Img src={blockedData.blockedUserImg} />
                                            :
                                            <Img src="../assets/images/08.png" />
                                        }
                                    </Div>
                                    :
                                    <Div className="userImg">
                                        {loggedInUser === senderId
                                            ?
                                            receiverPhotoURL
                                                ?
                                                <Img src={receiverPhotoURL} />
                                                :
                                                <Img src="../assets/images/08.png" />
                                            :
                                            senderPhotoURL
                                                ?
                                                <Img src={senderPhotoURL} />
                                                :
                                                <Img src="../assets/images/08.png" />
                                        }

                                    </Div>
                            :
                            <Div className="userImg">
                                {senderPhotoURL
                                    ?
                                    <Img src={senderPhotoURL} />
                                    :
                                    <Img src="../assets/images/08.png" />
                                }
                            </Div>
                    }

                    {groupsFlag
                        ?
                        myGroups
                            ?
                            <Div className="userName">
                                <h3>Group Name</h3>
                                <span>Last Chat</span>
                            </Div>
                            :

                            <Div className="userName">
                                <h3>Join Group</h3>
                                <span>Join Group</span>
                            </Div>
                        :
                        friendsFlag
                            ?
                            peopleFlag
                                ?
                                // Peoples
                                <Div className="userName">
                                    <h3>{username}</h3>
                                    <span>{email}</span>
                                </Div>
                                :
                                blockedFlag
                                    ?
                                    // blocked users
                                    <Div className="userName">
                                        <h3>{blockedData && blockedData.blockedUserName}</h3>
                                        <span>Blocked From <strong>{blockedData && blockedData.blockedDate}</strong></span>
                                    </Div>
                                    :
                                    // friends
                                    loggedInUser === senderId
                                        ?
                                        <Div className="userName">
                                            <h3>{receiverName}</h3>
                                            <span>Friends From <b>{date}</b></span>
                                        </Div>
                                        :
                                        <Div className="userName">
                                            <h3>{senderName}</h3>
                                            <span>Friends From <b>{date}</b></span>
                                        </Div>
                            :
                            // friend Request
                            <Div className="userName">
                                <h3>{senderName}</h3>
                                <span>{senderEmail}</span>
                            </Div>
                    }
                </Div>
                <Div className="userActions">
                    {groupsFlag
                        ?
                        <>
                            {myGroups
                                ?
                                <span>Today, 8:56pm</span>
                                :
                                <button className='btn'>Join</button>
                            }
                        </>
                        :
                        <Div className="flex gap-x-5">
                            <>
                                {friendsFlag
                                    ?
                                    <>
                                        {peopleFlag
                                            ?
                                            pendingReq.includes(id + loggedInUser) || pendingReq.includes(loggedInUser + id)
                                                ?
                                                pendingReq.includes(id + loggedInUser)
                                                    ?
                                                    <>
                                                        <button className='btn'>Pending</button>
                                                        <button onClick={() => handleFriendReqCancle(userData)} className='btn'>Cancle Request</button>
                                                    </>
                                                    :
                                                    <button className='btn'>Pending</button>
                                                :
                                                friends.includes(id + loggedInUser) || friends.includes(loggedInUser + id)
                                                    ?
                                                    <button className='friendsBtn'>Friends</button>
                                                    :
                                                    <button onClick={() => handleFriendReq(userData)} className='btn'>+</button>

                                            :
                                            <>
                                                {blockedFlag
                                                    ?
                                                    <button onClick={()=>handleUnblockFriend(blockedData)} className='btn'>Unblock</button>
                                                    :
                                                    <button onClick={() => handleBlockFriend(friendsData)} className='btn'>Block</button>
                                                }
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                        <button onClick={() => handleFriendReqAccept(friendReqData)} className='btn'>Accept</button>
                                        <button onClick={() => handleFriendReqReject(friendReqData)} className='btn'>Reject</button>
                                    </>
                                }
                            </>
                        </Div>
                    }
                </Div>
            </Div >
        </>
    )
}

export default UserCard