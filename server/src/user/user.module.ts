import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {UserService} from "./services/user.service";
import {RoleModule} from "../role/role.module";
import {AuthModule} from "../auth/auth.module";
import {BanUserService} from "./services/ban-user.service";
import {BanUser, BanUserSchema} from "./schemas/ban-user.schema";
import {ActivateUserService} from "./services/activate-user.service";
import {MailerModule} from "@nestjs-modules/mailer";
import {ActivateUser, ActivateUserSchema} from "./schemas/activate-user.schema";
import {MailService} from "./services/mail.service";
import {PlaylistModule} from "../playlist/playlist.module";
import {TrackModule} from "../track/track.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: BanUser.name, schema: BanUserSchema}]),
        MongooseModule.forFeature([{name: ActivateUser.name, schema: ActivateUserSchema}]),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: `${process.env.MAIL_TRANSPORT}`
            })
        }),
        forwardRef(() => AuthModule),
        forwardRef(() => PlaylistModule),
        forwardRef(() => TrackModule),
        RoleModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        BanUserService,
        ActivateUserService,
        MailService
    ],
    exports: [
        UserService,
        BanUserService
    ]
})
export class UserModule {}
