import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentuser: null,
    error: false,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentuser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFaluire: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.currentuser = null 
            state.error = false
            state.loading = false
        },
        updateUserSuccess: (state, action) => {   
            state.currentuser = action.payload
        }
    }
})

export const { signInStart, signInSuccess, signInFaluire, logout, updateUserSuccess } = userSlice.actions  
export default userSlice.reducer;