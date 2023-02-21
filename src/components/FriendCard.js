import React from 'react'
import Div from './Div'
import Img from './Img';
import { useSelector, useDispatch } from 'react-redux';
import { activeChatUser } from '../slices/activeChatSlice';
const FriendCard = ({ data, activeUser }) => {
    const { receiverId, receiverEmail, receiverName, receiverPhotoURL, senderId, senderEmail, senderName, senderPhotoURL } = data
    const dispatch = useDispatch()
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
                {/* <button className='btn'>Join</button> */}
            </Div>
        </Div>
    )
}

export default FriendCard