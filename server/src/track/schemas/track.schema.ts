import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../user/schemas/user.schema";
import {Genre} from "../../genre/schemas/genre.schema";

export type TrackDocument = Track & Document;

@Schema()
export class Track {
    @ApiProperty({example: 'Название', description: 'Название трека'})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({example: 'Текст', description: 'Текст трека'})
    @Prop({type: String, required: true})
    text: string;

    @ApiProperty({description: 'Картинка'})
    @Prop()
    image: string;

    @ApiProperty({description: 'Аудио'})
    @Prop()
    audio: string;

    @ApiProperty({example: 1, description: 'Количество прослушиваний'})
    @Prop({type: Number, default: 0})
    plays: number;

    @ApiProperty({example: 1, description: 'Количество лайков'})
    @Prop({type: Number, default: 0})
    likes: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    owner: User;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}]})
    genres: Genre[];
}
export const TrackSchema = SchemaFactory.createForClass(Track);