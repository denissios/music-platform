import {Dictionary, IPolicyHandler} from "../decorators/policies.decorator";
import {PlaylistService} from "../../playlist/services/playlist.service";
import {Action, AppAbility} from "../services/casl-ability.factory";
import {ModuleRef} from "@nestjs/core";
import {Types} from "mongoose";
import {HttpException, HttpStatus} from "@nestjs/common";
import {TrackService} from "../../track/track.service";
import {UserService} from "../../user/services/user.service";

export class GetUserPolicyHandler implements IPolicyHandler {
    private userService: UserService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(id) || (String)(new Types.ObjectId(id)) !== id) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.userService = moduleRef.get(UserService, { strict: false });
        const user = await this.userService.getUser(id);
        return ability.can(Action.Read, user);
    }
}

export class GetPlaylistPolicyHandler implements IPolicyHandler {
    private playlistService: PlaylistService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(id) || (String)(new Types.ObjectId(id)) !== id) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.playlistService = moduleRef.get(PlaylistService, { strict: false });
        const playlist = await this.playlistService.getPlaylistById(id);
        if(!playlist) {
            throw new HttpException('Плейлист не найден!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Read, playlist);
    }
}

export class DeletePlaylistPolicyHandler implements IPolicyHandler {
    private playlistService: PlaylistService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(id) || (String)(new Types.ObjectId(id)) !== id) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.playlistService = moduleRef.get(PlaylistService, { strict: false });
        const playlist = await this.playlistService.getPlaylistById(id);
        if(!playlist) {
            throw new HttpException('Плейлист не найден!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Delete, playlist);
    }
}

export class DeleteTrackPolicyHandler implements IPolicyHandler {
    private trackService: TrackService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(id) || (String)(new Types.ObjectId(id)) !== id) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.trackService = moduleRef.get(TrackService, { strict: false });
        const track = await this.trackService.getTrackById(id);
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Delete, track);
    }
}

export class AddTrackToPlaylistPolicyHandler implements IPolicyHandler {
    private playlistService: PlaylistService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(body.playlistId) || (String)(new Types.ObjectId(body.playlistId)) !== body.playlistId) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.playlistService = moduleRef.get(PlaylistService, { strict: false });
        const playlist = await this.playlistService.getPlaylistById(body.playlistId);
        if(!playlist) {
            throw new HttpException('Трек или плейлист не найдены!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Add, playlist);
    }
}

export class DeleteTrackFromPlaylistPolicyHandler implements IPolicyHandler {
    private playlistService: PlaylistService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(body.playlistId) || (String)(new Types.ObjectId(body.playlistId)) !== body.playlistId) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.playlistService = moduleRef.get(PlaylistService, { strict: false });
        const playlist = await this.playlistService.getPlaylistById(body.playlistId);
        if(!playlist) {
            throw new HttpException('Трек или плейлист не найдены!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Pull, playlist);
    }
}

export class UpdatePlaylistPolicyHandler implements IPolicyHandler {
    private playlistService: PlaylistService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(id) || (String)(new Types.ObjectId(id)) !== id) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.playlistService = moduleRef.get(PlaylistService, { strict: false });
        const playlist = await this.playlistService.getPlaylistById(id);
        if(!playlist) {
            throw new HttpException('Плейлист не найден!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Update, playlist);
    }
}

export class AddGenreToTrackPolicyHandler implements IPolicyHandler {
    private trackService: TrackService;

    async handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean> {
        if (!Types.ObjectId.isValid(body.trackId) || (String)(new Types.ObjectId(body.trackId)) !== body.trackId) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        this.trackService = moduleRef.get(TrackService, { strict: false });
        const track = await this.trackService.getTrackById(body.trackId);
        if(!track) {
            throw new HttpException('Трек не найден!', HttpStatus.NOT_FOUND);
        }
        return ability.can(Action.Add, track);
    }
}