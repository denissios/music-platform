import React, {FC} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/redux";
import {login} from "../../store/actionCreators/common";
import cl from './AuthPage.module.css';
import MyInput from "../../common/components/MyInput";
import {Button, Switch} from "antd";
import {Text} from "../../common/components/Text";
import {Link} from "react-router-dom";
import {Form, Field} from 'react-final-form';
import validator from 'validator';
import {setTheme} from "../../store/slices/commonSlice";

const Login: FC = () => {
    const dispatch = useAppDispatch();
    const {isLoadingLogReg, theme} = useAppSelector(state => state.commonReducer);

    const submitForm = async (e: any) => {
        if(!isLoadingLogReg) {
            dispatch(login({email: e.email, password: e.password}))
        }
    }

    const validateForm = (e: any) => {
        const errors = {email: '', password: ''};

        const email = e.email ?? '';
        const password = e.password ?? '';

        if(!validator.isLength(email, {min: 4, max: 40}) || !validator.isEmail(email)) {
            errors.email = 'Некорректное название почты или ее длина (4 - 40 символов)';
        }
        if(!validator.isLength(password, {min: 4, max: 16})) {
            errors.password = 'Длина пароля может быть от 4 до 16 символов';
        }

        if(!errors.email && !errors.password) {
            return {}
        }
        return errors;
    }

    return (
        <div className={cl.formWrapper}>
            <div className={cl.form}>
                <Text variant={"subheader1"}>Авторизация</Text>
                <Form
                    onSubmit={submitForm}
                    validate={validateForm}
                    render={({handleSubmit}) => (
                        <>
                            <Field
                                name="email"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput
                                            className={cl.input}
                                            type={"text"} label={'Почта'}
                                            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                                            {...input}
                                        />
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />

                            <Field
                                name="password"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput
                                            className={cl.input}
                                            type={'password'}
                                            label={'Пароль'}
                                            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                                            {...input}
                                        />
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />

                            <Button className={cl.button} onClick={handleSubmit}>
                                <Text variant={"body"} color={"white"}>Войти</Text>
                            </Button>
                        </>
                    )}
                />
                <div style={{marginBottom: '15px'}}>
                    <Text variant={"small"} color={"grey"}>Нет аккаунта? </Text>
                    <Link to={'/registration'}>
                        <Text variant={"small"} color={"purple"}>Зарегистрироваться</Text>
                    </Link>
                </div>
                <div>
                    <Text variant={"small"} color={"grey"} >Забыли пароль? </Text>
                    <Link to={'/forgot'}>
                        <Text variant={"small"} color={"purple"}>Восстановить</Text>
                    </Link>
                </div>

                <div className={cl.switchThemeWrapper}>
                    <Text variant={"small"} color={"grey"}>Переключить тему</Text>
                    <Switch defaultChecked={theme === 'dark'} className={cl.switchTheme} onChange={() => dispatch(setTheme())}/>
                </div>
            </div>
        </div>
    );
};

export default Login;