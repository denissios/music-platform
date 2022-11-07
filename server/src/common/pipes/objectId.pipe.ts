import {HttpException, HttpStatus, Injectable, PipeTransform} from "@nestjs/common";
import {Types} from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
    transform(value: any): Types.ObjectId {
        if (!Types.ObjectId.isValid(value) || (String)(new Types.ObjectId(value)) !== value) {
            throw new HttpException('id - неверный формат', HttpStatus.BAD_REQUEST);
        }

        return value;
    }
}