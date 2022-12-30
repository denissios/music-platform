import React, {FC, useState} from 'react';
import cl from './TrackInput.module.css';
import {Upload} from 'antd';
import {RcFile, UploadFile} from "antd/es/upload/interface";
import toast from "react-hot-toast";
import {Text} from "../Text";
import {UploadChangeParam} from "antd/es/upload";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";

const {Dragger} = Upload;

interface ImageInputProps {
    type: string,
    size: number,
    formats: string,
    setFile: (file: RcFile) => void
}

const ImageInput: FC<ImageInputProps> = ({type, size, formats, setFile}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const beforeUpload = (file: RcFile) => {
        const fileType = file.type === `${type}`;
        if (!fileType) {
            toast.error(`Аудио должно быть в формате ${formats}!`);
        }
        const fileSize = file.size / 1024 < size;
        if (!fileSize) {
            toast.error(`Аудио должно весить не более ${size < 1024 ? (size + 'Кб') : (size / 1024 + 'Мб')}`);
        }
        if(fileType && fileSize) {
            setFileList([file]);
        }
        return fileType && fileSize;
    };

    const onChange = (info: UploadChangeParam<UploadFile>) => {
        if(info.file.status === 'done') {
            setFile(info?.fileList[0]?.originFileObj ?? {} as RcFile);
        }
    };

    const onRemove = () => {
        setFile({} as RcFile);
        setFileList([]);
    }

    const dummyRequest = (options: RcCustomRequestOptions<any>) => {
        setTimeout(() => {
            if(options?.onSuccess) {
                options.onSuccess("ok");
            }
        }, 0);
    }

    return (
        <Dragger
            onRemove={onRemove}
            customRequest={dummyRequest}
            multiple={false}
            onChange={onChange}
            beforeUpload={beforeUpload}
            fileList={fileList}
        >
            <MusicNoteIcon className={cl.icon}/>
            <Text variant={"small"} color={"primary"} as={'div'} italic>Кликните или перетащите сюда файл</Text>
        </Dragger>
    )
};

export default ImageInput;