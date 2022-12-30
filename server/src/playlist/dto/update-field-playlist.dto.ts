import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, Length} from "class-validator";

export class UpdateFieldPlaylistDto {
    @ApiProperty({example: 'Название', description: 'Название плейлиста'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 20, {message: 'Длина от 1 до 20 символов'})
    @IsOptional()
    readonly name: string;

    @ApiProperty({example: 'Описание', description: 'Описание плейлиста'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 100, {message: 'Длина от 1 до 100 символов'})
    @IsOptional()
    readonly description: string;

    @ApiProperty({type: 'string', format: 'binary'})
    @IsOptional()
    readonly image: any;
}