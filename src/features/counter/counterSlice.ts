import { CounterState } from "@/types/counter";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CounterState = {
    value: 0,
}

const counterSlices = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        }
    }
})

export const { increment } = counterSlices.actions

export default counterSlices.reducer