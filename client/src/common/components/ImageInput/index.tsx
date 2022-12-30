import React, {FC, useState} from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import toast from "react-hot-toast";
import {Text} from "../Text";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";

interface ImageInputProps {
    type: string,
    size: number,
    formats: string,
    setFile: (file: RcFile) => void,
    defaultImageUrl?: string
}

export const ImageInput: FC<ImageInputProps> = ({type, size, formats, setFile, defaultImageUrl = ''}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        const fileType = file.type === `${type}`;
        if (!fileType) {
            toast.error(`Изображение должно быть в формате ${formats}!`);
        }
        const fileSize = file.size / 1024 < size;
        if (!fileSize) {
            toast.error(`Изображение должно весить не более ${size < 1024 ? (size + 'Кб') : (size / 1024 + 'Мб')}`);
        }
        if(fileType && fileSize) {
            setFileList([file]);
        }
        return fileSize && fileType;
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setFile(info?.fileList[0]?.originFileObj ?? {} as RcFile);
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <Text variant={"xs"} color={"primary"} as={'div'} italic style={{marginTop: 5}}>Кликните или перетащите сюда файл</Text>
        </div>
    );

    const dummyRequest = (options: RcCustomRequestOptions<any>) => {
        setTimeout(() => {
            if(options?.onSuccess) {
                options.onSuccess("ok");
            }
        }, 0);
    }

    return (
        <Upload
            listType="picture-card"
            customRequest={dummyRequest}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            multiple={false}
            fileList={fileList}
        >
            {imageUrl ? <img src={imageUrl} alt="Picture" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    );
};

export default ImageInput;