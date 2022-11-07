import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { PlaylistModule } from './playlist/playlist.module';
import { GenreModule } from './genre/genre.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        MongooseModule.forRoot(process.env.MONGO_URL),
        AuthModule,
        UserModule,
        RoleModule,
        TrackModule,
        FileModule,
        PlaylistModule,
        GenreModule
    ]
})
export class AppModule {}
