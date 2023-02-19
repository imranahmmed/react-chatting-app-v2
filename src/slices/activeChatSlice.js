import { createSlice } from "@reduxjs/toolkit";

export const activeChatSlice = createSlice({
    name: 'activeChatUser',
    initialState: {
        activeChatUserInfo: null,
    },
    reducers: {
        activeChatUser: (state, action) => {
            state.activeChatUserInfo = action.payload
        }
    },
});

export const { activeChatUser } = activeChatSlice.actions

export default activeChatSlice.reducer