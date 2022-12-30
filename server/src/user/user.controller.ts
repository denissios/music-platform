import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.schema";
import {RegistrationDto} from "./dto/registration.dto";
import {UserService} from "./services/user.service";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {IdParam} from "../common/decorators/idParam.decorator";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Request} from "express";
import {UpdateFieldUserDto} from "./dto/update-field-user.dto";
import {UUIDParam} from "../common/decorators/uuidParam.decorator";
import {CheckPolicies} from "../auth/decorators/policies.decorator";
import {GetUserPolicyHandler} from "../auth/handlers/handlers";
import {PoliciesGuard} from "../auth/guards/policies.guard";
import {ResetPasswordDto} from "./dto/ResetPassword.dto";
import {GetUserDto, Role} from "./dto/get-user.dto";
import {IntQuery} from "../common/decorators/intQuery.decorator";
import {GetSearchedUsersDto} from "./dto/get-searched-users.dto";
import {UnbanUserDto} from "./dto/unban-user.dto";

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createUser(@Body() dto: RegistrationDto) {
        return this.userService.createUser(dto);
    }

    @ApiOperation({summary: 'Активация почты пользователя'})
    @ApiResponse({status: 200})
    @Get('/activate/:link')
    async activateUser(@UUIDParam('link') link: string,
                       @Res() response) {
        await this.userService.activateUser(link);
        return response.redirect(`${process.env.CLIENT_URL}`);
    }

    @ApiOperation({summary: 'Найти пользователя'})
    @ApiResponse({status: 200, type: GetSearchedUsersDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/search')
    searchUser(@Query('value') value: string,
               @IntQuery('page') page: number,
               @IntQuery('limit') limit: number) {
        return this.userService.searchUser(value, page, limit);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({summary: 'Получить пользователя'})
    @ApiResponse({status: 200, type: GetUserDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new GetUserPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Get(':id')
    getUser(@IdParam('id') id: string) {
        return this.userService.getUser(id);
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteUser(@IdParam('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @ApiOperation({summary: 'Добавить роль пользователю'})
    @ApiResponse({status: 200, type: AddRoleDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }

    @ApiOperation({summary: 'Получить роли пользователя'})
    @ApiResponse({status: 200, type: [Role]})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/role/:id')
    getRoles(@IdParam('id') id: string) {
        return this.userService.getRoles(id);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200, type: BanUserDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/ban')
    banUser(@Body() dto: BanUserDto) {
        return this.userService.banUser(dto);
    }

    @ApiOperation({summary: 'Разбанить пользователя'})
    @ApiResponse({status: 200, type: UnbanUserDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/unban')
    unbanUser(@Body() dto: UnbanUserDto) {
        return this.userService.unbanUser(dto);
    }

    @ApiOperation({summary: 'Проверка на бан'})
    @ApiResponse({status: 200, type: Boolean})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/check-ban/:id')
    isBanUser(@IdParam('id') id: string) {
        return this.userService.isBanUser(id);
    }

    @ApiOperation({summary: 'Изменить пользователя'})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Put(':id')
    updateUser(@Req() request: Request,
               @IdParam('id') id: string,
               @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto, request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Изменить пользователя'})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Patch(':id')
    updateFieldUser(@Req() request: Request,
                    @IdParam('id') id: string,
                    @Body() dto: UpdateFieldUserDto) {
        return this.userService.updateFieldUser(id, dto, request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Восстановить пароль'})
    @ApiResponse({status: 200})
    @Patch('/reset-password/:id/:token')
    resetPassword(@IdParam('id') id: string,
                  @Param('token') token: string,
                  @Body() dto: ResetPasswordDto) {
        return this.userService.resetPassword(id, token, dto);
    }
}
