import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {ApiProperty} from "@nestjs/swagger";
import {User} from "./user.schema";

export type BanUserDocument = BanUser & Document;

@Schema()
export class BanUser {
    @ApiProperty({example: 'Оскорбление', description: 'Название бана'})
    @Prop()
    banReason: string;

    @ApiProperty({example: 'Вы оскорбили человека', description: 'Причина бана'})
    @Prop()
    description: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User
}
export const BanUserSchema = SchemaFactory.createForClass(BanUser);