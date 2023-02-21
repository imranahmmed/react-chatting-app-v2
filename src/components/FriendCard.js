import React from 'react'
import Div from './Div'
import Img from './Img';
import { useSelector, useDispatch } from 'react-redux';
import { activeChatUser } from '../slices/activeChatSlice';
import Badge from '@mui/material/Badge';

const FriendCard = ({ data, activeUser }) => {
    const { receiverId, receiverEmail, receiverName, receiverPhotoURL, senderId, senderEmail, senderName, senderPhotoURL } = data
    const dispatch = useDispatch()
    const onlineUsersData = useSelector(state => state);
    const onlineUsers = onlineUsersData.onlineUsersData.onlineChatUserInfo

    const openMsgBox = (e) => {
        console.log(e)
    }

    return (
        <Div className="user" onClick={() => dispatch(activeChatUser({ ...data, status: "singleMsg" }))}>


            <Div className="userInfo">
                <Div className="userImg">
                    {activeUser === senderId ?
                        receiverPhotoURL ?
                            <Img src={receiverPhotoURL} />
                            :
                            <Img src="../assets/images/08.png" />
                        :
                        senderPhotoURL ?
                            <Img src={senderPhotoURL} />
                            :
                            <Img src="../assets/images/08.png" />
                    }
                </Div>
                <Div className="userName">
                    {activeUser === senderId
                        ?
                        <>
                            <h3>{receiverName}</h3>
                            <span>{receiverEmail}</span>
                        </>
                        :
                        <>
                            <h3>{senderName}</h3>
                            <span>{senderEmail}</span>
                        </>
                    }
                </Div>
            </Div>

            <Div className="userActions">
                {onlineUsers && onlineUsers.includes(activeUser === senderId ? receiverId : senderId)
                    ?
                    <Badge badgeContent={"Online"} color="success" className='mr-40' />
                    :
                    <Badge badgeContent={"Offline"} color="secondary" className='mr-40' />
                }
            </Div>
        </Div>
    )
}

export default FriendCard