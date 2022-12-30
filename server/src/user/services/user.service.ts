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
import {ResetPasswordDto} from "../dto/ResetPassword.dto";
import {UnbanUserDto} from "../dto/unban-user.dto";

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

    async searchUser(value: string, page: number, limit: number) {
        if(page < 1 || limit < 0) {
            throw new HttpException('Неверные page или limit!', HttpStatus.BAD_REQUEST);
        }

        const searchedUsers = await this.userRepository.find({
                $or: [{name: {$regex: new RegExp(value, 'i')}}, {email: {$regex: new RegExp(value, 'i')}}]
            },
            {password: 0, roles: 0, __v: 0},
            {skip: (page - 1) * limit, limit: limit});
        const totalCount = await this.userRepository.count({
            $or: [{name: {$regex: new RegExp(value, 'i')}}, {email: {$regex: new RegExp(value, 'i')}}]
        });

        return {
            searchedUsers,
            totalCount
        }
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

    async getRoles(userId: string) {
        if(!await this.userRepository.findById(userId)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        const user = await this.userRepository.findById(userId).populate('roles', 'name');
        return user.roles;
    }

    async banUser(dto: BanUserDto) {
        if(!await this.userRepository.findById(dto.userId)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        await this.tokenService.deleteAllTokensForUser(dto.userId);
        await this.banUserService.addBannedUser(dto);
        return dto;
    }

    async unbanUser(dto: UnbanUserDto) {
        if(!await this.userRepository.findById(dto.userId)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        await this.banUserService.deleteBanForUser(dto.userId);
        return dto;
    }

    async isBanUser(userId: string) {
        return await this.banUserService.isBanned(userId);
    }

    async updateUser(id: string, dto: UpdateUserDto, accessToken: string) {
        if(this.tokenService.validateAccessToken(accessToken)?.id !== id) {
            throw new HttpException('Нет доступа!', HttpStatus.FORBIDDEN);
        }
        const candidate = await this.getUserByEmail(dto?.email);
        if(candidate && candidate.id !== id) {
            throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
        }

        let user = await this.userRepository.findById(id);
        if(!user) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }
        if(!dto?.oldPassword || !dto?.password || !await bcrypt.compare(dto?.oldPassword, user?.password)) {
            throw new HttpException('Старый пароль неверный!', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(dto?.password, 5);
        user = await this.userRepository.findByIdAndUpdate(
            id,
            {...dto, password: hashPassword, isActivated: !!candidate},
            {new: true, fields: {password: 0, __v: 0}}
        );

        await this.activateUserService.deleteActivationLinkForUser(id);
        await this.generateAndSaveActivationLink(id, dto?.email);

        return user;
    }

    async updateFieldUser(id: string, dto: UpdateFieldUserDto, accessToken: string) {
        if(this.tokenService.validateAccessToken(accessToken)?.id !== id) {
            throw new HttpException('Нет доступа!', HttpStatus.FORBIDDEN);
        }
        let user = await this.userRepository.findById(id);
        if(!user) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }

        if(dto?.email) {
            const candidate = await this.getUserByEmail(dto?.email);
            if(candidate && candidate.id !== id) {
                throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
            }
            if(!candidate) {
                await this.activateUserService.deleteActivationLinkForUser(id);
                await this.generateAndSaveActivationLink(id, dto?.email);
                await this.userRepository.findByIdAndUpdate(id, {isActivated: false});
            }
        }

        if(dto?.password || dto?.oldPassword) {
            if(!dto?.oldPassword || !dto?.password || !await bcrypt.compare(dto?.oldPassword, user?.password)) {
                throw new HttpException('Старый пароль неверный!', HttpStatus.BAD_REQUEST);
            }

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

    async resetPassword(id: string, token: string, dto: ResetPasswordDto) {
        const user = await this.userRepository.findById(id);
        if(!user) {
            throw new HttpException('Неверная ссылка или срок ее действия истек!', HttpStatus.BAD_REQUEST);
        }

        const secret = process.env.JWT_ACCESS_SECRET + user.password + "-" + user._id.getTimestamp();
        const data = this.tokenService.validateResetPasswordToken(token, secret);
        if(!data || data?.id !== user.id) {
            throw new HttpException('Неверная ссылка или срок ее действия истек!', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(dto?.password, 5);
        await this.userRepository.findByIdAndUpdate(
            user._id,
            {password: hashPassword}
        );
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findOne({email}).populate('roles', 'name');
    }

    async generateAndSaveActivationLink(userId: string, email: string) {
        const activationLink = uuid.v4();
        await this.activateUserService.addActivationLink(activationLink, userId);
        await this.mailService.sendActivation(email, `${process.env.REACT_APP_API_URL}/api/user/activate/${activationLink}`);
    }
}
