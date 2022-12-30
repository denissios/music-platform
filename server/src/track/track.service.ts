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
import {GetImagesDto} from "./dto/get-images.dto";
require("fix-esm").register();
const {parseBuffer} = require("music-metadata");

@Injectable()
export class TrackService {
    constructor(@InjectModel(Track.name) private trackRepository: Model<TrackDocument>,
                private fileService: FileService,
                private tokenService: TokenService,
                private playlistService: PlaylistService,
                private favouriteSongsService: FavouriteSongsService,
                private genreService: GenreService) {}

    async createTrack(dto: CreateTrackDto, audioData, imageData, accessToken: string) {
        const {audio, image} = this.checkAndGetImageAndAudio(imageData, audioData);
        if (!image.originalname.match(/\.(jpg|jpeg)$/)) {
            throw new HttpException('Изображение должно быть в формате jpg или jpeg!', HttpStatus.BAD_REQUEST);
        }
        if (!audio.originalname.match(/\.(mp3)$/)) {
            throw new HttpException('Аудио должно быть в формате mp3!', HttpStatus.BAD_REQUEST);
        }

        await this.fileService.verifySquareImage(image);

        if(image.size / 1024 > 600) {
            throw new HttpException('Изображение должно весить не более 600Кб!', HttpStatus.BAD_REQUEST);
        }
        if(audio.size / (1024 * 1024) > 10) {
            throw new HttpException('Аудио должно весить не более 10Мб!', HttpStatus.BAD_REQUEST);
        }

        const genre = await this.genreService.getGenreByName(dto.genreName);
        if(!genre) {
            throw new HttpException('Жанр не найден!', HttpStatus.NOT_FOUND);
        }
        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        if(await this.trackRepository.findOne({owner, name: dto.name})) {
            throw new HttpException('Трек с таким именем уже добавлен Вами!', HttpStatus.BAD_REQUEST);
        }

        const imageFilename = this.fileService.createFilenameWithoutExtension();
        const imageExtension = this.fileService.getFileExtension(image);
        const audioFilename = this.fileService.createFilenameWithoutExtension();
        const audioExtension = this.fileService.getFileExtension(audio);

        const image45 = await this.fileService.resizeImage(image, 45);
        const audioMetadata = await parseBuffer(audio.buffer);

        this.fileService.createFile(FileType.IMAGE, imageFilename, imageExtension, image45, '_45x45');
        const audioPath = this.fileService.createFile(FileType.AUDIO, audioFilename, audioExtension, audio.buffer);
        const imagePath = this.fileService.createFile(FileType.IMAGE, imageFilename, imageExtension, image.buffer);

        const track = await this.trackRepository.create({...dto, owner, duration: Math.floor(audioMetadata.format.duration), audio: audioPath, image: imagePath});
        await this.addGenre({trackId: track._id, genreName: dto.genreName});
        return track;
    }

    async deleteTrack(id: string) {
        await this.playlistService.deleteTrackRefs(id);
        await this.favouriteSongsService.deleteTrackRefs(id);
        const track = await this.trackRepository.findByIdAndDelete(id);
        await this.genreService.deleteTrackRefs(id, track.genres);
        this.fileService.removeFile(track.image);
        this.fileService.removeFile(track.image.split('.').slice(0, -1).join('.') + '_45x45.' + track.image.split('.').pop());
        this.fileService.removeFile(track.audio);
        return track;
    }

    async addToPlaylist(dto: AddDeleteToPlaylistDto) {
        if(!await this.trackRepository.findById(dto.trackId)) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        await this.playlistService.addTrackToPlaylist(dto.trackId, dto.playlistId);
        return dto;
    }

    async deleteFromPlaylist(dto: AddDeleteToPlaylistDto) {
        if(!await this.trackRepository.findById(dto.trackId)) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        await this.playlistService.deleteTrackFromPlaylist(dto.trackId, dto.playlistId);
        return dto;
    }

    async addToFavourite(dto: AddDeleteToFavouriteDto, accessToken: string) {
        const track = await this.trackRepository.findById(dto.trackId);
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        await this.favouriteSongsService.addTrackToFavourite(dto.trackId, owner);
        track.likes++;
        await track.save();
        return dto;
    }

    async deleteFromFavourite(dto: AddDeleteToFavouriteDto, accessToken: string) {
        const track = await this.trackRepository.findById(dto.trackId);
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        await this.favouriteSongsService.deleteTrackFromFavourite(dto.trackId, owner);
        track.likes--;
        await track.save();
        return dto;
    }

    async getTrack(id: string) {
        const track = await this.trackRepository.findById(id, {__v: 0, plays: 0, likes: 0}).populate('owner genres', 'name');
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        return track;
    }

    async getTracksForOwner(owner: string) {
        const tracks: TrackDocument[] = await this.trackRepository.find({owner}, {__v: 0}).populate('owner genres', 'name');

        return tracks?.map((t: TrackDocument) => ({
            _id: t.id,
            name: t.name,
            text: t.text,
            duration: t.duration,
            owner: t.owner,
            genres: t.genres,
            likes: t.likes,
            plays: t.plays,
            audio: t.audio.split('/')[1],
            image: t.image.split('/')[1]
        }))
    }

    async getTracksForFavourite(accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        return await this.favouriteSongsService.getTracks(owner);
    }

    async getImages(dto: GetImagesDto, size: number) {
        if(!dto?.value) {
            throw new HttpException('Неверное тело запроса', HttpStatus.BAD_REQUEST);
        }
        return dto.value?.map(v => {
            if(!v?.trackId || !v?.image) {
                throw new HttpException('Неверное тело запроса', HttpStatus.BAD_REQUEST);
            }
            if(!this.fileService.isExistFile(v.image, 'image')) {
                throw new HttpException('Одной из картинок не существует', HttpStatus.NOT_FOUND);
            }
            return {
                trackId: v.trackId,
                image: this.fileService.getFile('image/' + v.image.split('.').slice(0, -1).join('.') +
                    `_${size}x${size}.` + v.image.split('.').pop())
            }
        })
    }

    async checkAudio(name: string) {
        if(!this.fileService.isExistFile(name, 'audio')) {
            throw new HttpException('Такого файла не существует', HttpStatus.NOT_FOUND);
        }
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

    async searchTrack(name: string, page: number, limit: number) {
        if(page < 1 || limit < 0) {
            throw new HttpException('Неверные page или limit!', HttpStatus.BAD_REQUEST);
        }

        const tracks: TrackDocument[] = await this.trackRepository.find({name: {$regex: new RegExp(name, 'i')}},
            {likes: 0, plays: 0, __v: 0},
            {skip: (page - 1) * limit, limit: limit})
            .populate('owner genres', 'name -_id');
        const totalCount = await this.trackRepository.count({name: {$regex: new RegExp(name, 'i')}});

        const modifiedTracks = tracks.map(t => ({
                _id: t.id,
                name: t.name,
                text: t.text,
                duration: t.duration,
                owner: t.owner,
                genres: t.genres,
                audio: t.audio.split('/')[1],
                image: this.fileService.getFile(t.image.split('.').slice(0, -1).join('.') + '_45x45.' + t.image.split('.').pop())
        }))

        return {
            searchedTracks: modifiedTracks,
            totalCount
        }
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

    checkAndGetImageAndAudio(image, audio) {
        if(!image || !audio) {
            throw new HttpException('Неверное тело запроса', HttpStatus.BAD_REQUEST);
        }
        return {
            image: image[0],
            audio: audio[0]
        }
    }
}
