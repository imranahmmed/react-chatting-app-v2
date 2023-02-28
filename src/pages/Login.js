import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Heading from '../components/Heading';
import Img from '../components/Img';
import Grid from '@mui/material/Grid';
import InputBox from '../components/InputBox';
import Div from '../components/Div';
import CButton from '../components/CButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AuthConfirmationLink from '../components/AuthConfirmationLink';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { activeUser } from '../slices/authSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getDatabase, ref, set } from "firebase/database";

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

const loginSubmitButton = styled(Button)({
    width: '100%',
    fontSize: 18,
    padding: '18px 12px',
    borderRadius: '8px',
    backgroundColor: '#5F35F5',
    marginTop: "50px",
    marginBottom: "20px",
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

const googleloginButton = styled(Button)({
    fontSize: 18,
    padding: '18px 50px',
    marginBottom: '50px',
    marginTop: '15px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#000',
    display: 'flex',
    gap: '10px',
    border: '1px solid',
    borderColor: 'transparent',
    '&:hover': {
        backgroundColor: 'transparent',
        borderColor: '#b8bacf',
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

const Login = () => {
    const auth = getAuth();
    const db = getDatabase();
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch();
    const userAuthData = useSelector(state => state);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        if (userAuthData.authData.userInfo) {
            navigate("/pokpok/home")
        }
    }, [])

    let [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    let [formErrorMsg, setformErrorMsg] = useState({
        email: "",
        password: ""
    });

    let [forgotPassEmail, setForgotPassEmail] = useState({
        email: "",
    });

    let [showPass, setShowPass] = useState(false)

    let handleForm = (e) => {
        let { name, value } = e.target
        setFormData({ ...formData, [name]: value });
        setformErrorMsg({ ...formErrorMsg, [name]: "" });
    }

    let handleForgotPass = (e) => {
        let { name, value } = e.target
        setForgotPassEmail({ ...forgotPassEmail, [name]: value });
    }

    let handleforgotPass = () => {
        sendPasswordResetEmail(auth, forgotPassEmail.email)
            .then(() => {
                toast.success('Reset Email Sent! Please Check Your Email.', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                handleClose()
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode.includes("auth/user-not-found")) {
                    toast.warn('User Not Found!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            });
    }



    let handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                set(ref(db, 'users/' + result.user.uid), {
                    username: result.user.displayName,
                    email: result.user.email,
                    id: result.user.uid,
                    photoURL: result.user.photoURL
                });
                // dispatch(activeUser(result.user));
                // localStorage.setItem("userInfo", JSON.stringify(result.user));
                dispatch(activeUser({
                    accessToken: result.user.accessToken,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                    phoneNumber: result.user.phoneNumber,
                }));
                localStorage.setItem("userInfo", JSON.stringify({
                    accessToken: result.user.accessToken,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                    phoneNumber: result.user.phoneNumber,
                }));
                set(ref(db, 'activeUsers/' + result.user.uid), {
                    id: result.user.uid,
                });
                navigate("/pokpok/home")
            })
    }


    let handleClick = () => {
        const validationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (formData.email === "") {
            setformErrorMsg({ ...formErrorMsg, email: "Email Required." })
        } else if (!validationPattern.test(formData.email)) {
            setformErrorMsg({ ...formErrorMsg, email: "Valid Email Required." })
        } else if (formData.password === "") {
            setformErrorMsg({ ...formErrorMsg, password: "Password Required." })
        } else {
            signInWithEmailAndPassword(auth, formData.email, formData.password)
                .then((userCredential) => {
                    dispatch(activeUser(userCredential.user));
                    localStorage.setItem("userInfo", JSON.stringify(userCredential.user));
                    navigate("/pokpok/home")

                    set(ref(db, 'activeUsers/' + userCredential.user.uid), {
                        id: userCredential.user.uid,
                    });


                    // if (userCredential.user.emailVerified) {
                    //     set(ref(db, 'users/' + userCredential.user.uid), {
                    //         username: userCredential.user.displayName,
                    //         email: userCredential.user.email,
                    //         id: userCredential.user.uid,
                    //         photoURL: userCredential.user.photoURL
                    //     });

                    //     dispatch(activeUser(userCredential.user));
                    //     localStorage.setItem("userInfo", JSON.stringify(userCredential.user));
                    //     navigate("/pokpok/home")

                    // } else {
                    //     toast.error('Please Verify your Email First.!', {
                    //         position: "top-right",
                    //         autoClose: 2000,
                    //         hideProgressBar: false,
                    //         closeOnClick: true,
                    //         pauseOnHover: true,
                    //         draggable: true,
                    //         progress: undefined,
                    //         theme: "light",
                    //     });
                    // }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode.includes("auth/wrong-password")) {
                        setformErrorMsg({ ...formErrorMsg, email: "Wrong Email." })
                        setformErrorMsg({ ...formErrorMsg, password: "Wrong password." })
                    } else if (errorCode.includes("auth/user-not-found")) {
                        toast.warn('User Not Found!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                });
        }

    }


    return (
        <Grid container spacing={2} columnSpacing={{ xs: 0 }}>
            <Grid item xs={6}>
                <Div className="registrationLeftSide">
                    <Div>
                        <Header>
                            <Heading as="h2" className="regHeading" content="Login to your account!" />
                            <CButton onClick={handleGoogleLogin} buttonType={googleloginButton} >
                                <Img src="assets/images/google.png" />
                                Login With Google
                            </CButton>
                        </Header>
                        <Div className="registrationFormContainer">
                            <InputBox className="regInput" onChange={handleForm} label="Email Address" placeholder="yourmail@example.com" variant="standard" type="email" name="email" />
                            {formErrorMsg.email
                                &&
                                <Alert className='errorAlert' variant="filled" severity="error">
                                    {formErrorMsg.email}
                                </Alert>
                            }
                            <Div className="regInputContainer">
                                <InputBox className="regInput" onChange={handleForm} label="Password" placeholder="Enter Your Password" variant="standard" type={showPass ? "text" : "password"} name="password" />
                                {showPass
                                    ?
                                    <AiFillEye onClick={() => setShowPass(false)} className='passEyeIcon passEyeIconShow' />
                                    :
                                    <AiFillEyeInvisible onClick={() => setShowPass(true)} className='passEyeIcon' />
                                }
                            </Div>

                            {formErrorMsg.password
                                &&
                                <Alert className='errorAlert' variant="filled" severity="error">
                                    {formErrorMsg.password}
                                </Alert>
                            }

                            <CButton onClick={handleClick} buttonType={loginSubmitButton}>Sign in</CButton>

                            <AuthConfirmationLink className="loginAuthLink" title="Don’t have an account ?" href="/signup" hrefTitle="Sign up" />
                            <AuthConfirmationLink onClick={handleOpen} className="forgottenPassword" href="#" hrefTitle="Forgotten password?" />
                        </Div>
                    </Div>
                </Div>
            </Grid>
            <Grid item xs={6}>
                <Img className='registrationImg' src="assets/images/04.jpg" />
            </Grid>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModalBox}>
                    <Div className="modalHeader">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Find Your Account
                        </Typography>
                    </Div>

                    <Div className="modalBody">
                        <Typography id="modal-modal-description">
                            Please enter your email address or mobile number to search for your account.
                        </Typography>

                        <InputBox type="email" onChange={handleForgotPass} className="w-full mt-20" label="Email Address" placeholder="yourmail@example.com" variant="standard" name="email" />
                    </Div>

                    <Div className="modalFooter">
                        <CButton onClick={handleClose} buttonType={cancle}>Cancle</CButton>
                        <CButton onClick={handleforgotPass} buttonType={submit}>Reset Password</CButton>
                    </Div>
                </Box>
            </Modal>
        </Grid>
    )
}

export default Login