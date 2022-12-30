import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class CreateTrackDto {
    @ApiProperty({example: 'Название', description: 'Название трека'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 20, {message: 'Длина от 1 до 20 символов'})
    readonly name: string;

    @ApiProperty({example: 'Текст', description: 'Текст трека'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 1000, {message: 'Длина от 1 до 1000 символов'})
    readonly text: string;

    @ApiProperty({example: 'Реп', description: 'Название жанра'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 30, {message: 'Длина от 1 до 30 символов'})
    readonly genreName: string;

    @ApiProperty({type: 'string', format: 'binary'})
    readonly image: any;

    @ApiProperty({type: 'string', format: 'binary'})
    readonly audio: any;
}