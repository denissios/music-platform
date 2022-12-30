import React, {FC} from 'react';
import cl from './Preloader.module.css';
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

interface PreloaderProps {
    size?: number;
}

const Preloader: FC<PreloaderProps> = ({size}) => {
    return (
        <Spin className={cl.preloader} indicator={<LoadingOutlined style={{color: 'var(--color-purple', fontSize: size ? `${size}px` : '22px'}}/>}/>
    );
};

export default Preloader;