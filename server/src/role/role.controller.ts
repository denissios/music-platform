import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RoleService} from "./role.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {Role} from "./schemas/role.schema";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";

@ApiTags('role')
@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @ApiOperation({summary: 'Создать роль'})
    @ApiResponse({status: 200, type: Role})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createRole(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: 'Получить все роли'})
    @ApiResponse({status: 200, type: [Role]})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllRoles() {
        return this.roleService.getAllRoles();
    }
}
