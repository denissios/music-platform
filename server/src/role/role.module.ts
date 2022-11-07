import {forwardRef, Module} from '@nestjs/common';
import {RoleController} from './role.controller';
import {RoleService} from './role.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Role, RoleSchema} from "./schemas/role.schema";
import {AuthModule} from "../auth/auth.module";
import {User, UserSchema} from "../user/schemas/user.schema";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule)
    ],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [
        RoleService
    ]
})
export class RoleModule {}
