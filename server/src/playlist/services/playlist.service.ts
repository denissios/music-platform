import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Playlist, PlaylistDocument} from "../schemas/playlist.schema";
import {Model} from "mongoose";
import {CreatePlaylistDto} from "../dto/create-playlist.dto";
import {TokenService} from "../../auth/services/token.service";
import {UpdatePlaylistDto} from "../dto/update-playlist.dto";
import {UpdateFieldPlaylistDto} from "../dto/update-field-playlist.dto";

@Injectable()
export class PlaylistService {
    constructor(@InjectModel(Playlist.name) private playlistRepository: Model<PlaylistDocument>,
                private tokenService: TokenService) {}

    async createPlaylist(dto: CreatePlaylistDto, accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        if(await this.playlistRepository.findOne({owner, name: dto.name})) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }
        return await this.playlistRepository.create({...dto, owner});
    }

    async deletePlaylist(id: string) {
        return this.playlistRepository.findByIdAndDelete(id);
    }

    async updatePlaylist(id: string, dto: UpdatePlaylistDto) {
        const playlistOwner = await this.playlistRepository.findById(id, 'owner');
        if(await this.playlistRepository.findOne({owner: playlistOwner.owner, name: dto.name})) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }
        return this.playlistRepository.findByIdAndUpdate(
            id,
            dto,
            {new: true, fields: {__v: 0}}
        );
    }

    async updateFieldPlaylist(id: string, dto: UpdateFieldPlaylistDto) {
        const playlistOwner = await this.playlistRepository.findById(id, 'owner');
        if(await this.playlistRepository.findOne({owner: playlistOwner.owner, name: dto.name})) {
            throw new HttpException('Плейлист с таким именем уже существует в Вашей библиотеке!', HttpStatus.BAD_REQUEST);
        }
        return this.playlistRepository.findByIdAndUpdate(
            id,
            dto,
            {new: true, fields: {__v: 0}}
        );
    }

    async getPlaylistsForUser(accessToken: string) {
        const owner = this.tokenService.validateAccessToken(accessToken).id;
        return this.playlistRepository.find({owner}, {__v: 0})
            .populate({path: 'tracks', select: '-likes -plays -__v', populate: {path: 'owner', select: 'name'}});
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
}
