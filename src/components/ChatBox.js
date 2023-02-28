import React, { useEffect, useState } from 'react';
import Div from '../components/Div';
import { BsThreeDotsVertical, BsEmojiLaughing, BsFillMicFill } from 'react-icons/bs';
import { AiOutlineCamera, AiTwotoneDelete } from 'react-icons/ai';
import { IoMdPaperPlane } from 'react-icons/io';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { getDatabase, set, push, ref, onValue, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import InputEmoji from "react-input-emoji";
import SimpleDialogDemo from './SimpleDialogDemo';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Img from './Img';


const ChatBox = () => {
    const db = getDatabase()
    const storage = getStorage();
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
    const [imgMsg, setImgMsg] = useState("");
    const [msgList, setMsgList] = useState([]);
    const onlineUsers = data.onlineUsersData.onlineChatUserInfo;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [backDropOpen, setBackDropOpen] = useState(false);

    moment.updateLocale('en', { // override relative time thresholds for "en-gb"
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'just now', // replace "a few seconds" with "just now"
        }
    });

    const handleDialogClose = () => {
        setDialogOpen(false);
    };


    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleMsgImageChange = (e) => {
        setBackDropOpen(true);
        handleDialogClose()
        const singleMsgStorageRef = storageRef(storage, `single-msg-images/ ${loggedinUser} / ${e.target.files[0].name}`);
        uploadBytes(singleMsgStorageRef, e.target.files[0]).then((snapshot) => {
        }).then(() => {
            getDownloadURL(singleMsgStorageRef).then((downloadURL) => {
                setImgMsg(downloadURL);
            }).then(() => {
                setBackDropOpen(false)
                console.log('Uploaded a blob or file!');
            })
        })
    }

    const handleDeleteMsg = (e) => {
        console.log(e.id)
        const { id, whoSendName, whoSendId, whoReceiveName, whoReceiveId, msg, deletedMsg, date } = e
        update(ref(db, "singleMassege/" + e.id), {
            msg: "",
            imgMsg: "",
            deletedMsg: "Massage Deleted",
        }).then(() => {
            setMsg("")
            console.log("Massege Updated")
        })
    }

    const handleMsgSend = () => {
        set(push(ref(db, "singleMassege")), {
            whoSendName: loggedinUserName,
            whoSendId: loggedinUser,
            whoReceiveName: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverName : activeChatSenderName,
            whoReceiveId: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverId : activeChatSenderId,
            msg: msg,
            imgMsg: imgMsg,
            deletedMsg: "",
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
        }).then(() => {
            setMsg("");
            setImgMsg("");
            console.log("Massege Sent")
        })
    }

    useEffect(() => {
        const singlemsgRef = ref(db, "singleMassege");
        onValue(singlemsgRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if ((item.val().whoSendId === loggedinUser && item.val().whoReceiveId === id) || (item.val().whoSendId === id && item.val().whoReceiveId === loggedinUser)) {
                    arr.push({ ...item.val(), id: item.key })
                }
            });
            setMsgList(arr)
        })
    }, [data])

    let handleKeyPress = (e) => {
        console.log(e)
        set(push(ref(db, "singleMassege")), {
            whoSendName: loggedinUserName,
            whoSendId: loggedinUser,
            whoReceiveName: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverName : activeChatSenderName,
            whoReceiveId: activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatReceiverId : activeChatSenderId,
            msg: e,
            imgMsg: imgMsg,
            deletedMsg: "",
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
        }).then(() => {
            setMsg("");
            setImgMsg("");
            console.log("Massege Sent")
        })



    }


    return (
        <>
            {backDropOpen &&
                <div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backDropOpen}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            }



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

                                    {onlineUsers && onlineUsers.includes(activeChatUserInfo && loggedinUser === activeChatSenderId ? activeChatUserInfo.receiverId : activeChatUserInfo.senderId)
                                        ?
                                        <span>Online</span>
                                        :
                                        <span>Offline</span>
                                    }
                                </Div>
                            </Div>
                            <Div><BsThreeDotsVertical /></Div>
                        </Div>
                        <ScrollToBottom className="chatBody" style={{ marginBottom: "50px" }}>
                            {msgList.length > 0
                                ?
                                msgList.map((item, index) => (
                                    item.whoSendId === loggedinUser
                                        ?
                                        <Div key={index} className="receverMsgBox">
                                            <span>{loggedinUserName}</span>
                                            {item.msg || item.imgMsg
                                                ?
                                                item.imgMsg && item.msg
                                                    ?
                                                    <Div className="receverMsg">
                                                        <Div className="msg">
                                                            <p>{item.msg}  <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} /></p>
                                                            <img src={item.imgMsg} alt="" />
                                                        </Div>
                                                    </Div>
                                                    :
                                                    item.msg || !item.imgMsg
                                                        ?
                                                        <Div className="receverMsg">
                                                            <Div className="msg">
                                                                <p>{item.msg}  <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} /></p>
                                                            </Div>
                                                        </Div>
                                                        :
                                                        <Div className="receverMsg">
                                                            <Div className="msg">
                                                                <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} />
                                                                <img src={item.imgMsg} alt="" />
                                                            </Div>
                                                        </Div>
                                                :
                                                <Div className="receverDeleteMsg">
                                                    <Div className="deletedMsg">
                                                        <p>{item.deletedMsg}</p>
                                                    </Div>
                                                </Div>
                                            }
                                            <span><Moment fromNow>{item.date}</Moment></span>
                                        </Div>

                                        :
                                        <Div key={index} className="senderMsgBox">
                                            <span>{item.whoSendName}</span>
                                            {item.msg || item.imgMsg
                                                ?
                                                item.imgMsg && item.msg
                                                    ?
                                                    <Div className="senderMsg">
                                                        <Div className="msg">
                                                            <p>{item.msg}  <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} /></p>
                                                            <img src={item.imgMsg} alt="" />
                                                        </Div>
                                                    </Div>
                                                    :
                                                    item.msg || !item.imgMsg
                                                        ?
                                                        <Div className="senderMsg">
                                                            <Div className="msg">
                                                                <p>{item.msg}  <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} /></p>
                                                            </Div>
                                                        </Div>
                                                        :
                                                        <Div className="senderMsg">
                                                            <Div className="msg">
                                                                <AiTwotoneDelete onClick={() => handleDeleteMsg(item)} />
                                                                <img src={item.imgMsg} alt="" />
                                                            </Div>
                                                        </Div>
                                                :
                                                <Div className="senderDeleteMsg">
                                                    <Div className="deletedMsg">
                                                        <p>{item.deletedMsg}</p>
                                                    </Div>
                                                </Div>
                                            }
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
                            {imgMsg &&
                                <div className="imagePreview" style={{ marginBottom: "15px" }}>
                                    <div className="preview" style={{ width: "100px", height: "100px", backgroundColor: "#222", padding: "5px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={imgMsg} style={{ width: "80px", height: "80px", objectFit: "cover", objectPosition: "center" }} />
                                    </div>
                                </div>
                            }

                            <div className="" style={{ display: "flex", gap: "15px" }}>
                                <Paper component="form" sx={{ p: '5px 5px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    {/* <InputBase onChange={handleMsgChange} name="msg"
                                    sx={{ ml: 1, flex: 1 }}
                                    value={msg} placeholder="Type Your Massage"
                                    inputProps={{ 'aria-label': 'Type Your Massage' }}
                                    />
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <BsEmojiLaughing />
                                </IconButton> */}

                                    <InputEmoji onEnter={handleKeyPress}
                                        value={msg}
                                        onChange={setMsg}
                                        placeholder="Type a message"
                                    />



                                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="directions">
                                        {/* <AiOutlineCamera /> */}
                                        <SimpleDialogDemo dialogOpen={dialogOpen} handleMsgImageChange={handleMsgImageChange} handleDialogClose={handleDialogClose} handleDialogOpen={handleDialogOpen} />
                                    </IconButton>
                                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="directions">
                                        <BsFillMicFill />
                                    </IconButton>
                                </Paper>

                                <Button variant="contained" onClick={handleMsgSend}><IoMdPaperPlane className='sendButton' /></Button>
                            </div>
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