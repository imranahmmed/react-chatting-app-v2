import React from 'react';
import Div from './Div';
import Img from './Img';

const UserCard = ({ groupsFlag, friendsFlag, myGroups, peopleFlag, blockedFlag, userData, handleFriendReq, friendReqData, pendingReq, activeUser }) => {
    let { username, photoURL, email, id } = userData;
    let { senderName, senderId, senderEmail, senderPhotoURL } = friendReqData;
    return (
        <>
            {friendReqData ?
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
                                        <Div className="userName">
                                            <h3>Blocked User Image</h3>
                                        </Div>
                                        :
                                        <Div className="userName">
                                            <h3>UnBlocked User Image</h3>
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
                                    <Div className="userName">
                                        <h3>{username}</h3>
                                        <span>{email}</span>
                                    </Div>
                                    :
                                    blockedFlag
                                        ?
                                        <Div className="userName">
                                            <h3>Blocked User Name</h3>
                                            <span>Blocked User Name</span>
                                        </Div>
                                        :
                                        <Div className="userName">
                                            <h3>UnBlocked User Name</h3>
                                            <span>UnBlocked User Name</span>
                                        </Div>
                                :
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
                                                pendingReq.includes(id + activeUser.authData.userInfo.uid) || pendingReq.includes(activeUser.authData.userInfo.uid + id)
                                                    ?
                                                    <button className='btn'>Pending</button>
                                                    :
                                                    <button onClick={() => handleFriendReq(userData)} className='btn'>+</button>
                                                :
                                                <>
                                                    {blockedFlag
                                                        ?
                                                        <button className='btn'>Unblock</button>
                                                        :
                                                        <button className='btn'>Block</button>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <button className='btn'>Accept</button>
                                            <button className='btn'>Reject</button>
                                        </>
                                    }
                                </>
                            </Div>
                        }
                    </Div>
                </Div >
                :
                <h3>No Friend Request</h3>
            }
        </>
    )
}

export default UserCard