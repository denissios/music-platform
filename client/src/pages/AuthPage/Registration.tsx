import React, {FC} from 'react';
import cl from "./AuthPage.module.css";
import MyInput from "../../common/components/MyInput";
import {Button, Switch} from "antd";
import {useAppDispatch, useAppSelector} from "../../store/redux";
import {registration} from "../../store/actionCreators/common";
import {Text} from "../../common/components/Text";
import {Link} from "react-router-dom";
import {Field, Form} from "react-final-form";
import validator from "validator";
import {setTheme} from "../../store/slices/commonSlice";

const Registration: FC = () => {
    const dispatch = useAppDispatch();
    const {isLoadingLogReg, theme} = useAppSelector(state => state.commonReducer);

    const submitForm = async (e: any) => {
        if(!isLoadingLogReg) {
            dispatch(registration({email: e.email, password: e.password, name: e.name}));
        }
    }

    const validateForm = (e: any) => {
        const errors = {email: '', password: '', repeatPassword: '', name: ''};

        const email = e.email ?? '';
        const password = e.password ?? '';
        const repeatPassword = e.repeatPassword ?? '';
        const name = e.name ?? '';

        if(!validator.isLength(email, {min: 4, max: 40}) || !validator.isEmail(email)) {
            errors.email = 'Некорректное название почты или ее длина (4 - 40 символов)';
        }
        if(!validator.isLength(password, {min: 4, max: 16})) {
            errors.password = 'Длина пароля может быть от 4 до 16 символов';
        }
        if(password.localeCompare(repeatPassword)) {
            errors.repeatPassword = 'Пароли не одинаковые!';
        }
        if(!validator.isLength(name, {min: 1, max: 16})) {
            errors.name = 'Длина имени может быть от 1 до 16 символов';
        }

        if(!errors.email && !errors.password && !errors.repeatPassword && !errors.name) {
            return {}
        }
        return errors;
    }

    return (
        <div className={cl.formWrapper}>
            <div className={cl.form}>
                <Text variant={"subheader1"}>Регистрация</Text>
                <Form
                    onSubmit={submitForm}
                    validate={validateForm}
                    render={({handleSubmit}) => (
                        <>
                            <Field
                                name="email"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={"text"} label={'Почта'} {...input}/>
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />

                            <Field
                                name="password"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={'password'} label={'Пароль'} {...input}/>
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />
                            <Field
                                name="repeatPassword"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={'password'} label={'Повторите пароль'} {...input}/>
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />

                            <Field
                                name="name"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={'text'} label={'Имя'} {...input}/>
                                        {meta.touched && meta.error && <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>}
                                    </>
                                )}
                            />

                            <Button className={cl.button} onClick={handleSubmit}>
                                <Text variant={"body"} color={"white"}>Зарегистрироваться</Text>
                            </Button>
                        </>
                    )}
                />
                <Text variant={"small"} color={"grey"}>Есть аккаунт? </Text>
                <Link to={'/login'}>
                    <Text variant={"small"} color={"purple"}>Войти</Text>
                </Link>

                <div className={cl.switchThemeWrapper}>
                    <Text variant={"small"} color={"grey"}>Переключить тему</Text>
                    <Switch defaultChecked={theme === 'dark'} className={cl.switchTheme} onChange={() => dispatch(setTheme())}/>
                </div>
            </div>
        </div>
    );
};

export default Registration;