import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({example: '123456', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Длина от 4 до 16 символов'})
    readonly password: string;
}