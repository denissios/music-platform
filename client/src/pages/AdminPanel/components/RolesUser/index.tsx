import React, {FC} from 'react';
import cl from './RolesUser.module.css';
import {Text} from "../../../../common/components/Text";
import validator from "validator";
import {useAddRoleUserMutation, useGetRolesForUserQuery} from "../../../../store/api/user";
import {ISearchedUser} from "../../../../store/types/user";
import Preloader from "../../../../common/components/Preloader";
import {Field, Form} from "react-final-form";
import MyInput from "../../../../common/components/MyInput";
import {Button} from "antd";

interface RolesUserProps {
    user: ISearchedUser,
    setIsVisibleModal: (value: boolean) => void
}

const RolesUser: FC<RolesUserProps> = ({user, setIsVisibleModal}) => {
    const {data: userRoles, isLoading: isLoadingUserRoles} = useGetRolesForUserQuery(user._id);
    const [addRole, {isLoading: isLoadingAddRole}] = useAddRoleUserMutation();

    const submitForm = (e: any) => {
        if(!isLoadingAddRole) {
            addRole({userId: user._id, roleName: e.roleName})
                .unwrap()
                .then(() => setIsVisibleModal(false))
                .catch(e => console.log(e));
        }
    }

    const validateForm = (e: any) => {
        const errors = {roleName: ''};

        const roleName = e.roleName ?? '';

        if(!validator.isLength(roleName, {min: 1, max: 30})) {
            errors.roleName = 'Длина названия может быть от 1 до 30 символов';
        }

        if(!errors.roleName) {
            return {}
        }
        return errors;
    }

    return (
        <div>
            <div>
                <Text variant={"body"} color={'primary'}>
                    Текущие роли: {!isLoadingUserRoles ? userRoles?.map((r, i) => r.name + (i === userRoles.length - 1 ? '' : ', ')) : <Preloader/>}
                </Text>

                <Form
                    onSubmit={submitForm}
                    validate={validateForm}
                    render={({handleSubmit}) =>
                        <>
                            <Field
                                name="roleName"
                                render={({ input, meta }) => (
                                    <>
                                        <MyInput className={cl.input} type={'text'} label={'Название роли'} {...input}/>
                                        {meta.touched && meta.error &&
                                            <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                        }
                                    </>
                                )}
                            />

                            <Button className={cl.button} onClick={handleSubmit}>
                                <Text variant={"body"} color={"white"}>Добавить роль</Text>
                            </Button>
                        </>
                    }
                />
            </div>
        </div>
    );
};

export default RolesUser;