import { configureStore } from "@reduxjs/toolkit";
import counterSlices from '@/features/counter/counterSlice'
import userSlices from '@/features/user/userSlice'
import cartSlices from "@/features/cart/cartSlice"
export const store = configureStore({
    reducer: {
        counter: counterSlices,
        users: userSlices,
        cart: cartSlices
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>