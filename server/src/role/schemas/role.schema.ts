import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {User} from "../../user/schemas/user.schema";
import {ApiProperty} from "@nestjs/swagger";

export type RoleDocument = Role & Document;

@Schema()
export class Role {
    @ApiProperty({example: 'USER', description: 'Название роли'})
    @Prop({type: String, unique: true, required: true})
    name: string;

    @ApiProperty({example: 'Роль для зарегистрированных пользователей', description: 'Описание роли'})
    @Prop()
    description: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    users: User[];
}
export const RoleSchema = SchemaFactory.createForClass(Role);