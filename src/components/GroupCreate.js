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
import { v4 as uuidv4 } from 'uuid';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDatabase, set, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
const GroupCreate = ({ modalOpen, modalClose }) => {
    const db = getDatabase()
    const data = useSelector(state => state);
    const loggedinUser = data.authData.userInfo.uid;
    const loggedinUserName = data.authData.userInfo.displayName;
    const loggedinUserEmail = data.authData.userInfo.email;
    const loggedinUserPhoto = data.authData.userInfo.photoURL;

    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("");
    const [cropper, setCropper] = useState();

    let [loader, setLoader] = useState(false);
    let [groupData, setGroupData] = useState({
        groupName: "",
        groupTag: "",
        groupPhoto: "",
    });




    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            const storage = getStorage();
            const coverStorage = storageRef(storage, `group-dp-image/ ${loggedinUser + loggedinUserName} / ${uuidv4()}`);
            const groupdp = cropper.getCroppedCanvas().toDataURL();
            uploadString(coverStorage, groupdp, 'data_url').then((snapshot) => {
                getDownloadURL(coverStorage).then((downloadURL) => {
                    setGroupData({ ...groupData, groupPhoto: downloadURL })
                })
            });

        }
    };

    let handleGroupCreateChange = (e) => {
        let { name, value } = e.target
        setGroupData({ ...groupData, [name]: value })
    }

    let handleGroupCreate = () => {
        setLoader(true)
        set(push(ref(db, 'groups')), {
            groupName: groupData.groupName,
            groupTag: groupData.groupTag,
            groupPhoto: groupData.groupPhoto,
            adminId: loggedinUser,
            adminName: loggedinUserName,
            adminEmail: loggedinUserEmail,
            adminPhoto: loggedinUserPhoto,
        }).then(() => {
            toast.success("Group Greated", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }).then(() => {
            setLoader(false)
            setImage("");
            setCropData("");
            setCropper("");
            modalClose()
            setGroupData({
                groupName: "",
                groupTag: "",
                groupImage: "",
            })
        })
    }

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
                    <InputBox type='text' name='groupName' onChange={handleGroupCreateChange} placeholder='Group Name' />
                    <InputBox type='text' name='groupTag' onChange={handleGroupCreateChange} placeholder='Group Tag' />
                    <InputBox type='file' name='groupImage' onChange={onChange} />

                    {image &&
                        <>
                            <Div className='imagePreviewBox'>
                                <div className="img-preview" style={{ width: "100px", height: "100px" }} />
                            </Div>

                            <Cropper
                                style={{ height: 400, width: "100%" }}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                guides={true}
                            />
                            <CButton onClick={getCropData} buttonType={submit}>Crop Image</CButton>
                        </>
                    }









                    {/* <InputBox onChange={handleGroupCreateChange} placeholder='Add Members' /> */}
                    {/* <SelectBox onChange={handleGroupCreateChange} label='Group Status' /> */}
                    {/* <AutoComplete/> */}
                </Div>

                <Div className="modalFooter">
                    <CButton onClick={modalClose} buttonType={cancle}>Cancle</CButton>
                    {groupData.groupPhoto
                        ?
                        loader
                            ?
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
                            :
                            <CButton onClick={handleGroupCreate} buttonType={submit}>Save</CButton>

                        :
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
                    }
                </Div>
            </Box>
        </Modal>
    )
}

export default GroupCreate