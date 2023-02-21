import { createSlice } from "@reduxjs/toolkit";

export const OnlineUserSlice = createSlice({
    name: 'onlineChatUser',
    initialState: {
        onlineChatUserInfo: null,
    },
    reducers: {
        onlineChatUser: (state, action) => {
            state.onlineChatUserInfo = action.payload
        }
    },
});

export const { onlineChatUser } = OnlineUserSlice.actions

export default OnlineUserSlice.reducer