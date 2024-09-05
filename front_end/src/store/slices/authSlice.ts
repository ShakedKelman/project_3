import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../../model/UserModel";

// typing
interface AuthState {
    token: string | null;
    user: UserModel | null;    
}

// the state of the slicer
const initState: AuthState = {
    token: localStorage.getItem("token"),
    user: null,    
}

// update state.user if token exists
if (initState.token) {
    initState.user = (jwtDecode(initState.token) as { user: UserModel }).user;
}

// create slice (reducers of the state)
const authSlice = createSlice({
    name: "auth", // Moshe
    initialState: initState,
    reducers: {

        // login expect to get token as action.payload
        login: (oldState: AuthState, action: PayloadAction<string>) => {
            
            // save token to localStorage
            localStorage.setItem("token", action.payload);

            // save token into state
            oldState.token = action.payload;

            // extract user from token
            oldState.user = (jwtDecode(action.payload) as { user: UserModel }).user;
        },

        // register: same as login ..

        // logout - just remove data
        logout: (oldState: AuthState) => {            
            localStorage.removeItem("token");            
            oldState.user = null;
            oldState.token = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;