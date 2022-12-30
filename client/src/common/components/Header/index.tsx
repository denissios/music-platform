import React, {ChangeEvent, FC} from 'react';
import cl from './Header.module.css'
import {useAppDispatch, useAppSelector} from "../../../store/redux";
import {logout} from "../../../store/actionCreators/common";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Player from "./components/Player";
import {Tooltip} from "antd";
import {Link} from "react-router-dom";
import {useScreenWidth} from "../../hooks/useScreenWidth";
import MenuIcon from '@mui/icons-material/Menu';
import {openSidebar} from "../../../store/slices/commonSlice";
import InputVolume from "./components/InputVolume";
import {setVolume} from "../../../store/slices/playerSlice";

const Header: FC = () => {
    const dispatch = useAppDispatch();
    const screenWidth = useScreenWidth();
    const {audio, volume} = useAppSelector(state => state.playerReducer);

    const logoutHandler = () => {
        dispatch(logout())
            .unwrap()
            .then(() => window.location.reload());
    }

    const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100;
        dispatch(setVolume(Number(e.target.value)));
    }

    return (
        <div className={cl.headerWrapper}>
            {screenWidth <= 992 && <MenuIcon className={cl.burgerIcon} onClick={() => dispatch(openSidebar())}/>}
            {screenWidth > 992 && <Player/>}
            {screenWidth <= 992 &&
                <div className={cl.volumeWrapper}>
                    <InputVolume max={100} current={volume} onChange={changeVolume}/>
                </div>
            }
            <Tooltip title='Личный кабинет'>
                <Link to={'/profile'} className={cl.iconWrapper}>
                    <AccountCircleOutlinedIcon className={cl.icon}/>
                </Link>
            </Tooltip>
            <Tooltip title='Выйти'>
                <LogoutIcon className={cl.icon} onClick={logoutHandler}/>
            </Tooltip>
        </div>
    );
};

export default Header;