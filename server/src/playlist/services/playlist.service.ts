import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Playlist, PlaylistDocument} from "../schemas/playlist.schema";
import {Model} from "mongoose";
import {CreatePlaylistDto} from "../dto/create-playlist.dto";
import {TokenService} from "../../auth/services/token.service";
import {UpdatePlaylistDto} from "../dto/update-playlist.dto";
import {UpdateFieldPlaylistDto} from "../dto/update-field-playlist.dto";
import {FileService, FileType} from "../../file/file.service";
import {TrackDocument} from "../../track/schemas/track.schema";

@Injectable()
export class PlaylistService {
    constructor(@InjectModel(Playlist.name) private playlistRepository: Model<PlaylistDocument>,
                private tokenService: TokenService,
                private fileService: FileService) {}

    async createPlaylist(dto: CreatePlaylistDto, imageData, accessToken: string) {
        const image = this.checkAndGetImage(imageData);

        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        if(await this.playlistRepository.findOne({owner, name: dto.name})) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }

        const imagePath = await this.createImage(image);
        return await this.playlistRepository.create({...dto, image: imagePath, owner});
    }

    async deletePlaylist(id: string) {
        const playlist = await this.playlistRepository.findByIdAndDelete(id);
        this.fileService.removeFile(playlist.image);
        this.fileService.removeFile(playlist.image.split('.').slice(0, -1).join('.') + '_200x200.' + playlist.image.split('.').pop());
        return playlist
    }

    async updatePlaylist(id: string, dto: UpdatePlaylistDto, imageData) {
        const image = this.checkAndGetImage(imageData);
        const playlist = await this.playlistRepository.findById(id);
        const candidate = await this.playlistRepository.findOne({owner: playlist.owner, name: dto.name});
        if(candidate && candidate?.id !== id) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }

        const imagePath = await this.createImage(image);
        this.fileService.removeFile(playlist.image);
        this.fileService.removeFile(playlist.image.split('.').slice(0, -1).join('.') + '_200x200.' + playlist.image.split('.').pop());

        return this.playlistRepository.findByIdAndUpdate(
            id,
            {...dto, image: imagePath},
            {new: true, fields: {__v: 0}}
        );
    }

    async updateFieldPlaylist(id: string, dto: UpdateFieldPlaylistDto, imageData) {
        let playlist = await this.playlistRepository.findById(id);
        const candidate = await this.playlistRepository.findOne({owner: playlist.owner, name: dto.name});
        if(candidate && candidate.id !== id) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }

        if(imageData) {
            const image = this.checkAndGetImage(imageData);
            const imagePath = await this.createImage(image);
            this.fileService.removeFile(playlist.image);
            this.fileService.removeFile(playlist.image.split('.').slice(0, -1).join('.') + '_200x200.' + playlist.image.split('.').pop());

            playlist = await this.playlistRepository.findByIdAndUpdate(
                id,
                {...dto, image: imagePath},
                {new: true, fields: {__v: 0}}
            );
        } else {
            playlist = await this.playlistRepository.findByIdAndUpdate(
                id,
                dto,
                {new: true, fields: {__v: 0}}
            );
        }
        return playlist;
    }

    async getPlaylist(id: string) {
        const playlist = await this.playlistRepository.findById(id, {owner: 0, __v: 0})
            .populate({path: 'tracks', select: '-likes -plays -__v', populate: {path: 'owner', select: 'name'}});

        return {
            _id: playlist._id,
            name: playlist.name,
            description: playlist.description,
            image: playlist.image,
            tracks: playlist.tracks.map((t: TrackDocument) => ({
                _id: t.id,
                name: t.name,
                text: t.text,
                duration: t.duration,
                owner: t.owner,
                genres: t.genres,
                audio: t.audio.split('/')[1],
                image: t.image.split('/')[1]
            }))}
    }

    async getPlaylistsForUser(accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken)?.id;
        return this.playlistRepository.find({owner}, {owner: 0, tracks: 0, __v: 0})
    }

    async getPlaylistById(id: string) {
        return this.playlistRepository.findById(id);
    }

    async deletePlaylistsForUser(id: string) {
        return this.playlistRepository.deleteMany({owner: id});
    }

    async deleteTrackRefs(id: string) {
        await this.playlistRepository.updateMany(
            {tracks: id},
            {$pull: {tracks: id}},
            {multi: true}
        )
    }

    async addTrackToPlaylist(trackId: string, playlistId: string) {
        if(await this.playlistRepository.findOne({_id: playlistId, tracks: trackId})) {
            throw new HttpException('Данный трек уже существует в этом плейлисте!', HttpStatus.BAD_REQUEST);
        }
        await this.playlistRepository.updateOne(
            {_id: playlistId},
            {$push: {tracks: trackId}}
        )
    }

    async deleteTrackFromPlaylist(trackId: string, playlistId: string) {
        if(!await this.playlistRepository.findOne({_id: playlistId, tracks: trackId})) {
            throw new HttpException('Данного трека не существует в этом плейлисте!', HttpStatus.NOT_FOUND);
        }
        await this.playlistRepository.updateOne(
            {_id: playlistId},
            {$pull: {tracks: trackId}}
        )
    }

    async createImage(image) {
        if (!image.originalname.match(/\.(jpg|jpeg)$/)) {
            throw new HttpException('Изображение должно быть в формате jpg или jpeg!', HttpStatus.BAD_REQUEST);
        }
        await this.fileService.verifySquareImage(image);
        if(image.size / 1024 > 600) {
            throw new HttpException('Изображение должно весить не более 600Кб!', HttpStatus.BAD_REQUEST);
        }

        const imageFilename = this.fileService.createFilenameWithoutExtension();
        const imageExtension = this.fileService.getFileExtension(image);
        const image200 = await this.fileService.resizeImage(image, 200);

        this.fileService.createFile(FileType.IMAGE, imageFilename, imageExtension, image200, '_200x200');
        return this.fileService.createFile(FileType.IMAGE, imageFilename, imageExtension, image.buffer);
    }

    checkAndGetImage(image) {
        if(!image) {
            throw new HttpException('Неверное тело запроса', HttpStatus.BAD_REQUEST);
        }
        return image[0];
    }
}
