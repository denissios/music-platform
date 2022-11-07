import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {Role} from "../../role/schemas/role.schema";
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";

export type UserDocument = User & Document;

@Schema()
export class User {
    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    @Prop({type: String, unique: true, required: true})
    email: string;

    @ApiHideProperty()
    @Prop({type: String, required: true})
    password: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @Prop()
    name: string;

    @ApiProperty({example: false, description: 'Подтверждена ли почта пользователя'})
    @Prop({type: Boolean, default: false})
    isActivated: boolean;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}]})
    roles: Role[];
}
export const UserSchema = SchemaFactory.createForClass(User);