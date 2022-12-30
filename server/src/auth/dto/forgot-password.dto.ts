import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    @Length(4, 40, {message: 'Длина от 4 до 40 символов'})
    readonly email: string;
}