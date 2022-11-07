import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import {User} from "../../user/schemas/user.schema";
import {ApiProperty} from "@nestjs/swagger";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    @ApiProperty({example: 'Токен', description: 'Refresh token'})
    @Prop({type: String, required: true})
    refreshToken: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
}
export const TokenSchema = SchemaFactory.createForClass(Token);