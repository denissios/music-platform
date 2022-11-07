import {ApiProperty} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty, IsString, Length} from "class-validator";

export class AddGenreDto {
    @ApiProperty({example: '63513f86a02f86eba5d148f0', description: 'Id трека'})
    @IsNotEmpty()
    @IsMongoId({message: 'Должно быть MongoId'})
    readonly trackId: string;

    @ApiProperty({example: 'Реп', description: 'Название жанра'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 30, {message: 'Длина от 1 до 30 символов'})
    readonly genreName: string;
}