import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import {SharpService} from "nestjs-sharp";

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image'
}

@Injectable()
export class FileService {
    constructor(private sharpService: SharpService) {}

    createFile(type: FileType, fileNameWithoutExtension: string, fileExtension: string, fileBuffer: string, postfix = '') {
        try {
            const fileName = fileNameWithoutExtension + postfix + '.' + fileExtension;
            const filePath = path.resolve(__dirname, '..', 'static', type);
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.resolve(filePath, fileName), fileBuffer);
            return type + '/' + fileName;
        }
        catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    isExistFile(fileName: string, type: string): boolean {
        try {
            const filePath = path.resolve(__dirname, '..', 'static', type);
            return fs.existsSync(path.resolve(filePath, fileName))
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getFile(fileName: string) {
        try {
            const filePath = path.resolve(__dirname, '..', 'static');
            if(fs.existsSync(path.resolve(filePath, fileName))) {
                const file_buffer = fs.readFileSync(path.resolve(filePath, fileName));
                return file_buffer.toString('base64');
            } else {
                return '';
            }
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    removeFile(fileName: string) {
        try {
            const filePath = path.resolve(__dirname, '..', 'static');
            if(fs.existsSync(path.resolve(filePath, fileName))) {
                fs.unlinkSync(path.resolve(filePath, fileName));
            }
        }
        catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkImage(name: string) {
        if(!this.isExistFile(name, 'image')) {
            throw new HttpException('Такого файла не существует', HttpStatus.NOT_FOUND);
        }
    }

    async verifySquareImage(image) {
        const imageMetadata = await this.sharpService.edit(image.buffer).metadata();
        if(imageMetadata.width !== imageMetadata.height) {
            throw new HttpException('Изображение должно быть квадратным!', HttpStatus.BAD_REQUEST);
        }
    }

    createFilenameWithoutExtension() {
        return uuid.v4();
    }

    getFileExtension(file: Express.Multer.File) {
        return file.originalname.split('.').pop();
    }

    async resizeImage(image, size: number) {
        return await this.sharpService.edit(image.buffer).resize(size, size).toBuffer();
    }
}
