import React, {FC, useState} from 'react';
import cl from './AddPlaylist.module.css';
import {RcFile} from "antd/lib/upload";
import validator from "validator";
import {Field, Form} from "react-final-form";
import MyInput from "../../../MyInput";
import {Text} from "../../../Text";
import ImageInput from "../../../ImageInput";
import {Button, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useCreatePlaylistMutation} from "../../../../../store/api/playlists";

interface AddPlaylistProps {
    setVisibleModal: (value: boolean) => void
}

const AddPlaylist: FC<AddPlaylistProps> = ({setVisibleModal}) => {
    const [image, setImage] = useState<RcFile>({} as RcFile);
    const [createPlaylist, {isLoading: isLoadingCreatePlaylist}] = useCreatePlaylistMutation();

    const submitForm = (e: any) => {
        if(!isLoadingCreatePlaylist) {
            const formData = new FormData();
            for (const key in e) {
                if (e.hasOwnProperty(key)) {
                    formData.append(key, e[key]);
                }
            }
            formData.append('image', image);
            createPlaylist(formData)
                .unwrap()
                .then(() => setVisibleModal(false))
                .catch(e => console.log(e));
        }
    }

    const validateForm = (e: any) => {
        const errors = {name: '', description: '', image: ''};

        const name = e.name ?? '';
        const description = e.description ?? '';

        if(!validator.isLength(name, {min: 1, max: 20})) {
            errors.name = 'Длина названия может быть от 1 до 20 символов';
        }
        if(!validator.isLength(description, {min: 1, max: 100})) {
            errors.description = 'Описание может быть от 1 до 100 символов';
        }
        if(!image?.name) {
            errors.image = 'Выберите изображение';
        }

        if(!errors.name && !errors.description && !errors.image) {
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
                            name="name"
                            render={({ input, meta }) => (
                                <>
                                    <MyInput type={'text'} label={'Название плейлиста'} {...input}/>
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
                                    <TextArea className={cl.textarea} placeholder="Описание плейлиста" {...input}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <div className={cl.fileWrapper}>
                            <Field
                                name="image"
                                render={({ meta }) => (
                                    <>
                                        <Text className={cl.label} variant={"small"} color={"grey"} as={'div'}>Изображение</Text>
                                        <ImageInput type={'image/jpeg'} formats={'jpeg, jpg'} size={600} setFile={setImage}/>
                                        {meta.touched && meta.error &&
                                            <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                        }
                                    </>
                                )}
                            />
                        </div>

                        <Button className={cl.button} onClick={handleSubmit}>
                            <Text variant={"body"} color={"white"}>Создать плейлист</Text>
                        </Button>
                    </>
                }
            />
        </div>
    );
};

export default AddPlaylist;