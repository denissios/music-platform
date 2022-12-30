import React, {FC, useState} from 'react';
import cl from './AddTrack.module.css';
import {Field, Form} from "react-final-form";
import MyInput from "../../../../common/components/MyInput";
import {Text} from "../../../../common/components/Text";
import {Button, Select} from "antd";
import ImageInput from "../../../../common/components/ImageInput";
import {RcFile} from "antd/lib/upload";
import TextArea from "antd/es/input/TextArea";
import {useCreateTrackMutation, useGetAllGenresQuery} from "../../../../store/api/tracks";
import TrackInput from "../../../../common/components/TrackInput";
import validator from "validator";

interface AddTrackProps {
    setVisibleModal: (value: boolean) => void
}

const AddTrack: FC<AddTrackProps> = ({setVisibleModal}) => {
    const [image, setImage] = useState<RcFile>({} as RcFile);
    const [audio, setAudio] = useState<RcFile>({} as RcFile);
    const {data: genres, isLoading: isGenresLoading} = useGetAllGenresQuery();
    const [createTrack, {isLoading: isLoadingCreateTrack}] = useCreateTrackMutation();


    const submitForm = (e: any) => {
        if(!isLoadingCreateTrack) {
            const formData = new FormData();
            for (const key in e) {
                if (e.hasOwnProperty(key)) {
                    formData.append(key, e[key]);
                }
            }
            formData.append('image', image);
            formData.append('audio', audio);
            createTrack(formData)
                .unwrap()
                .then(() => setVisibleModal(false))
                .catch(e => console.log(e));
        }
    }

    const validateForm = (e: any) => {
        const errors = {name: '', text: '', genreName: '', audio: '', image: ''};

        const name = e.name ?? '';
        const text = e.text ?? '';
        const genreName = e.genreName ?? '';

        if(!validator.isLength(name, {min: 1, max: 20})) {
            errors.name = 'Длина названия может быть от 1 до 20 символов';
        }
        if(!validator.isLength(text, {min: 1, max: 1000})) {
            errors.text = 'Длина текста может быть от 1 до 1000 символов';
        }
        if(!validator.isLength(genreName, {min: 1, max: 30})) {
            errors.genreName = 'Выберите жанр';
        }
        if(!audio?.name) {
            errors.audio = ('Выберите аудио')
        }
        if(!image?.name) {
            errors.image = 'Выберите изображение';
        }

        if(!errors.name && !errors.text && !errors.genreName && !errors.audio && !errors.image) {
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
                                    <MyInput type={'text'} label={'Название трека'} {...input}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <Field
                            name="audio"
                            render={({ meta }) => (
                                <>
                                    <Text className={cl.label} variant={"small"} color={"grey"} as={'div'}>Аудио</Text>
                                    <TrackInput type={'audio/mpeg'} formats={'mp3'} size={10240} setFile={setAudio}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <div className={cl.filesWrapper}>
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
                            <div className={cl.fileWrapper}>
                                <Text className={cl.label} variant={"small"} color={"grey"} as={'div'}>Жанр</Text>
                                <Field
                                    name="genreName"
                                    render={({input, meta }) => (
                                        <>
                                            <Select
                                                style={{ width: 120 }}
                                                loading={isGenresLoading}
                                                {...input}
                                            >
                                                {genres?.map(g => <Select.Option key={g._id} value={g.name}>{g.name}</Select.Option>)}
                                            </Select>
                                            {meta.touched && meta.error &&
                                                <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                            }
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <Field
                            name="text"
                            render={({ input, meta }) => (
                                <>
                                    <TextArea className={cl.textarea} placeholder="Текст песни" {...input}/>
                                    {meta.touched && meta.error &&
                                        <Text className={cl.error} variant={"xs"} as={'div'} color={"red"}>{meta.error}</Text>
                                    }
                                </>
                            )}
                        />

                        <Button className={cl.button} onClick={handleSubmit}>
                            <Text variant={"body"} color={"white"}>Создать трек</Text>
                        </Button>
                    </>
                }
            />
        </div>
    );
};

export default AddTrack;