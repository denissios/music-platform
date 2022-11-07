import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Track, TrackDocument} from "./schemas/track.schema";
import {Model} from "mongoose";
import {CreateTrackDto} from "./dto/create-track.dto";
import {FileService, FileType} from "../file/file.service";
import {TokenService} from "../auth/services/token.service";
import {AddDeleteToPlaylistDto} from "./dto/add-delete-to-playlist.dto";
import {AddDeleteToFavouriteDto} from "./dto/add-delete-to-favourite.dto";
import {FavouriteSongsService} from "../playlist/services/favourite-songs.service";
import {PlaylistService} from "../playlist/services/playlist.service";
import {AddPlayLikesDto} from "./dto/add-play-likes.dto";
import {GenreService} from "../genre/genre.service";
import {AddGenreDto} from "./dto/add-genre.dto";


@Injectable()
export class TrackService {
    constructor(@InjectModel(Track.name) private trackRepository: Model<TrackDocument>,
                private fileService: FileService,
                private tokenService: TokenService,
                private playlistService: PlaylistService,
                private favouriteSongsService: FavouriteSongsService,
                private genreService: GenreService) {}

    async createTrack(dto: CreateTrackDto, audio, image, accessToken: string) {
        const genre = await this.genreService.getGenreByName(dto.genreName);
        if(!genre) {
            throw new HttpException('Жанр не найден!', HttpStatus.NOT_FOUND);
        }
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        if(await this.trackRepository.findOne({owner, name: dto.name})) {
            throw new HttpException('Трек с таким именем уже добавлен Вами!', HttpStatus.BAD_REQUEST);
        }
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        const imagePath = this.fileService.createFile(FileType.IMAGE, image);
        const track = await this.trackRepository.create({...dto, owner, audio: audioPath, image: imagePath});
        await this.addGenre({trackId: track._id, genreName: dto.genreName});
        return track;
    }

    async deleteTrack(id: string) {
        await this.playlistService.deleteTrackRefs(id);
        await this.favouriteSongsService.deleteTrackRefs(id);
        const track = await this.trackRepository.findByIdAndDelete(id);
        await this.genreService.deleteTrackRefs(id, track.genres);
        this.fileService.removeFile(track.image);
        this.fileService.removeFile(track.audio);
        return track;
    }

    async addToPlaylist(dto: AddDeleteToPlaylistDto) {
        await this.playlistService.addTrackToPlaylist(dto.trackId, dto.playlistId);
        return dto;
    }

    async deleteFromPlaylist(dto: AddDeleteToPlaylistDto) {
        await this.playlistService.deleteTrackFromPlaylist(dto.trackId, dto.playlistId);
        return dto;
    }

    async addToFavourite(dto: AddDeleteToFavouriteDto, accessToken: string) {
        if(!await this.trackRepository.findById(dto.trackId)) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        await this.favouriteSongsService.addTrackToFavourite(dto.trackId, owner);
        return dto;
    }

    async deleteFromFavourite(dto: AddDeleteToFavouriteDto, accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        await this.favouriteSongsService.deleteTrackFromFavourite(dto.trackId, owner);
        return dto;
    }

    async getTrack(id: string) {
        const track = await this.trackRepository.findById(id, {__v: 0}).populate('owner genres', 'name');
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        return track;
    }

    async getTracksForOwner(accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        return this.trackRepository.find({owner});
    }

    async getTracksForFavourite(accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        return await this.favouriteSongsService.getTracks(owner);
    }

    async addLike(dto: AddPlayLikesDto) {
        const track = await this.trackRepository.findById(dto.trackId, {__v: 0});
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        track.likes++;
        await track.save();
    }

    async decreaseLike(dto: AddPlayLikesDto) {
        const track = await this.trackRepository.findById(dto.trackId, {__v: 0});
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        track.likes--;
        await track.save();
    }

    async addPlay(dto: AddPlayLikesDto) {
        const track = await this.trackRepository.findById(dto.trackId, {__v: 0});
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        track.plays++;
        await track.save();
    }

    async addGenre(dto: AddGenreDto) {
        const track = await this.trackRepository.findById(dto.trackId);
        const genre = await this.genreService.getGenreByName(dto.genreName);
        if(!track || !genre) {
            throw new HttpException('Трек или жанр не найдены!', HttpStatus.NOT_FOUND);
        }
        if(track.genres.includes(genre._id)) {
            throw new HttpException('Такой жанр у трека уже существует!', HttpStatus.BAD_REQUEST);
        }

        await this.trackRepository.findByIdAndUpdate(
            track.id,
            {$push: {genres: genre._id}}
        )
        genre.tracks = [...genre.tracks, track._id];
        await genre.save();
        return dto;
    }

    async searchTrack(name: string) {
        return this.trackRepository.find({name: {$regex: new RegExp(name, 'i')}}, {__v: 0}).populate('owner genres', 'name');
    }

    async getTrackById(id: string) {
        return this.trackRepository.findById(id);
    }

    async deleteTracksForUser(id: string) {
        const tracksId = await this.trackRepository.find({owner: id}, '_id');
        for await (const track of tracksId) {
            await this.deleteTrack(track.id);
        }
    }
}
