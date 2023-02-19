import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import activeChatSlice from './slices/activeChatSlice'

export default configureStore({
    reducer: {
        authData: authSlice,
        activeChatData : activeChatSlice,
    },
})