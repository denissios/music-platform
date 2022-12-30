import React, {FC} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/redux";
import {forgotPassword} from "../../store/actionCreators/common";
import validator from "validator";
import cl from "./AuthPage.module.css";
import {Field, Form} from "react-final-form";
import MyInput from "../../common/components/MyInput";
import {Text} from "../../common/components/Text";
import {Button, Switch} from "antd";
import {Link} from "react-router-dom";
import {setTheme} from "../../store/slices/commonSlice";

const ForgotPassword: FC = () => {
    const dispatch = useAppDispatch();
    const {theme} = useAppSelector(state => state.commonReducer);

    const submitForm = async (e: any) => {
        dispatch(forgotPassword(e.email));
    }

    const validateForm = (e: any) => {
        const errors = {email: ''};

        const email = e.email ?? '';

        if(!validator.isLength(email, {min: 4, max: 40}) || !validator.isEmail(email)) {
            errors.email = 'Некорректное название почты или ее длина (4 - 40 символов)';
        }

        if(!errors.email) {
            return {}
        }
        return errors;
    }

    return (
        <div className={cl.formWrapper}>
            <div className={cl.form}>
                <Text variant={"subheader1"}>Сброс пароля</Text>
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

                            <Button className={cl.button} onClick={handleSubmit}>
                                <Text variant={"body"} color={"white"}>Выслать ссылку для смены пароля</Text>
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

export default ForgotPassword;