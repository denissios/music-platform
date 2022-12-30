import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FavouriteSongs, FavouriteSongsDocument} from "../schemas/favourite-songs.schema";
import {Model, Types} from "mongoose";
import {Track, TrackDocument} from "../../track/schemas/track.schema";
import {FileService} from "../../file/file.service";

@Injectable()
export class FavouriteSongsService {
    constructor(@InjectModel(FavouriteSongs.name) private favouriteSongsRepository: Model<FavouriteSongsDocument>,
                private fileService: FileService) {}

    async createFavouriteSongsPlaylist(id: string) {
        if(await this.favouriteSongsRepository.findOne({owner: id})) {
            throw new HttpException('Плейслист с любымыми треками уже существует для данного пользователя!', HttpStatus.BAD_REQUEST);
        }
        return await this.favouriteSongsRepository.create({owner: id});
    }

    async deleteFavouriteSongsPlaylistForUser(id: string) {
        return this.favouriteSongsRepository.deleteOne({owner: id});
    }

    async deleteTrackRefs(id: string) {
        await this.favouriteSongsRepository.updateMany(
            {tracks: id},
            {$pull: {tracks: id}},
            {multi: true}
        )
    }

    async addTrackToFavourite(trackId: string, ownerId: string) {
        if(await this.favouriteSongsRepository.findOne({owner: ownerId, tracks: trackId})) {
            throw new HttpException('Данный трек уже существует в Вашей медиатеке!', HttpStatus.BAD_REQUEST);
        }
        await this.favouriteSongsRepository.updateOne(
            {owner: ownerId},
            {$push: {tracks: trackId}}
        )
    }

    async deleteTrackFromFavourite(trackId: string, ownerId: string) {
        if(!await this.favouriteSongsRepository.findOne({owner: ownerId, tracks: trackId})) {
            throw new HttpException('Данного трека не существует в Вашей медиатеке!', HttpStatus.NOT_FOUND);
        }
        await this.favouriteSongsRepository.updateOne(
            {owner: ownerId},
            {$pull: {tracks: trackId}}
        )
    }

    async getTracks(owner: string) {
        const tracks: FavouriteSongsDocument = await this.favouriteSongsRepository.findOne({owner}, {owner: 0, __v: 0, _id: 0})
            .populate({path: 'tracks', select: '-likes -plays -__v', populate: {path: 'owner genres', select: 'name -_id'}});

        return tracks?.tracks?.map((t: TrackDocument) => ({
                _id: t.id,
                name: t.name,
                text: t.text,
                duration: t.duration,
                owner: t.owner,
                genres: t.genres,
                audio: t.audio.split('/')[1],
                image: t.image.split('/')[1]
        }))
    }
}