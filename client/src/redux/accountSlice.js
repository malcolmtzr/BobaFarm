import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getWeb3 from '../getWeb3';

// export const getAccount = createAsyncThunk(
//     "account/getAccount",
//     async(thunkAPI) => {
//     }
// )

export const accountSlice = createSlice({
    name: "account", 
    initialState: {
        value: ""
    },
    reducers: {
        setAccount: (state, action) => {
            state.value = action.payload.account
        }
    },
    extraReducers: {

    }
});

export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;