import { CartItem } from "@/types/cart"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: CartItem[] = []

const cartSlices = createSlice({
    name: "cart",
    initialState,
    reducers : {
        addItem: (state,action: PayloadAction<CartItem>) => {
            console.log("payload",action.payload)
            state.push(action.payload)
        }
    }
})

export const {addItem} = cartSlices.actions

export default cartSlices.reducer