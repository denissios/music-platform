import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class UpdateFieldUserDto {
    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    @Length(4, 40, {message: 'Длина от 4 до 40 символов'})
    @IsOptional()
    readonly email: string;

    @ApiProperty({example: '123456', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Длина от 4 до 16 символов'})
    @IsOptional()
    readonly password: string;

    @ApiProperty({example: 'Дмитрий', description: 'Имя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 16, {message: 'Длина от 1 до 16 символов'})
    @IsOptional()
    readonly name: string;
}