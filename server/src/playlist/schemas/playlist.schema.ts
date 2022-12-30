import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../user/schemas/user.schema";
import {Track} from "../../track/schemas/track.schema";

export type PlaylistDocument = Playlist & Document;

@Schema()
export class Playlist {
    @ApiProperty({example: 'Название', description: 'Название плейлиста'})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({example: 'Описание', description: 'Описание плейлиста'})
    @Prop({type: String, required: true})
    description: string;

    @ApiProperty({description: 'Картинка'})
    @Prop()
    image: string;

    @ApiProperty({type: String})
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    owner: User;

    @ApiProperty()
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
    tracks: Track[];
}
export const PlaylistSchema = SchemaFactory.createForClass(Playlist);