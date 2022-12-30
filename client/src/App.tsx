import React, {FC, useEffect, useRef} from 'react';
import './common/fonts/fonts.css';
import './antd.css';
import './App.css';
import {useAppDispatch, useAppSelector} from "./store/redux";
import {checkAuth} from "./store/actionCreators/common";
import AppRouter from "./common/components/AppRouter";
import "antd/dist/antd.min.css";
import toast from "react-hot-toast";
import {useNetwork} from "./common/hooks/useNetwork";

const App: FC = () => {
    const dispatch = useAppDispatch();
    const {theme} = useAppSelector(state => state.commonReducer);
    const calledOnce = useRef(false);
    const isOnline = useNetwork();

    useEffect(() => {
        if(!calledOnce.current) {
            calledOnce.current = true;
            dispatch(checkAuth());
        }
    }, [])

    useEffect(() => {
        if(!isOnline) {
            toast.error('Отсутсвует Интернет соединение');
        }
    }, [isOnline])

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme])

    return (
        <div className="App">
            <AppRouter/>
        </div>
    );
}

export default App;
