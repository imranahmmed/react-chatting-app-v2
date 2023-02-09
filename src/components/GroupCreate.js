import React, { useState } from 'react'
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
import SelectBox from './SelectBox';
import AutoComplete from './AutoComplete';

const GroupCreate = ({ modalOpen, modalClose }) => {
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

    let [loader, setLoader] = useState(false)

    let [groupData, setGroupData] = useState({
        groupName: "",
        groupTag: "",
        groupMembers: "",
        groupStatus: "",

    })

    let handleChnage = (e) => {
        console.log(e.target.value)
    }


    return (
        <Modal
            open={modalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModalBox}>
                <Div className="modalHeader">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Group
                    </Typography>
                </Div>

                <Div className="modalBody">
                    <InputBox onChange={handleChnage} placeholder='Group Name' />
                    <InputBox onChange={handleChnage} placeholder='Group Tag' />
                    <InputBox onChange={handleChnage} placeholder='Add Members' />
                    <SelectBox onChange={handleChnage} label='Group Status' />
                    {/* <AutoComplete/> */}
                </Div>

                <Div className="modalFooter">
                    <CButton onClick={modalClose} buttonType={cancle}>Cancle</CButton>

                    <CButton buttonType={loaderButton} >
                        <ThreeDots
                            height="25"
                            width="25"
                            radius="9"
                            fontSize="24px"
                            color="#fff"
                            margin="0px"
                            padding="0px"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    </CButton>
                    <CButton buttonType={submit}>Save</CButton>
                </Div>
            </Box>
        </Modal>
    )
}

export default GroupCreate