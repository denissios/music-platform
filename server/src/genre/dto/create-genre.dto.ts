import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class CreateGenreDto {
    @ApiProperty({example: 'Реп', description: 'Название жанра'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 30, {message: 'Длина от 1 до 30 символов'})
    readonly name: string;
}