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
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

const regSubmitButton = styled(Button)({
    width: '100%',
    fontSize: 18,
    padding: '18px 12px',
    borderRadius: '8px',
    backgroundColor: '#5F35F5',
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
    width: '100%',
    padding: '14px 12px',
    borderRadius: '8px',
    backgroundColor: '#5F35F5',
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


const Registration = () => {
    const auth = getAuth();
    const db = getDatabase();
    const navigate = useNavigate();
    const userAuthData = useSelector(state => state)

    let [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: ""
    });
    let [formErrorMsg, setformErrorMsg] = useState({
        email: "",
        fullName: "",
        password: ""
    });

    let [showPass, setShowPass] = useState(false)
    let [loader, setLoader] = useState(false)

    // let [showSuccess, setShowSuccess] = useState(false)

    // Submit form Way 1
    // let handleForm = (e) => {
    //     e.target.name === 'email' && setFormData({ ...formData, email: e.target.value });
    //     e.target.name === 'fullName' && setFormData({ ...formData, fullName: e.target.value });
    //     e.target.name === 'password' && setFormData({ ...formData, password: e.target.value });
    //     console.log(formData);
    // }

    // Submit form Way 2
    // let handleForm = (e) => {
    //     if (e.target.name === 'email') {
    //         setFormData({ ...formData, email: e.target.value });
    //         console.log(formData);
    //     } else if (e.target.name === 'fullName') {
    //         setFormData({ ...formData, fullName: e.target.value });
    //         console.log(formData);
    //     } else {
    //         setFormData({ ...formData, password: e.target.value });
    //         console.log(formData);
    //     }
    // }

    // Submit form Way 3
    let handleForm = (e) => {
        let { name, value } = e.target
        setFormData({ ...formData, [name]: value });
        setformErrorMsg({ ...formErrorMsg, [name]: "" });
    }

    let handleClick = () => {
        setLoader(true);
        const validationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (formData.email === "") {
            setformErrorMsg({ ...formErrorMsg, email: "Email Required." })
            setLoader(false);
        } else if (!validationPattern.test(formData.email)) {
            setformErrorMsg({ ...formErrorMsg, email: "Valid Email Required." })
            setLoader(false);
        } else if (formData.fullName === "") {
            setformErrorMsg({ ...formErrorMsg, fullName: "Full Name Required." })
            setLoader(false);
        } else if (formData.password === "") {
            setformErrorMsg({ ...formErrorMsg, password: "Password Required." })
            setLoader(false);
        } else {
            createUserWithEmailAndPassword(auth, formData.email, formData.password).then((UserCredential) => {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log(UserCredential)
                        updateProfile(auth.currentUser, {
                            displayName: formData.fullName
                        }).then(() => {
                            // set(ref(db, 'users/' + UserCredential.user.uid), {
                            //     username: UserCredential.user.displayName,
                            //     email: UserCredential.user.email,
                            //     id: UserCredential.user.uid,
                            //     photoURL: UserCredential.user.photoURL
                            // });

                        }).then(() => {
                            toast.success("Registration complete. Please check your email.", {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setLoader(false);

                            setTimeout(() => {
                                navigate("/login")
                            }, 2000)
                        }).catch((error) => {
                            // An error occurred
                            // ...
                        });

                    })
            }).catch((error) => {
                const errorCode = error.code;
                if (errorCode.includes("auth/email-already-in-use")) {
                    setformErrorMsg({ ...formErrorMsg, email: "Email Already Exists." })
                    setLoader(false);
                }
            });
        }
    }

    useEffect(() => {
        if (userAuthData.authData.userInfo) {
            navigate("/pokpok/home")
        }
    }, [])


    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Div className="registrationLeftSide">
                    <Div>
                        <Header>
                            <Heading as="h2" className="regHeading" content="Get started with easily register" />
                            <p className='regSubHeading'>Free register and you can enjoy it</p>
                        </Header>
                        <Div className="registrationFormContainer">
                            <InputBox onChange={handleForm} className="regInput" label="Email Address" placeholder="yourmail@example.com" variant="outlined" type="email" name="email" value={formData.email} />
                            {formErrorMsg.email
                                &&
                                <Alert className='errorAlert' variant="filled" severity="error">
                                    {formErrorMsg.email}
                                </Alert>
                            }

                            <InputBox onChange={handleForm} className="regInput" label="Full name" placeholder="Enter Your Full Name" variant="outlined" type="text" name="fullName" value={formData.fullName} />
                            {formErrorMsg.fullName
                                &&
                                <Alert className='errorAlert' variant="filled" severity="error">
                                    {formErrorMsg.fullName}
                                </Alert>
                            }

                            <Div className="regInputContainer">
                                <InputBox onChange={handleForm} className="regInput" label="Password" placeholder="Enter Your Password" variant="outlined" type={showPass ? "text" : "password"} name="password" value="dfdfddf" />

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

                            {loader
                                ?
                                <CButton className="signupBtn" buttonType={loaderButton} >
                                    <ThreeDots
                                        height="40"
                                        width="40"
                                        radius="9"
                                        color="#fff"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName=""
                                        visible={true}
                                    />
                                </CButton>
                                :
                                <CButton onClick={handleClick} className="signupBtn" buttonType={regSubmitButton} >Sign up</CButton>

                            }

                            <AuthConfirmationLink className="regAuthLink" title="Already  have an account ?" href="/login" hrefTitle="Sign in" />
                        </Div>
                    </Div>
                </Div>
            </Grid>
            <Grid item xs={6}>
                <Img className='registrationImg' src="assets/images/01.jpg" />
            </Grid>
        </Grid>
    )
}

export default Registration