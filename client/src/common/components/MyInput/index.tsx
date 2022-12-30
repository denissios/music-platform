import React, {FC, useState} from 'react';
import cl from './MyInput.module.css'
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";

interface MyInputProps extends React.HTMLAttributes<HTMLElement> {
    type: string,
    label: string,
    disabled?: boolean,
    value?: string,
    setValue?: (value: string) => void,
    className?: string
}

const MyInput: FC<MyInputProps> = ({type, label, value, setValue, className, ...props}) => {
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [currentType, setCurrentType] = useState<string>(type);

    return (
        <div className={className}>
            <div className={cl.inputData}>
                <input
                    type={currentType}
                    className={cl.input}
                    value={value}
                    onChange={e => setValue && setValue(e.target.value)}
                    required
                    {...props}
                />
                {type === 'password' && (hidePassword
                    ? <EyeOutlined className={cl.eye} onClick={() => {setHidePassword(false); setCurrentType('text')}}/>
                    : <EyeInvisibleOutlined className={cl.eye} onClick={() => {setHidePassword(true); setCurrentType('password')}}/>)
                }
                <div className={cl.underline}/>
                <label className={cl.label}>{label}</label>
            </div>
        </div>
    );
};

export default MyInput;