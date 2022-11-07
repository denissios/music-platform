import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {TrackService} from "./track.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateTrackDto} from "./dto/create-track.dto";
import {Track} from "./schemas/track.schema";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Request} from "express";
import {CheckPolicies} from "../auth/decorators/policies.decorator";
import {PoliciesGuard} from "../auth/guards/policies.guard";
import {IdParam} from "../common/decorators/idParam.decorator";
import {AddDeleteToPlaylistDto} from "./dto/add-delete-to-playlist.dto";
import {AddDeleteToFavouriteDto} from "./dto/add-delete-to-favourite.dto";
import {
    AddGenreToTrackPolicyHandler,
    AddTrackToPlaylistPolicyHandler, DeleteTrackFromFavouritePolicyHandler, DeleteTrackFromPlaylistPolicyHandler,
    DeleteTrackPolicyHandler
} from "../auth/handlers/handlers";
import {AddPlayLikesDto} from "./dto/add-play-likes.dto";
import {AddGenreDto} from "./dto/add-genre.dto";

@ApiTags('track')
@Controller('track')
export class TrackController {
    constructor(private trackService: TrackService) {}

    @ApiOperation({summary: 'Добавить трека в плейлист'})
    @ApiResponse({status: 200, type: AddDeleteToPlaylistDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new AddTrackToPlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Post('/playlist')
    addToPlaylist(@Body() dto: AddDeleteToPlaylistDto) {
        return this.trackService.addToPlaylist(dto);
    }

    @ApiOperation({summary: 'Удалить трек из плейлиста'})
    @ApiResponse({status: 200, type: AddDeleteToPlaylistDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new DeleteTrackFromPlaylistPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Delete('/playlist')
    deleteFromPlaylist(@Body() dto: AddDeleteToPlaylistDto) {
        return this.trackService.deleteFromPlaylist(dto);
    }

    @ApiOperation({summary: 'Добавить трек в избранное'})
    @ApiResponse({status: 200, type: AddDeleteToFavouriteDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post('/favourite')
    addToFavourite(@Req() request: Request,
                   @Body() dto: AddDeleteToFavouriteDto) {
        return this.trackService.addToFavourite(dto, request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Удалить трек из избранных'})
    @ApiResponse({status: 200, type: AddDeleteToPlaylistDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new DeleteTrackFromFavouritePolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Delete('/favourite')
    deleteFromFavourite(@Req() request: Request,
                        @Body() dto: AddDeleteToFavouriteDto) {
        return this.trackService.deleteFromFavourite(dto, request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Создать Трек'})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
        { name: 'image', maxCount: 1 },
    ]))
    createTrack(@Req() request: Request,
                @UploadedFiles() files,
                @Body() dto: CreateTrackDto) {
        const {audio, image} = files;
        return this.trackService.createTrack(dto, audio[0], image[0], request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Удалить трек'})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new DeleteTrackPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Delete(':id')
    deleteTrack(@IdParam('id') id: string) {
        return this.trackService.deleteTrack(id);
    }

    @ApiOperation({summary: 'Получить список избранных треков'})
    @ApiResponse({status: 200, type: [Track]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get('/favourite')
    getTracksForFavourite(@Req() request: Request) {
        return this.trackService.getTracksForFavourite(request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Получить треки создателя'})
    @ApiResponse({status: 200, type: [Track]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get('/owner')
    getTracksForOwner(@Req() request: Request) {
        return this.trackService.getTracksForOwner(request.cookies['accessToken']);
    }

    @ApiOperation({summary: 'Найти треки'})
    @ApiResponse({status: 200, type: [Track]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get('/search')
    searchTrack(@Query('name') name: string) {
        return this.trackService.searchTrack(name);
    }

    @ApiOperation({summary: 'Получить трек'})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get(':id')
    getTrack(@IdParam('id') id: string) {
        return this.trackService.getTrack(id);
    }

    @ApiOperation({summary: 'Увеличить количество лайков на 1'})
    @ApiResponse({status: 200})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post('/add-like')
    async addLike(@Body() dto: AddPlayLikesDto) {
        return this.trackService.addLike(dto);
    }

    @ApiOperation({summary: 'Уменьшить количество лайков на 1'})
    @ApiResponse({status: 200})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post('/decrease-like')
    async decreaseLike(@Body() dto: AddPlayLikesDto) {
        return this.trackService.decreaseLike(dto);
    }

    @ApiOperation({summary: 'Увеличить количество прослушиваний на 1'})
    @ApiResponse({status: 200})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post('/add-play')
    async addPlay(@Body() dto: AddPlayLikesDto) {
        return this.trackService.addPlay(dto);
    }

    @ApiOperation({summary: 'Добавить жанр треку'})
    @ApiResponse({status: 200, type: AddGenreDto})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @CheckPolicies(new AddGenreToTrackPolicyHandler())
    @UseGuards(RolesGuard, PoliciesGuard)
    @Post('/genre')
    addRole(@Body() dto: AddGenreDto) {
        return this.trackService.addGenre(dto);
    }
}
