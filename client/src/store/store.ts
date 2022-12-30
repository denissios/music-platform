import {combineReducers, configureStore} from "@reduxjs/toolkit";
import commonReducer from "./slices/commonSlice";
import {apiSlice} from "./api";
import playerReducer from './slices/playerSlice';

const rootReducer = combineReducers({
    commonReducer,
    playerReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    })
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];