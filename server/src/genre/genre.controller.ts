import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GenreService} from "./genre.service";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {CreateGenreDto} from "./dto/create-genre.dto";
import {Genre} from "./schemas/genre.schema";

@ApiTags('genre')
@Controller('genre')
export class GenreController {
    constructor(private genreService: GenreService) {}

    @ApiOperation({summary: 'Создать жанр'})
    @ApiResponse({status: 200, type: Genre})
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createGenre(@Body() dto: CreateGenreDto) {
        return this.genreService.createGenre(dto);
    }

    @ApiOperation({summary: 'Получить все жанры'})
    @ApiResponse({status: 200, type: [Genre]})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get()
    getAllGenres() {
        return this.genreService.getAllGenres();
    }
}
