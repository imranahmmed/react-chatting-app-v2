import React, { useState, useEffect } from 'react'
import Div from './Div';
import { ThreeDots } from 'react-loader-spinner';
import InputBox from '../components/InputBox'
// Matarial UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CButton from '../components/CButton'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { BsPatchCheckFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDatabase, set, ref, push, onValue, remove } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const GroupJoinRequest = ({ handleGroupReqModalClose, groupJoinReqModalOpen, groupJoinReqList }) => {
    const db = getDatabase()
    const data = useSelector(state => state);
    const loggedInUser = data.authData.userInfo && data.authData.userInfo.uid;
    const loggedInUserName = data.authData.userInfo && data.authData.userInfo.displayName;
    const loggedInUserEmail = data.authData.userInfo && data.authData.userInfo.email;
    const loggedInUserPhoto = data.authData.userInfo && data.authData.userInfo.photoURL;

    const styleModalBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "25%",
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '10px',
    };

    const submit = styled(Button)({
        fontSize: 14,
        padding: '5px 20px',
        borderRadius: '5px',
        backgroundColor: '#5F35F5',
        marginTop: "0px",
        marginBottom: "0px",
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    });

    const loaderButton = styled(Button)({
        width: '100px',
        backgroundColor: '#5F35F5',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: '#5F35F5',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: 'none',
        },
    });


    const cancle = styled(Button)({
        fontSize: 14,
        padding: '5px 20px',
        borderRadius: '5px',
        backgroundColor: '#e4e6eb',
        color: "#4b4f56",
        marginTop: "0px",
        marginBottom: "0px",
        '&:hover': {
            backgroundColor: '#e4e6eb',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    });



    const handleAcceptJoinRequest = (userInfo) => {
        set(push(ref(db, "groupMembers/" + userInfo.groupId)), {
            groupName: userInfo.groupName,
            groupId: userInfo.groupId,
            userName: userInfo.userName,
            userId: userInfo.userId,
            userPhoto: userInfo.userPhoto,
        }).then(() => {
            remove(ref(db, "groupJoinRequest/" + userInfo.id));
            toast.success(`You Accepeted ${userInfo.userName}'s Join Request to ${userInfo.groupName}.`);
            handleGroupReqModalClose()
        })
    }
    const handleRejectJoinRequest = (userInfo) => {
        remove(ref(db, "groupJoinRequest/" + userInfo.id))
    }





    return (
        <Modal open={groupJoinReqModalOpen} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={styleModalBox}>
                <Div className="modalHeader">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Group Join Requests
                    </Typography>
                </Div>

                <Div className="modalBody">
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {groupJoinReqList.length > 0
                            ?

                            groupJoinReqList.map((item, index) => (
                                <Div key={index}>
                                    <ListItem style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                            <Avatar alt={item.userName} src={item.userPhoto} />
                                            <Div>
                                                <h3>{item.userName}</h3>
                                                "Sent a Join Request"
                                            </Div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                            <Button onClick={() => handleAcceptJoinRequest(item)} style={{ fontSize: "20px", padding: "5px 5px", minWidth: "initial" }} variant="outlined" color="success"><BsPatchCheckFill /></Button>
                                            <Button onClick={() => handleRejectJoinRequest(item)} style={{ fontSize: "20px", padding: "5px 5px", minWidth: "initial" }} variant="outlined" color="error"><AiFillDelete /></Button>
                                        </div>
                                    </ListItem>
                                    <Divider component="li" />
                                </Div>
                            ))
                            :
                            <h3 style={{ color: "#222" }}>No Group Request Available</h3>
                        }
                    </List>
                </Div>
                <Div className="modalFooter">
                    <CButton onClick={handleGroupReqModalClose} buttonType={cancle}>Cancle</CButton>
                </Div>
            </Box>
        </Modal>
    )
}

export default GroupJoinRequest