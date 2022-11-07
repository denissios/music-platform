import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: 'USER', description: 'Название роли'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 30, {message: 'Длина от 1 до 30 символов'})
    readonly name: string;

    @ApiProperty({example: 'Роль для зарегистрированных пользователей', description: 'Описание роли'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 100, {message: 'Длина от 1 до 100 символов'})
    readonly description: string;
}