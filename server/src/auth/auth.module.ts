import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Token, TokenSchema} from "./schemas/token.schema";
import {TokenService} from "./services/token.service";
import {User, UserSchema} from "../user/schemas/user.schema";
import {CaslAbilityFactory} from "./services/casl-ability.factory";
import {Playlist, PlaylistSchema} from "../playlist/schemas/playlist.schema";
import {Track, TrackSchema} from "../track/schemas/track.schema";
import {FavouriteSongs, FavouriteSongsSchema} from "../playlist/schemas/favourite-songs.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Playlist.name, schema: PlaylistSchema}]),
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        MongooseModule.forFeature([{name: FavouriteSongs.name, schema: FavouriteSongsSchema}]),
        forwardRef(() => UserModule)
    ],
    providers: [
        CaslAbilityFactory,
        AuthService,
        TokenService
    ],
    controllers: [AuthController],
    exports: [
        TokenService,
        CaslAbilityFactory
    ]
})
export class AuthModule {}
