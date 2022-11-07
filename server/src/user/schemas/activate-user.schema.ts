import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";
import mongoose from "mongoose";
import {User} from "./user.schema";

export type ActivateUserDocument = ActivateUser & Document;

@Schema()
export class ActivateUser {
    @ApiProperty({example: '123456', description: 'Уникальный идентификатор активации аккаунта'})
    @Prop()
    activationLink: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User
}
export const ActivateUserSchema = SchemaFactory.createForClass(ActivateUser);