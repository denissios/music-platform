import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import axios from "axios";
import toast from "react-hot-toast";
import {getCookie} from "../../common/utils";
import {IError} from "../types/error";
import {Mutex} from "async-mutex";

export const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use(config => {
    config.headers!.authorization = `Bearer ${getCookie('accessToken')}`;
    return config;
})

$api.interceptors.response.use(config => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            await axios.get(`${API_URL}/refresh`, {withCredentials: true});
            return $api.request(originalRequest);
        } catch (e) {
            console.log(e)
        }
    }
    throw error;
})

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set('Authorization', `Bearer ${getCookie('accessToken')}`);
        return headers;
    },
});

const mutex = new Mutex();
// @ts-ignore
const toastBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args, api, extraOptions: {
        loading: string | undefined,
        success: string | undefined,
        error: string | undefined,
    }
) => {
    await mutex.waitForUnlock();
    let t;
    if (extraOptions?.loading)
        t = toast.loading(extraOptions.loading);

    let res = await baseQuery(args, api, extraOptions);
    if(res?.error?.status === 401) {
        if(!mutex.isLocked()) {
            const release = await mutex.acquire();

            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh'
                },
                api,
                extraOptions);

            if (!refreshResult?.error) {
                res = await baseQuery(args, api, extraOptions);
            }
            release();
        } else {
            await mutex.waitForUnlock();
            res = await baseQuery(args, api, extraOptions);
        }
    }

    if (res.error) {
        const error: IError = res.error as IError;
        toast.error(error?.data?.message || extraOptions?.error || 'Ошибка при загрузке данных', {id: t});
    } else {
        if (extraOptions?.success)
            t = toast.success(extraOptions.success, {id: t});
    }

    return res;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: toastBaseQuery,
    tagTypes: ['SearchedTracks', 'ActiveTrack', 'FavouriteTracks', 'OwnersTracks', 'ImagesForTracks', 'Playlists', 'Playlist',
        'PlaylistImage', 'User', 'SearchedUsers', 'UserBan', 'UserRoles', 'Genres', 'AdminSearchedTracks'],
    endpoints: () => ({})
})