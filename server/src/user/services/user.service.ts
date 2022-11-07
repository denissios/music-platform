import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegistrationDto} from "../dto/registration.dto";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";
import {RoleService} from "../../role/role.service";
import {TokenService} from "../../auth/services/token.service";
import {AddRoleDto} from "../dto/add-role.dto";
import {BanUserDto} from "../dto/ban-user.dto";
import {BanUserService} from "./ban-user.service";
import {UpdateUserDto} from "../dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import * as uuid from 'uuid';
import {UpdateFieldUserDto} from "../dto/update-field-user.dto";
import {ActivateUserService} from "./activate-user.service";
import {MailService} from "./mail.service";
import {FavouriteSongsService} from "../../playlist/services/favourite-songs.service";
import {TrackService} from "../../track/track.service";
import {PlaylistService} from "../../playlist/services/playlist.service";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userRepository: Model<UserDocument>,
                private roleService: RoleService,
                private tokenService: TokenService,
                private banUserService: BanUserService,
                private activateUserService: ActivateUserService,
                private mailService: MailService,
                private favouriteSongsService: FavouriteSongsService,
                private playlistService: PlaylistService,
                private trackService: TrackService) {}

    async createUser(dto: RegistrationDto) {
        if(await this.getUserByEmail(dto.email)) {
            throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
        }
        let defaultRole = await this.roleService.getRoleByName('USER');
        if(!defaultRole) {
            defaultRole = await this.roleService.createRole({
                name: 'USER',
                description: 'Роль по умолчанию'
            })
        }

        const user = await this.userRepository.create(dto);

        defaultRole.users = [...defaultRole.users, user._id];
        user.roles = [defaultRole];
        await user.save();
        await defaultRole.save();

        await this.generateAndSaveActivationLink(user._id, dto.email);
        await this.favouriteSongsService.createFavouriteSongsPlaylist(user._id);
        return user;
    }

    async activateUser(activationLink: string) {
        const linkData = await this.activateUserService.deleteActivationLink(activationLink);
        if(!linkData) {
            return;
        }
        await this.userRepository.findByIdAndUpdate(linkData.user,{isActivated: true});
    }

    async getAllUsers() {
        return this.userRepository.find({}, {password: 0, __v: 0}).populate('roles', 'name');
    }

    async getUser(id: string) {
        const user = await this.userRepository.findById(id, {password: 0, __v: 0}).populate('roles', 'name');
        if(!user) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findByIdAndDelete(id);
        if(!user) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        await this.roleService.deleteUserRefs(id, user.roles)
        await this.activateUserService.deleteActivationLinkForUser(id);
        await this.tokenService.deleteAllTokensForUser(id);
        await this.banUserService.deleteBanForUser(id);
        await this.favouriteSongsService.deleteFavouriteSongsPlaylistForUser(id);
        await this.playlistService.deletePlaylistsForUser(id);
        await this.trackService.deleteTracksForUser(id);

        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findById(dto.userId);
        const role = await this.roleService.getRoleByName(dto.roleName);
        if(!user || !role) {
            throw new HttpException('Пользователь или роль не найдены!', HttpStatus.NOT_FOUND);
        }
        if(user.roles.includes(role._id)) {
            throw new HttpException('Такая роль у пользователя уже существует!', HttpStatus.BAD_REQUEST);
        }

        await this.userRepository.findByIdAndUpdate(
            user.id,
            {$push: {roles: role._id}}
        )
        role.users = [...role.users, user._id];
        await role.save();
        return dto;
    }

    async banUser(dto: BanUserDto) {
        if(!await this.userRepository.findById(dto.userId)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        await this.tokenService.deleteAllTokensForUser(dto.userId);
        await this.banUserService.addBannedUser(dto);
        return dto;
    }

    async updateUser(id: string, dto: UpdateUserDto, accessToken: string) {
        if(this.tokenService.validateAccessToken(accessToken).id !== id) {
            throw new HttpException('Нет доступа!', HttpStatus.FORBIDDEN);
        }
        if(await this.getUserByEmail(dto?.email)) {
            throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.findByIdAndUpdate(
            id,
            {...dto, password: hashPassword, isActivated: false},
            {new: true, fields: {password: 0, __v: 0}}
        );
        if(!user) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        await this.activateUserService.deleteActivationLinkForUser(id);
        await this.generateAndSaveActivationLink(id, dto?.email);

        return user;
    }

    async updateFieldUser(id: string, dto: UpdateFieldUserDto, accessToken: string) {
        if(this.tokenService.validateAccessToken(accessToken).id !== id) {
            throw new HttpException('Нет доступа!', HttpStatus.FORBIDDEN);
        }
        if(!await this.userRepository.findById(id)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }

        if(dto?.email) {
            if(await this.getUserByEmail(dto?.email)) {
                throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
            }
            await this.activateUserService.deleteActivationLinkForUser(id);
            await this.generateAndSaveActivationLink(id, dto?.email);
            await this.userRepository.findByIdAndUpdate(id, {isActivated: false});
        }

        let user;
        if(dto?.password) {
            const hashPassword = await bcrypt.hash(dto?.password, 5);
            user = await this.userRepository.findByIdAndUpdate(id,
                {...dto, password: hashPassword},
                {new: true, fields: {password: 0, __v: 0}}
            );
        } else {
            user = await this.userRepository.findByIdAndUpdate(
                id,
                dto,
                {new: true, fields: {password: 0, __v: 0}}
            );
        }
        return user;
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findOne({email});
    }

    async generateAndSaveActivationLink(userId: string, email: string) {
        const activationLink = uuid.v4();
        await this.activateUserService.addActivationLink(activationLink, userId);
        await this.mailService.sendActivation(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
    }
}
