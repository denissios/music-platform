import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ActivateUser, ActivateUserDocument} from "../schemas/activate-user.schema";

@Injectable()
export class ActivateUserService {
    constructor(@InjectModel(ActivateUser.name) private activateUserRepository: Model<ActivateUserDocument>) {}

    async addActivationLink(activationLink: string, userId: string) {
        await this.activateUserRepository.create({activationLink, user: userId});
    }

    async deleteActivationLink(activationLink: string) {
        return this.activateUserRepository.findOneAndDelete({activationLink});
    }

    async deleteActivationLinkForUser(id: string) {
        return this.activateUserRepository.deleteOne({user: id});
    }
}