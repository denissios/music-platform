import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class UpdateUserDto {
    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    @Length(4, 40, {message: 'Длина от 4 до 40 символов'})
    readonly email: string;

    @ApiProperty({example: '123456', description: 'Старый пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Длина от 4 до 16 символов'})
    readonly oldPassword: string;

    @ApiProperty({example: '123456', description: 'Новый пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Длина от 4 до 16 символов'})
    readonly password: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 16, {message: 'Длина от 1 до 16 символов'})
    readonly name: string;
}