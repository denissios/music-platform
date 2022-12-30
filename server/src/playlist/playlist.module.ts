import {forwardRef, Module} from '@nestjs/common';
import {PlaylistController} from './playlist.controller';
import {PlaylistService} from './services/playlist.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Playlist, PlaylistSchema} from "./schemas/playlist.schema";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {FavouriteSongsService} from "./services/favourite-songs.service";
import {FavouriteSongs, FavouriteSongsSchema} from "./schemas/favourite-songs.schema";
import {FileModule} from "../file/file.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Playlist.name, schema: PlaylistSchema}]),
        MongooseModule.forFeature([{name: FavouriteSongs.name, schema: FavouriteSongsSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        FileModule
    ],
    controllers: [PlaylistController],
    providers: [
        PlaylistService,
        FavouriteSongsService
    ],
    exports: [
        FavouriteSongsService,
        PlaylistService
    ]
})
export class PlaylistModule {}
