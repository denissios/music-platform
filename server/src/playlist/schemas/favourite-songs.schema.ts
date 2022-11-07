import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import {Track} from "../../track/schemas/track.schema";
import {User} from "../../user/schemas/user.schema";

export type FavouriteSongsDocument = FavouriteSongs & Document;

@Schema()
export class FavouriteSongs {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true})
    owner: User;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
    tracks: Track[];
}
export const FavouriteSongsSchema = SchemaFactory.createForClass(FavouriteSongs);