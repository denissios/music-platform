import {createAsyncThunk} from "@reduxjs/toolkit";
import {$api, API_URL} from "../api";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";

export const login = createAsyncThunk(
    'common/login',
    async({email, password}: {email: string, password: string}, ThunkApi) => {
        try {
            const response = await toast.promise($api.post(`${API_URL}/auth/login`, {email, password}), {
                loading: '',
                success: 'Успешно!',
                error: error => `${error.response?.data?.message}`
            });
            return response.data;
        } catch (e) {
            return ThunkApi.rejectWithValue(e);
        }
    }
)

export const registration = createAsyncThunk(
    'common/registration',
    async({email, password, name}: {email: string, password: string, name: string}, ThunkApi) => {
        try {
            const response = await toast.promise($api.post(`${API_URL}/auth/registration`, {email, password, name}), {
                loading: '',
                success: 'Успешно!',
                error: error => `${error.response?.data?.message}`
            });
            return response.data;
        } catch (e) {
            return ThunkApi.rejectWithValue(e);
        }
    }
)

export const logout = createAsyncThunk(
    'common/logout',
    async(_, ThunkApi) => {
        try {
            await $api.post(`${API_URL}/auth/logout`);
        } catch (e) {
            //console.log(e)
            return ThunkApi.rejectWithValue(e);
        }
    }
)

export const checkAuth = createAsyncThunk(
    'common/checkAuth',
    async(_, ThunkApi) => {
        try {
            const response = await axios.get(`${API_URL}/auth/refresh`, {withCredentials: true});
            return response.data;
        } catch (e) {
            //console.log(e)
            return ThunkApi.rejectWithValue(e);
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'common/forgotPassword',
    async(email: string, ThunkApi) => {
        try {
            const response = await toast.promise(axios.post(`${API_URL}/auth/forgot`, {email}, {withCredentials: true}), {
                loading: '',
                success: 'Ссылка выслана Вам нам почту!',
                error: error => `${error.response?.data?.message}`
            });

            return response.data;
        } catch (e) {
            return ThunkApi.rejectWithValue(e);
        }
    }
)

export const resetPassword = createAsyncThunk(
    'common/resetPassword',
    async({id, token, password}: {id: string | undefined, token: string | undefined, password: string}, ThunkApi) => {
        try {
            const response = await toast.promise(axios.patch(`${API_URL}/user/reset-password/${id}/${token}`, {password}, {withCredentials: true}), {
                loading: '',
                success: 'Пароль успешно изменен!',
                error: error => `${error.response?.data?.message}`
            });

            return response.data;
        } catch (e) {
            return ThunkApi.rejectWithValue(e);
        }
    }
)