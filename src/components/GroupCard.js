import React from 'react'
import CustomDropdown from './CustomDropdown'
import Div from './Div'
import Img from './Img'
import { useSelector, useDispatch } from 'react-redux';
import { activeChatUser } from '../slices/activeChatSlice';

const GroupCard = ({ data, activeUser, handleGroupReqModalOpen, handleGroupMembersModalOpen }) => {
    const { groupId, groupName, groupPhoto, groupTag } = data
    const dispatch = useDispatch()
    const onlineUsersData = useSelector(state => state);
    return (
        <Div className="user">
            <Div className="userInfo" onClick={() => dispatch(activeChatUser({ ...data, status: "groupMsg" }))}>
                <Div className="userImg">
                    {groupPhoto
                        ?
                        <Img src={groupPhoto} />
                        :
                        <Img src="../assets/images/08.png" />
                    }
                </Div>
                <Div className="userName">
                    <h3>{groupName}</h3>
                    <span>{groupTag}</span>
                </Div>
            </Div>

            <Div className="userActions">
                <CustomDropdown>
                    <ul>
                        <li onClick={() => handleGroupReqModalOpen(groupId)}>Member Request</li>
                        <li onClick={() => handleGroupMembersModalOpen(groupId)}>Group Members</li>
                    </ul>
                </CustomDropdown>
            </Div>
        </Div>
    )
}

export default GroupCard