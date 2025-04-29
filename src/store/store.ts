import { configureStore } from "@reduxjs/toolkit";
import counterSlices from '@/features/counter/counterSlice'

export const store = configureStore({
    reducer: {
        counter: counterSlices
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>