import React, { useEffect, useState } from 'react'
import Div from '../components/Div';
import { BsThreeDotsVertical, BsEmojiLaughing } from 'react-icons/bs'
import { AiOutlineCamera } from 'react-icons/ai'
import { IoMdPaperPlane } from 'react-icons/io'
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { getDatabase, set, push, ref, onValue } from 'firebase/database'
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';

const ChatBox = () => {
    const db = getDatabase()
    const data = useSelector(state => state);
    const loggedinUser = data.authData.userInfo.uid;
    const loggedinUserName = data.authData.userInfo.displayName;
    const activeChatUserInfo = data.activeChatData.activeChatUserInfo;
    const activeChatReceiverName = activeChatUserInfo && activeChatUserInfo.receiverName;
    const activeChatReceiverId = activeChatUserInfo && activeChatUserInfo.receiverId;
    const activeChatSenderName = activeChatUserInfo && activeChatUserInfo.senderName;
    const activeChatSenderId = activeChatUserInfo && activeChatUserInfo.senderId;
    const id = activeChatReceiverId === loggedinUser ? activeChatSenderId : activeChatReceiverId
    const [msg, setMsg] = useState("");
    const [msgList, setMsgList] = useState([]);

    moment.updateLocale('en', { // override relative time thresholds for "en-gb"
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'just now', // replace "a few seconds" with "just now"
        }
    });

    const handleMsgChange = (e) => {
        setMsg(e.target.value)
    }

    const handleMsgSend = () => {
        set(push(ref(db, "singleMassege")), {
            whoSendName: loggedinUserName,
            whoSendId: loggedinUser,
            whoReceiveName: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverName : activeChatSenderName,
            whoReceiveId: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverId : activeChatSenderId,
            msg: msg,
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
        }).then(() => {
            setMsg("")
            console.log("Massege Sent")
        })
    }

    useEffect(() => {
        const singlemsgRef = ref(db, "singleMassege");
        onValue(singlemsgRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if ((item.val().whoSendId === loggedinUser && item.val().whoReceiveId === id) || (item.val().whoSendId === id && item.val().whoReceiveId === loggedinUser)) {
                    arr.push(item.val())
                }
            });
            setMsgList(arr)
        })
    }, [data])
    // Set custom thresholds for relative time
    
    return (
        <>
            {data.activeChatData.activeChatUserInfo
                ?
                <>
                    <Div className="chatBox">
                        <Div className="boxHeading">
                            <Div className="chatInfo">
                                <Div className="chatImg">
                                    {activeChatUserInfo && loggedinUser === activeChatSenderId
                                        ?
                                        <Avatar className="chatImg" alt={activeChatUserInfo.receiverName} src={activeChatUserInfo.receiverPhotoURL} />
                                        :
                                        <Avatar className="chatImg" alt={activeChatUserInfo.senderName} src={activeChatUserInfo.senderPhotoURL} />
                                    }
                                    {/* <Avatar className="chatImg" alt={activeChatUserInfo.senderName} src="/static/images/avatar/1.jpg" /> */}
                                </Div>
                                <Div className="chatName">
                                    {activeChatUserInfo && loggedinUser === activeChatSenderId
                                        ?
                                        <h3>{activeChatUserInfo.receiverName}</h3>
                                        :
                                        <h3>{activeChatUserInfo.senderName}</h3>
                                    }
                                    <span>Online</span>
                                </Div>
                            </Div>
                            <Div><BsThreeDotsVertical /></Div>
                        </Div>
                        <ScrollToBottom className="chatBody">
                            {msgList.length > 0
                                ?
                                msgList.map((item, index) => (
                                    item.whoSendId === loggedinUser
                                        ?
                                        <Div key={index} className="receverMsgBox">
                                            <span>{loggedinUserName}</span>
                                            <Div className="receverMsg">
                                                <Div className="msg">
                                                    <p>{item.msg}</p>
                                                </Div>
                                            </Div>
                                            <span><Moment fromNow>{item.date}</Moment></span>
                                        </Div>
                                        :
                                        <Div key={index} className="senderMsgBox">
                                            <span>{item.whoSendName}</span>
                                            <Div className="senderMsg">
                                                <Div className="msg">
                                                    <p>{item.msg}</p>
                                                </Div>
                                            </Div>
                                            <span><Moment fromNow>{item.date}</Moment></span>
                                        </Div>
                                ))
                                :
                                <Div className="beforStartChat">
                                    {activeChatUserInfo && loggedinUser === activeChatSenderId
                                        ?
                                        <Div className="beforStartChatImg">
                                            <Avatar className="chatImg" alt={activeChatUserInfo.receiverName} src={activeChatUserInfo.receiverPhotoURL} />
                                        </Div>
                                        :
                                        <Div className="beforStartChatImg">
                                            <Avatar className="chatImg" alt={activeChatUserInfo.senderName} src={activeChatUserInfo.senderPhotoURL} />
                                        </Div>
                                    }
                                    {activeChatUserInfo && loggedinUser === activeChatSenderId
                                        ?
                                        <h3>{activeChatUserInfo.receiverName}</h3>
                                        :
                                        <h3>{activeChatUserInfo.senderName}</h3>
                                    }
                                    <h3>You And {activeChatUserInfo && loggedinUser === activeChatSenderId
                                        ?
                                        activeChatUserInfo.receiverName
                                        :
                                        activeChatUserInfo.senderName
                                    } Now Friends
                                    </h3>
                                    <h3>Now, You Both Can Start Your Chat</h3>
                                </Div>
                            }
                        </ScrollToBottom>

                        <Div className="chatFooter">
                            <Paper component="form" sx={{ p: '5px 5px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                <InputBase onChange={handleMsgChange} name="msg"
                                    sx={{ ml: 1, flex: 1 }}
                                    value={msg} placeholder="Type Your Massage"
                                    inputProps={{ 'aria-label': 'Type Your Massage' }}
                                />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <BsEmojiLaughing />
                                </IconButton>
                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="directions">
                                    <AiOutlineCamera />
                                </IconButton>
                            </Paper>

                            <Button variant="contained" onClick={handleMsgSend}><IoMdPaperPlane className='sendButton' /></Button>
                        </Div>
                    </Div>
                </>
                :
                <Div className="chatBox beforeSelectActiveUser">
                    <h3>Selact a Friend for Start Chat</h3>
                </Div>
            }
        </>
    )
}

export default ChatBox