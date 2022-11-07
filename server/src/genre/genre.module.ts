import {forwardRef, Module} from '@nestjs/common';
import {GenreController} from './genre.controller';
import {GenreService} from './genre.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Genre, GenreSchema} from "./schemas/genre.schema";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Genre.name, schema: GenreSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule)
    ],
    controllers: [GenreController],
    providers: [GenreService],
    exports: [
        GenreService
    ]
})
export class GenreModule {
}
