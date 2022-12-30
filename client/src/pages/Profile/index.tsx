import React, {FC, useState} from 'react';
import cl from './Profile.module.css';
import {Text} from "../../common/components/Text";
import {Field, Form} from "react-final-form";
import validator from "validator";
import MyInput from "../../common/components/MyInput";
import {Button, Modal, Switch, Tooltip} from "antd";
import {useGetUserQuery, useSaveUserChangesMutation} from "../../store/api/user";
import {useAppDispatch, useAppSelector} from "../../store/redux";
import Preloader from "../../common/components/Preloader";
import AddIcon from '@mui/icons-material/Add';
import AddTrack from "./components/AddTrack";
import AudioTrackIcon from '@mui/icons-material/Audiotrack';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {Link} from "react-router-dom";
import {setTheme} from "../../store/slices/commonSlice";

const Profile: FC = () => {
    const dispatch = useAppDispatch();
    const {theme} = useAppSelector(state => state.commonReducer);
    const {roles} = useAppSelector(state => state.commonReducer);
    const [isVisibleAddTrackModal, setIsVisibleAddTrackModal] = useState<boolean>(false);
    const {userId} = useAppSelector(state => state.commonReducer);
    const {data: user, isLoading: isLoadingUser} = useGetUserQuery(userId);
    const [saveChanges, {isLoading: isLoadingSaveChanges}] = useSaveUserChangesMutation();

    const submitFormCommon = async (e: any) => {
        const changes = {
            email: e.email,
            name: e.name
        }
        if(!isLoadingSaveChanges) {
            saveChanges({id: userId, changes});
        }
    }
    const submitFormPassword = async (e: any) => {
        const changes = {
            oldPassword: e.oldPassword,
            password: e.newPassword
        }
        if(!isLoadingSaveChanges) {
            saveChanges({id: userId, changes});
        }
    }

    const validateFormCommon = (e: any) => {
        const errors = {email: '', name: ''};

        const email = e.email ?? '';
        const name = e.name ?? '';

        if(!validator.isLength(email, {min: 4, max: 40}) || !validator.isEmail(email)) {
            errors.email = 'Некорректное название почты или ее длина (4 - 40 символов)';
        }
        if(!validator.isLength(name, {min: 1, max: 16})) {
            errors.name = 'Некорректное название почты или ее длина (1 - 16 символов)';
        }

        if(!errors.email && !errors.name) {
            return {}
        }
        return errors;
    }
    const validateFormPassword = (e: any) => {
        const errors = {oldPassword: '', newPassword: ''};

        const newPassword = e.newPassword ?? '';
        const oldPassword = e.oldPassword ?? '';

        if(!validator.isLength(oldPassword, {min: 4, max: 16})) {
            errors.oldPassword = 'Длина пароля может быть от 4 до 16 символов';
        }
        if(!validator.isLength(newPassword, {min: 4, max: 16})) {
            errors.newPassword = 'Длина пароля может быть от 4 до 16 символов';
        }

        if(!errors.newPassword && !errors.oldPassword) {
            return {}
        }
        return errors;
    }

    const addTrackHandler = (e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisibleAddTrackModal(true);
    }

    return (
        <div className={cl.profileWrapper}>
            <Text variant={"header"}>Личный кабинет</Text>

            <Link to={`/owner-tracks/${userId}`}>
                <div className={cl.subheaderWrapper}>
                    <div className={cl.subheaderIconWrapper}>
                        <AudioTrackIcon className={cl.subheaderIcon}/>
                    </div>
                    <Text className={cl.subheader} variant={"subheader2"} color={"primary"}>Мои собственные треки</Text>
                    <Tooltip title={'Добавить собственный трек'}>
                        <AddIcon className={cl.addTrack} onClick={addTrackHandler}/>
                    </Tooltip>
                </div>
            </Link>

            {roles.includes('ADMIN') &&
                <Link to={'/admin'}>
                    <div className={cl.subheaderWrapper}>
                        <AdminPanelSettingsOutlinedIcon className={cl.subheaderIcon}/>
                        <Text className={cl.subheader} variant={"subheader2"} color={"primary"}>Админ панель</Text>
                    </div>
                </Link>
            }

            {!isLoadingUser
                ?   <>
                        <div className={cl.form}>
                            <Form
                                onSubmit={submitFormCommon}
                                validate={validateFormCommon}
                                initialValues={{email: user?.email, name: user?.name}}
                                render={({handleSubmit}) =>
                                    <>
                                        <Field
                                            name="email"
                                            render={({ input, meta }) => (
                                                <>
                                                    <MyInput className={cl.input} type={"text"} label={'Почта'} {...input}/>
                                                    {meta.touched && meta.error &&
                                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                                    }
                                                </>
                                            )}
                                        />
                                        {!user?.isActivated && <Text variant={"small"} color={"red"} as={'div'}>Ваша почта не активирована!</Text>}

                                        <Field
                                            name="name"
                                            render={({ input, meta }) => (
                                                <>
                                                    <MyInput className={cl.input} type={'text'} label={'Имя'} {...input}/>
                                                    {meta.touched && meta.error &&
                                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                                    }
                                                </>
                                            )}
                                        />

                                        <Button className={cl.button} onClick={handleSubmit}>
                                            <Text variant={"body"} color={"white"}>Сохранить изменения</Text>
                                        </Button>
                                    </>
                                }
                            />
                        </div>
                        <div className={cl.form}>
                            <Form
                                onSubmit={submitFormPassword}
                                validate={validateFormPassword}
                                render={({handleSubmit}) =>
                                    <>
                                        <Field
                                            name="oldPassword"
                                            render={({ input, meta }) => (
                                                <>
                                                    <MyInput className={cl.input} type={"password"} label={'Старый пароль'} {...input}/>
                                                    {meta.touched && meta.error &&
                                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                                    }
                                                </>
                                            )}
                                        />

                                        <Field
                                            name="newPassword"
                                            render={({ input, meta }) => (
                                                <>
                                                    <MyInput className={cl.input} type={'password'} label={'Новый пароль'} {...input}/>
                                                    {meta.touched && meta.error &&
                                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                                    }
                                                </>
                                            )}
                                        />

                                        <Button className={cl.button} onClick={handleSubmit}>
                                            <Text variant={"body"} color={"white"}>Изменить пароль</Text>
                                        </Button>
                                    </>
                                }
                            />
                        </div>
                    </>
                :   <div>
                        <Preloader size={35}/>
                    </div>
            }

            <div className={cl.switchThemeWrapper}>
                <Switch defaultChecked={theme === 'dark'} onChange={() => dispatch(setTheme())}/>
                <Text className={cl.switchThemeText} variant={"body"} color={"primary"}>{theme === 'light' ? 'Светлая' : 'Темная'} тема</Text>
            </div>

            <Modal
                title={<Text variant={"subheader1"} color={"primary"}>Создание трека</Text>}
                footer={null}
                open={isVisibleAddTrackModal}
                onCancel={() => setIsVisibleAddTrackModal(false)}
            >
                <AddTrack setVisibleModal={setIsVisibleAddTrackModal}/>
            </Modal>
        </div>
    );
};

export default Profile;