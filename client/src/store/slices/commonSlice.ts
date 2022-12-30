import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkAuth, login, logout, registration} from "../actionCreators/common";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import {getCookie, getTheme} from "../../common/utils";
import {IJwtUser} from "../types/user";

interface ICommonSlice {
    isLoadingAuth: boolean,
    isLoadingLogReg: boolean,
    isAuth: boolean,
    userId: string,
    name: string,
    roles: string[],
    theme: string,
    isOpenSidebar: boolean
}

const initialState: ICommonSlice = {
    isLoadingAuth: true,
    isLoadingLogReg: false,
    isAuth: false,
    userId: '',
    name: '',
    roles: [],
    theme: getTheme(),
    isOpenSidebar: false
}

const commonSlice = createSlice({
    name: 'commonSLice',
    initialState,
    reducers: {
        setTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        openSidebar: (state) => {
            state.isOpenSidebar = true;
        },
        closeSidebar: (state) => {
            state.isOpenSidebar = false;
        },
    },
    extraReducers: {
        [login.pending.type]: (state) => {
            state.isLoadingLogReg = true;
        },
        [login.fulfilled.type]: (state) => {
            state.isLoadingLogReg = false;
            state.isAuth = true;
            const user: IJwtUser = jwtDecode(getCookie('accessToken'));
            state.name = user.name;
            state.userId = user.id;
            state.roles = user.roles.map(r => r.name);
        },
        [login.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoadingLogReg = false;
            state.isAuth = false;
            state.roles = [];
            state.name = '';
        },

        [registration.pending.type]: (state) => {
            state.isLoadingLogReg = true;
        },
        [registration.fulfilled.type]: (state) => {
            state.isLoadingLogReg = false;
            state.isAuth = true;
            const user: IJwtUser = jwtDecode(getCookie('accessToken'));
            state.name = user.name;
            state.userId = user.id;
            state.roles = user.roles.map(r => r.name);
        },
        [registration.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoadingLogReg = false;
            state.isAuth = false;
            state.roles = [];
            state.name = '';
        },

        [logout.fulfilled.type]: (state) => {
            state.isAuth = false;
            state.roles = [];
            state.name = '';
            state.userId = '';
        },
        [logout.rejected.type]: (state, action: PayloadAction<string>) => {
            toast.error(action.payload);
        },

        [checkAuth.pending.type]: (state) => {
            state.isLoadingAuth = true;
        },
        [checkAuth.fulfilled.type]: (state) => {
            state.isLoadingAuth = false;
            state.isAuth = true;
            const user: IJwtUser = jwtDecode(getCookie('accessToken'));
            state.name = user.name;
            state.userId = user.id;
            state.roles = user.roles.map(r => r.name);
        },
        [checkAuth.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoadingAuth = false;
            state.isAuth = false;
            state.roles = [];
            state.name = '';
            //toast.error(action.payload);
        }
    }
})

export const { setTheme, openSidebar, closeSidebar } = commonSlice.actions;
export default commonSlice.reducer;