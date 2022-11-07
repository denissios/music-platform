import {Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, MongoAbility} from "@casl/ability";
import {User, UserDocument} from "../../user/schemas/user.schema";
import {Track, TrackDocument} from "../../track/schemas/track.schema";
import {Playlist, PlaylistDocument} from "../../playlist/schemas/playlist.schema";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {FavouriteSongs, FavouriteSongsDocument} from "../../playlist/schemas/favourite-songs.schema";

export enum Action {
    Create = 'create',
    Read = 'read',
    Add = 'add',
    Pull = 'pull',
    Update = 'update',
    Delete = 'delete',
}

type Subjects = InferSubjects<typeof Track | typeof FavouriteSongs | typeof Playlist | typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    constructor(@InjectModel(User.name) private userRepository: Model<UserDocument>,
                @InjectModel(Playlist.name) private playlistRepository: Model<PlaylistDocument>,
                @InjectModel(Track.name) private trackRepository: Model<TrackDocument>,
                @InjectModel(FavouriteSongs.name) private favouriteSongsRepository: Model<FavouriteSongsDocument>) {}

    async createForUser(user: UserDocument) {
        try {
            const {can, cannot, build} = new AbilityBuilder<MongoAbility<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

            if(user.roles.some(r => r.name === 'ADMIN')) {
                can([Action.Delete, Action.Read], 'all');
                can(Action.Read, this.userRepository);
            }
            can([Action.Delete, Action.Update], [this.playlistRepository, this.trackRepository], {owner: user.id});
            can([Action.Add, Action.Read], [this.playlistRepository, this.favouriteSongsRepository, this.trackRepository], {owner: user.id});
            can(Action.Pull, [this.playlistRepository, this.favouriteSongsRepository], {owner: user.id});
            can(Action.Read, this.userRepository, {_id: user.id})

            return build({
                detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
            });
        }
        catch (e) {
            throw new HttpException('Нет доступа!', HttpStatus.FORBIDDEN);
        }
    }
}