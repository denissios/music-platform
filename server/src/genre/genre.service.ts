import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateGenreDto} from "./dto/create-genre.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Genre, GenreDocument} from "./schemas/genre.schema";
import {Model} from "mongoose";

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre.name) private genreRepository: Model<GenreDocument>) {}

    async createGenre(dto: CreateGenreDto) {
        if(await this.getGenreByName(dto.name)) {
            throw new HttpException('Жанр с таким именем уже существует!', HttpStatus.BAD_REQUEST);
        }
        return await this.genreRepository.create(dto);
    }

    async getAllGenres() {
        return this.genreRepository.find({}, 'name');
    }

    async getGenreByName(name: string) {
        return this.genreRepository.findOne({name})
    }

    async deleteTrackRefs(id: string, genres: Genre[]) {
        await this.genreRepository.updateMany(
            {_id: {$in: genres}},
            {$pull: {tracks: id}},
            {multi: true}
        )
    }
}
