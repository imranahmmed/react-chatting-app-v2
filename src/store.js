import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import activeChatSlice from './slices/activeChatSlice'
import OnlineUserSlice from './slices/OnlineUserSlice'

export default configureStore({
    reducer: {
        authData: authSlice,
        activeChatData : activeChatSlice,
        onlineUsersData : OnlineUserSlice,
    },
})