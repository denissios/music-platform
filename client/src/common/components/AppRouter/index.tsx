import React, {FC} from 'react';
import {createPortal} from "react-dom";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "../../../pages/AuthPage/Login";
import {useAppSelector} from "../../../store/redux";
import Registration from "../../../pages/AuthPage/Registration";
import MainPage from "../../../pages/MainPage";
import ForgotPassword from "../../../pages/AuthPage/ForgotPassword";
import ResetPassword from "../../../pages/AuthPage/ResetPassword";
import Playlist from "../../../pages/Playlist";
import FavouriteTracks from "../../../pages/FavouriteTracks";
import Profile from "../../../pages/Profile";
import OwnerTracks from "../../../pages/OwnerTracks";
import AdminPanel from "../../../pages/AdminPanel";

const AppRouter: FC = () => {
    const {isAuth, isLoadingAuth, roles} = useAppSelector(state => state.commonReducer);

    if(isLoadingAuth) {
        return (
            <></>
        );
    }

    return createPortal(
        <BrowserRouter>
            {isAuth
                ?   <Routes>
                        <Route path="/" element={<MainPage/>}>
                            <Route path="/" element={<FavouriteTracks/>}/>
                            <Route path="/playlist/:id" element={<Playlist/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/owner-tracks/:id" element={<OwnerTracks/>}/>
                            {roles.includes('ADMIN') && <Route path="/admin" element={<AdminPanel/>}/>}
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                :   <Routes>
                        <Route path="login" element={<Login/>}/>
                        <Route path="registration" element={<Registration/>}/>
                        <Route path="forgot" element={<ForgotPassword/>}/>
                        <Route path="reset-password/:id/:token" element={<ResetPassword/>}/>
                        <Route path="*" element={<Navigate to="/login" replace/>} />
                    </Routes>
            }
        </BrowserRouter>,
        document.body,
    );
};

export default AppRouter;