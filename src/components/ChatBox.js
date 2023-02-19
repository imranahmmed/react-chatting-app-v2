import React from 'react'
import Div from '../components/Div';
import Img from '../components/Img';
import { BsThreeDotsVertical, BsEmojiLaughing } from 'react-icons/bs'
import { AiOutlineCamera } from 'react-icons/ai'
import { IoMdPaperPlane } from 'react-icons/io'
import Avatar from '@mui/material/Avatar';
import InputBox from '../components/InputBox';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
const ChatBox = () => {
    return (
        <Div className="chatBox">
            <Div className="boxHeading">
                <Div className="chatInfo">
                    <Div className="chatImg">
                        <Avatar className="chatImg" alt="Iemy Sharp" src="/static/images/avatar/1.jpg" />
                    </Div>
                    <Div className="chatName">
                        <h3>Imran Ahammed</h3>
                        <span>Online</span>
                    </Div>
                </Div>
                <Div><BsThreeDotsVertical /></Div>
            </Div>

            <Div className="chatBody">
                <Div className="senderMsgBox">
                    <span>Sender Name</span>
                    <Div className="senderMsg">
                        <Div className="msg">
                            <p>Hello...</p>
                        </Div>
                    </Div>
                    <span>Just Now</span>
                </Div>


                <Div className="receverMsgBox">
                    <span>Sender Name</span>
                    <Div className="receverMsg">
                        <Div className="msg">
                            <p>How are you doing?</p>
                        </Div>
                    </Div>
                    <span>Just Now</span>
                </Div>

            </Div>

            <Div className="chatFooter">
                <Paper component="form" sx={{ p: '5px 5px', display: 'flex', alignItems: 'center', width: '100%' }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Type Your Massage"
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

                <Button variant="contained"><IoMdPaperPlane className='sendButton' /></Button>
            </Div>
        </Div>
    )
}

export default ChatBox