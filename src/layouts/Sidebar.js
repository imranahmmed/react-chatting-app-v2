import React, { useEffect, useState } from 'react'
import Div from '../components/Div'
import Img from '../components/Img'
import { AiOutlineLogout } from 'react-icons/ai'
import { GoHome } from 'react-icons/go'
import { BsFillChatDotsFill, BsFillGearFill } from 'react-icons/bs'
import { BiBell } from 'react-icons/bi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { activeUser } from '../slices/authSlice';
import { onlineChatUser } from '../slices/OnlineUserSlice'
import ImageUpload from '../components/ImageUpload'

import { getStorage, ref as ref_storage, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { getDatabase, ref as ref_database, update, remove, onValue } from "firebase/database";

const Sidebar = () => {
    const auth = getAuth();
    const db = getDatabase();
    const navigate = useNavigate();
    const userAuthData = useSelector(state => state)
    const dispatch = useDispatch()
    let uid = userAuthData.authData.userInfo.uid;
    let [modalOpen, setModalOpen] = useState(false);
    let [profile, setProfile] = useState("");
    let photoURL = profile;

    let handleModalOpen = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        if (!userAuthData.authData.userInfo) {
            navigate("/login")
        };
    }, []);

    useEffect(() => {
        const onlineUsersRef = ref_database(db, 'activeUsers/');
        onValue(onlineUsersRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                arr.push(item.val().id)
            });
            dispatch(onlineChatUser(arr))
        });
    }, [db])




    let handleLogOut = () => {
        signOut(auth).then(() => {
            dispatch(activeUser(null))
            localStorage.removeItem("userInfo")
            navigate("/login")

            remove(ref_database(db, 'activeUsers/' + uid),);
        }).catch((error) => {
            // An error happened.
        });
    }



    let handleRenderProfile = () => {
        const storage = getStorage();
        const storageRef = ref_storage(storage, `profile-pictures/${uid}`);
        getDownloadURL(storageRef).then((downloadURL) => {
            updateProfile(auth.currentUser, {
                photoURL: downloadURL
            }).then(() => {
                localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
                dispatch(activeUser(auth.currentUser));

                update(ref_database(db, 'users/' + auth.currentUser.uid), {
                    photoURL: downloadURL,
                }).then(() => {
                    console.log("update Hoicy")
                });

            })
        });
    }

    let handleModalClose = () => {
        setModalOpen(false);
    }

    // console.log(storageRef)
    // console.log(auth.currentUser);
    // console.log(userAuthData.authData.userInfo.photoURL);

    useEffect(() => {
        setProfile(userAuthData.authData.userInfo.photoURL)
    }, [userAuthData])

    return (
        <>
            <Div className="sidebarContainer">
                <Div className="sidebar">
                    <Div className="profileInfo">
                        <div className="profileImg">
                            {profile
                                ?
                                <Img src={profile} />
                                :
                                <Img src="../assets/images/08.png" />
                            }

                            <div className="profilePicEdit" onClick={handleModalOpen}>
                                <AiOutlineCloudUpload />
                            </div>
                        </div>
                        <h3>{userAuthData.authData.userInfo.displayName}</h3>
                    </Div>

                    <Div className="menus">
                        <div className="navLink">
                            <NavLink to="/pokpok/home">
                                <GoHome />
                            </NavLink>
                        </div>
                        <div className="navLink">
                            <NavLink to="/pokpok/message">
                                <BsFillChatDotsFill />
                            </NavLink>
                        </div>
                        <div className="navLink">
                            <NavLink to="/pokpok/notification">
                                <BiBell />
                            </NavLink>
                        </div>
                        <div className="navLink">
                            <NavLink to="/pokpok/setting">
                                <BsFillGearFill />
                            </NavLink>
                        </div>
                    </Div>

                    <Div className="logOut">
                        <div className="navLink" onClick={handleLogOut}>
                            <NavLink to="/login">
                                <AiOutlineLogout />
                            </NavLink>
                        </div>
                    </Div>
                </Div>
            </Div>

            <ImageUpload modalOpen={modalOpen} modalClose={handleModalClose} handleRenderProfile={handleRenderProfile} photoURL={photoURL} uid={uid} />

        </>
    )
}

export default Sidebar