import {forwardRef, Module} from '@nestjs/common';
import {TrackController} from './track.controller';
import {TrackService} from './track.service';
import {FileModule} from "../file/file.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Track, TrackSchema} from "./schemas/track.schema";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {PlaylistModule} from "../playlist/playlist.module";
import {GenreModule} from "../genre/genre.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        FileModule,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => PlaylistModule),
        GenreModule
    ],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService]
})
export class TrackModule {}
