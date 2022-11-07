import {Injectable} from "@nestjs/common";
import {User, UserDocument} from "../../user/schemas/user.schema";
import * as jwt from "jsonwebtoken";
import * as mongoose from 'mongoose';
import {InjectModel} from "@nestjs/mongoose";
import {Token, TokenDocument} from "../schemas/token.schema";
import {Model} from "mongoose";
import {Role} from "../../role/schemas/role.schema";

interface JwtPayload {
    id: string,
    email: string,
    roles: Role[]
}

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private tokenRepository: Model<TokenDocument>,
                @InjectModel(User.name) private userRepository: Model<UserDocument>) {}

    async saveToken(id: mongoose.Schema.Types.ObjectId, newRefreshToken: string, oldRefreshToken = '') {
        const user = await this.userRepository.findById(id);
        const tokenData = await this.tokenRepository.findOne({user, refreshToken: oldRefreshToken});
        if(tokenData) {
            tokenData.refreshToken = newRefreshToken;
            return await tokenData.save();
        }
        return await this.tokenRepository.create({user: id, refreshToken: newRefreshToken});
    }

    async deleteToken(refreshToken: string) {
        return this.tokenRepository.deleteOne({refreshToken});
    }

    async getToken(refreshToken: string) {
        try {
            return this.tokenRepository.findOne({refreshToken});
        } catch (e) {
            return null;
        }
    }

    async deleteAllTokensForUser(id: string) {
        return this.tokenRepository.deleteMany({user: id});
    }

    generateTokens(user: UserDocument) {
        const payload = {id: user._id, email: user.email, roles: user.roles};
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(accessToken): JwtPayload {
        try {
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as JwtPayload;
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(refreshToken): JwtPayload {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as JwtPayload;
        } catch (e) {
            return null
        }
    }
}