import {Body, Controller, Delete, Get, Patch, Post, Put, Req, UseGuards} from '@nestjs/common';
import {PlaylistService} from "./services/playlist.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Playlist} from "./schemas/playlist.schema";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {Request} from "express";
import {IdParam} from "../common/decorators/idParam.decorator";
import {CheckPolicies} from "../auth/decorators/policies.decorator";
import {PoliciesGuard} from "../auth/guards/policies.guard";
import {
    DeletePlaylistPolicyHandler,
    UpdatePlaylistPolicyHandler
} from "../auth/handlers/handlers";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";
import {UpdateFieldPlaylistDto} from "./dto/update-field-playlist.dto";

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistController {
    constructor(private playlistService: PlaylistService) {}

    @ApiOperation({summary: 'Создать плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post()
    createPlaylist(@Req() request: Request,
                   @Body() dto: CreatePlaylistDto) {
        return this.playlistService.createPlaylist(dto, request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Удалить плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new DeletePlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Delete(':id')
    deletePlaylist(@IdParam('id') id: string) {
        return this.playlistService.deletePlaylist(id);
    }

    @ApiOperation({summary: 'Изменить плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new UpdatePlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Put(':id')
    updatePlaylist(@IdParam('id') id: string, @Body() dto: UpdatePlaylistDto) {
        return this.playlistService.updatePlaylist(id, dto);
    }

    @ApiOperation({summary: 'Изменить плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new UpdatePlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Patch(':id')
    updateFieldPlaylist(@IdParam('id') id: string, @Body() dto: UpdateFieldPlaylistDto) {
        return this.playlistService.updateFieldPlaylist(id, dto);
    }

    @ApiOperation({summary: 'Получить список плейлистов пользователя'})
    @ApiResponse({status: 200, type: [Playlist]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get()
    getPlaylistsForUser(@Req() request: Request) {
        return this.playlistService.getPlaylistsForUser(request.cookies['accessToken']);
    }
}
