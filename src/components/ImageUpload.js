import React, { useState } from 'react'
import Div from './Div';
import Img from './Img';
import { ThreeDots } from 'react-loader-spinner';

// React Cropper
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
// Matarial UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CButton from '../components/CButton'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// Firebase Storage
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const ImageUpload = ({ modalOpen, modalClose, handleRenderProfile, photoURL, uid }) => {
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

    const defaultSrc =
        "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
    const [image, setImage] = useState();
    const [cropData, setCropData] = useState();
    const [cropper, setCropper] = useState();
    let [loader, setLoader] = useState(false)

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

    const handleUploadProfilePic = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            setLoader(true)
            const storage = getStorage();
            const storageRef = ref(storage, `profile-pictures/${uid}`);
            const message4 = cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                modalClose();
                setImage("")
                setLoader(false)
                getDownloadURL(storageRef).then((downloadURL) => {
                    handleRenderProfile()
                });
            });
        }
    };


    return (
        <Modal
            open={modalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModalBox}>
                <Div className="modalHeader">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Change Your Profile Picture
                    </Typography>
                </Div>

                <Div className="modalBody">
                    {image
                        ?
                        <div style={{ width: "100px", margin: "auto", height: "100px", overflow: "hidden", borderRadius: "50%" }}>
                            <div className="img-preview" style={{ width: "100%", height: "100%" }} />
                        </div>
                        :
                        photoURL
                            ?
                            <Img style={{ width: "100px", margin: "auto", height: "100px", overflow: "hidden", borderRadius: "50%" }} src={photoURL} />
                            :
                            <Img style={{ width: "100px", margin: "auto", height: "100px", overflow: "hidden", borderRadius: "50%" }} src="../assets/images/08.png" />
                    }

                    <input type="file" onChange={onChange} />

                    {image &&
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
                            checkOrientation={false}
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                            guides={true}
                        />
                    }
                </Div>

                <Div className="modalFooter">
                    <CButton onClick={modalClose} buttonType={cancle}>Cancle</CButton>
                    {loader
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
                        <CButton onClick={handleUploadProfilePic} buttonType={submit}>Upload</CButton>
                    }
                </Div>
            </Box>
        </Modal>
    )
}

export default ImageUpload