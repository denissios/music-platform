import {forwardRef, Module} from '@nestjs/common';
import {FileService} from './file.service';
import {SharpModule} from "nestjs-sharp";
import {FileController} from "./file.controller";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        SharpModule
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule {}
