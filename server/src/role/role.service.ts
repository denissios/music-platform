import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Role, RoleDocument} from "./schemas/role.schema";
import {Model} from "mongoose";

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private roleRepository: Model<RoleDocument>) {}

    async createRole(dto: CreateRoleDto) {
        if(await this.getRoleByName(dto.name)) {
            throw new HttpException('Роль с таким именем уже существует!', HttpStatus.BAD_REQUEST);
        }
        return await this.roleRepository.create(dto);
    }

    async getAllRoles() {
        return this.roleRepository.find();
    }

    async getRoleByName(name: string) {
        return this.roleRepository.findOne({name})
    }

    async deleteUserRefs(id: string, roles: Role[]) {
        await this.roleRepository.updateMany(
            {_id: {$in: roles}},
            {$pull: {users: id}},
            {multi: true}
        )
    }
}
