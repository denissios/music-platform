import {ForbiddenException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {BanUser, BanUserDocument} from "../schemas/ban-user.schema";
import {Model} from "mongoose";
import {BanUserDto} from "../dto/ban-user.dto";

@Injectable()
export class BanUserService {
    constructor(@InjectModel(BanUser.name) private banUserRepository: Model<BanUserDocument>) {}

    async addBannedUser(dto: BanUserDto) {
        if(await this.banUserRepository.findOne({user: dto.userId})) {
            throw new HttpException('Данный пользователь уже забанен!', HttpStatus.BAD_REQUEST);
        }
        await this.banUserRepository.create({user: dto.userId, banReason: dto.banReason, description: dto.description});
    }

    async deleteBanForUser(id: string) {
        return this.banUserRepository.deleteOne({user: id});
    }

    async checkBan(id: string) {
        const banData = await this.banUserRepository.findOne({user: id});
        if(banData) {
            const a = [
                    "Вы забанены!\n\n" +
                    `Причина - ${banData.banReason}\n\n` +
                    `Комментарий - ${banData.description}`
                ]
            throw new ForbiddenException(a)
        }
    }

    async isBanned(id: string): Promise<boolean> {
        return !!await this.banUserRepository.findOne({user: id});
    }
}