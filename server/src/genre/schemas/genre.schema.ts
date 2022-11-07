import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import {ApiProperty} from "@nestjs/swagger";
import {Track} from "../../track/schemas/track.schema";

export type GenreDocument = Genre & Document;

@Schema()
export class Genre {
    @ApiProperty({example: 'Реп', description: 'Название жанра'})
    @Prop({type: String, unique: true, required: true})
    name: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
    tracks: Track[];
}
export const GenreSchema = SchemaFactory.createForClass(Genre);