import React, {FC} from 'react';
import cl from './BanUser.module.css';
import {useBanUserMutation} from "../../../../store/api/user";
import validator from "validator";
import {Field, Form} from "react-final-form";
import MyInput from "../../../../common/components/MyInput";
import {Text} from "../../../../common/components/Text";
import {Button} from "antd";
import TextArea from "antd/es/input/TextArea";

interface BanUserProps {
    userId: string,
    setIsVisibleModal: (value: boolean) => void
}

const BanUser: FC<BanUserProps> = ({userId, setIsVisibleModal}) => {
    const [banUser, {isLoading: isLoadingBanUser}] = useBanUserMutation();

    const submitForm = (e: any) => {
        if(!isLoadingBanUser) {
            banUser({userId, banReason: e.banReason, description: e.description})
                .unwrap()
                .then(() => setIsVisibleModal(false))
                .catch(e => console.log(e));
        }
    }

    const validateForm = (e: any) => {
        const errors = {banReason: '', description: ''};

        const banReason = e.banReason ?? '';
        const description = e.description ?? '';

        if(!validator.isLength(banReason, {min: 1, max: 16})) {
            errors.banReason = 'Длина названия может быть от 1 до 16 символов';
        }
        if(!validator.isLength(description, {min: 4, max: 100})) {
            errors.description = 'Длина текста может быть от 4 до 100 символов';
        }

        if(!errors.banReason && !errors.description) {
            return {}
        }
        return errors;
    }

    return (
        <div>
            <Form
                onSubmit={submitForm}
                validate={validateForm}
                render={({handleSubmit}) =>
                    <>
                        <Field
                            name="banReason"
                            render={({ input, meta }) => (
                                <>
                                    <MyInput type={'text'} label={'Название бана'} {...input}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <Field
                            name="description"
                            render={({ input, meta }) => (
                                <>
                                    <TextArea className={cl.textarea} placeholder="Причина бана" {...input}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <Button className={cl.button} onClick={handleSubmit}>
                            <Text variant={"body"} color={"white"}>Забанить</Text>
                        </Button>
                    </>
                }
            />
        </div>
    );
};

export default BanUser;