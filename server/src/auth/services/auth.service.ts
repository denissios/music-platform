import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {RegistrationDto} from "../../user/dto/registration.dto";
import * as bcrypt from 'bcryptjs'
import {UserService} from "../../user/services/user.service";
import {User, UserDocument} from "../../user/schemas/user.schema";
import {TokenService} from "./token.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {BanUserService} from "../../user/services/ban-user.service";
import {LoginDto} from "../../user/dto/login.dto";
import {ForgotPasswordDto} from "../dto/forgot-password.dto";
import {MailService} from "../../user/services/mail.service";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userRepository: Model<UserDocument>,
                private userService: UserService,
                private tokenService: TokenService,
                private banUserService: BanUserService,
                private mailService: MailService) {}

    async registration(dto: RegistrationDto) {
        if(await this.userService.getUserByEmail(dto.email)) {
            throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({...dto, password: hashPassword});

        return this.generateAndSaveTokens(user);
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        await this.banUserService.checkBan(user._id);

        return this.generateAndSaveTokens(user);
    }

    async logout(refreshToken: string) {
        return await this.tokenService.deleteToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if(!refreshToken) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await this.tokenService.getToken(refreshToken);
        if(!userData || !tokenFromDB) {
            await this.tokenService.deleteToken(refreshToken);
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }

        const user = await this.userService.getUser(userData.id);
        await this.banUserService.checkBan(user._id);
        return await this.generateAndSaveTokens(user, refreshToken);
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if(!user || (user && !user.isActivated)) {
            throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
        }

        const token = this.tokenService.usePasswordHashToMakeToken(user);
        await this.mailService.sendPassword(dto.email, `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`)
    }

    private async validateUser(dto: LoginDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if(user) {
            const passwordEquals = await bcrypt.compare(dto.password, user.password);
            if (passwordEquals) {
                return user;
            }
        }
        throw new UnauthorizedException({message: 'Неверный логин или пароль!'});
    }

    private async generateAndSaveTokens(user: UserDocument, oldRefreshToken = '') {
        const tokens = this.tokenService.generateTokens(user);
        await this.tokenService.saveToken(user._id, tokens.refreshToken, oldRefreshToken);
        return {...tokens, user};
    }
}
