import {ApiProperty} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty, IsString, Length} from "class-validator";

export class BanUserDto {
    @ApiProperty({example: '63513f86a02f86eba5d148f0', description: 'Id пользователя'})
    @IsNotEmpty()
    @IsMongoId({message: 'Должно быть MongoId'})
    readonly userId: string;

    @ApiProperty({example: 'Оскорбление', description: 'Название бана'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 16, {message: 'Длина от 1 до 16 символов'})
    readonly banReason: string;

    @ApiProperty({example: 'Вы оскорбили человек', description: 'Причина бана'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 100, {message: 'Длина от 4 до 100 символов'})
    readonly description: string;
}