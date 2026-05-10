import { createSlice } from "@reduxjs/toolkit";

const initialState={

    currentuser:null,
    error:false,
    loading:false,
};

const userSlice=createSlice({
    name:"user",           
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentuser=action.payload;
            state.loading =false;
            state.error=null;
        },
        signInFaluire:(state,action)=>{
             state.error=action.payload;
             state.loading=false;
        }
    }
})

export const {signInStart,signInSuccess,signInFaluire}=userSlice.actions;
export default userSlice.reducer;