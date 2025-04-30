import { createSlice } from "@reduxjs/toolkit";

type User = {
    username: String;
    table: String;
}

const initialState: User = {
    username: "",
    table: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateName : (state,action) => {
            state.username = action.payload
        },
        updateTable: (state,action) => {
            state.table = action.payload
        }
    }
})

export const {updateName, updateTable} = userSlice.actions

export default userSlice.reducer