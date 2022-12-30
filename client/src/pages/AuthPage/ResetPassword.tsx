import React, {FC} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/redux";
import {resetPassword} from "../../store/actionCreators/common";
import validator from "validator";
import cl from "./AuthPage.module.css";
import {Field, Form} from "react-final-form";
import MyInput from "../../common/components/MyInput";
import {Text} from "../../common/components/Text";
import {Button, Switch} from "antd";
import {Link, useParams} from "react-router-dom";
import {setTheme} from "../../store/slices/commonSlice";

const ResetPassword: FC = () => {
    const dispatch = useAppDispatch();
    const {theme} = useAppSelector(state => state.commonReducer);
    const {id, token} = useParams();

    const submitForm = async (e: any) => {
        dispatch(resetPassword({id, token, password: e.password}));
    }

    const validateForm = (e: any) => {
        const errors = {repeatPassword: '', password: ''};

        const password = e.password ?? '';
        const repeatPassword = e.repeatPassword ?? '';

        if(!validator.isLength(password, {min: 4, max: 16})) {
            errors.password = 'Длина пароля может быть от 4 до 16 символов';
        }
        if(password.localeCompare(repeatPassword)) {
            errors.repeatPassword = 'Пароли не одинаковые!';
        }

        if(!errors.repeatPassword && !errors.password) {
            return {}
        }
        return errors;
    }

    return (
        <div className={cl.formWrapper}>
            <div className={cl.form}>
                <Text variant={"subheader1"}>Смена пароля</Text>
                <Form
                    onSubmit={submitForm}
                    validate={validateForm}
                    initialValues={{email: '', password: ''}}
                    render={({handleSubmit}) => (
                        <>
                            <Field
                                name="password"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={"password"} label={'Новый пароль'} {...input}/>
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

                            <Button className={cl.button} onClick={handleSubmit}>
                                <Text variant={"body"} color={"white"}>Сменить пароль</Text>
                            </Button>
                        </>
                    )}
                />
                <Link to={'/login'}>
                    <Text variant={"small"} color={"purple"}>Вернуться на страницу авторизации</Text>
                </Link>

                <div className={cl.switchThemeWrapper}>
                    <Text variant={"small"} color={"grey"}>Переключить тему</Text>
                    <Switch defaultChecked={theme === 'dark'} className={cl.switchTheme} onChange={() => dispatch(setTheme())}/>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;