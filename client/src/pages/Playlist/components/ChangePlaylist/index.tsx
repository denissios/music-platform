import React, {FC, useEffect, useState} from 'react';
import {RcFile} from "antd/lib/upload";
import {useSavePlaylistChangesMutation} from "../../../../store/api/playlists";
import validator from "validator";
import {Field, Form} from "react-final-form";
import MyInput from "../../../../common/components/MyInput";
import {Text} from "../../../../common/components/Text";
import cl from "../../../../common/components/Sidebar/components/AddPlaylist/AddPlaylist.module.css";
import TextArea from "antd/es/input/TextArea";
import ImageInput from "../../../../common/components/ImageInput";
import {Button} from "antd";
import {IPlaylist} from "../../../../store/types/playlist";

interface ChangePlaylistProps {
    playlist: IPlaylist,
    playlistImage: string,
    setVisibleModal: (value: boolean) => void
}

const ChangePlaylist: FC<ChangePlaylistProps> = ({playlist, playlistImage, setVisibleModal}) => {
    const [image, setImage] = useState<RcFile>({} as RcFile);
    const [saveChanges, {isLoading: isLoadingSaveChanges}] = useSavePlaylistChangesMutation();

    useEffect(() => {
        fetch(playlistImage)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "Playlist_image.jpg",{ type: "image/jpeg" });
                setImage(file as RcFile);
            })
    }, [])

    const submitForm = (e: any) => {
        if(!isLoadingSaveChanges) {
            const formData = new FormData();
            for (const key in e) {
                if (e.hasOwnProperty(key)) {
                    formData.append(key, e[key]);
                }
            }
            formData.append('image', image);
            saveChanges({id: playlist._id, changes: formData})
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
                initialValues={{name: playlist.name, description: playlist.description}}
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
                                        <ImageInput type={'image/jpeg'} formats={'jpeg, jpg'} size={600} setFile={setImage} defaultImageUrl={playlistImage}/>
                                        {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                        }
                                    </>
                                )}
                            />
                        </div>

                        <Button className={cl.button} onClick={handleSubmit}>
                            <Text variant={"body"} color={"white"}>Сохранить изменения</Text>
                        </Button>
                    </>
                }
            />
        </div>
    );
};

export default ChangePlaylist;