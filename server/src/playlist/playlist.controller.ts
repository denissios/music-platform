import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {PlaylistService} from "./services/playlist.service";
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Playlist} from "./schemas/playlist.schema";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {Request} from "express";
import {IdParam} from "../common/decorators/idParam.decorator";
import {CheckPolicies} from "../auth/decorators/policies.decorator";
import {PoliciesGuard} from "../auth/guards/policies.guard";
import {
    DeletePlaylistPolicyHandler, GetPlaylistPolicyHandler,
    UpdatePlaylistPolicyHandler
} from "../auth/handlers/handlers";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";
import {UpdateFieldPlaylistDto} from "./dto/update-field-playlist.dto";
import {GetPlaylistsDto} from "./dto/get-playlists.dto";
import {GetPlaylistDto} from "./dto/get-playlist.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistController {
    constructor(private playlistService: PlaylistService) {}

    @ApiOperation({summary: 'Создать плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @ApiConsumes('multipart/form-data')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 }
    ]))
    createPlaylist(@Req() request: Request,
                   @UploadedFiles() files,
                   @Body() dto: CreatePlaylistDto) {
        const {image} = files;
        return this.playlistService.createPlaylist(dto, image, request.cookies['accessToken']);
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
    @ApiConsumes('multipart/form-data')
    @Roles('USER')
    @CheckPolicies(new UpdatePlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 }
    ]))
    updatePlaylist(@IdParam('id') id: string,
                   @UploadedFiles() files,
                   @Body() dto: UpdatePlaylistDto) {
        const {image} = files;
        return this.playlistService.updatePlaylist(id, dto, image);
    }

    @ApiOperation({summary: 'Изменить плейлист'})
    @ApiResponse({status: 200, type: Playlist})
    @ApiBearerAuth('JWT-auth')
    @ApiConsumes('multipart/form-data')
    @Roles('USER')
    @CheckPolicies(new UpdatePlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 }
    ]))
    updateFieldPlaylist(@IdParam('id') id: string,
                        @UploadedFiles() files,
                        @Body() dto: UpdateFieldPlaylistDto) {
        const {image} = files;
        return this.playlistService.updateFieldPlaylist(id, dto, image);
    }

    @ApiOperation({summary: 'Получить плейлист'})
    @ApiResponse({status: 200, type: GetPlaylistDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new GetPlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Get(':id')
    getPlaylist(@IdParam('id') id: string) {
        return this.playlistService.getPlaylist(id);
    }

    @ApiOperation({summary: 'Получить список плейлистов пользователя'})
    @ApiResponse({status: 200, type: [GetPlaylistsDto]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get()
    getPlaylistsForUser(@Req() request: Request) {
        return this.playlistService.getPlaylistsForUser(request.cookies['accessToken']);
    }
}
