import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'authUser',
    initialState: {
        userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
    },
    reducers: {
        activeUser: (state, action) => {
            state.userInfo = action.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const { activeUser } = authSlice.actions

export default authSlice.reducer