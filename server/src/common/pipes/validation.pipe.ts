import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ValidateException} from "../exceptions/validate.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if(metadata.type === 'param' || metadata.type === 'query') {
            return value;
        }

        const obj = plainToInstance(metadata.metatype, value);
        const errors = await validate(obj);

        if(errors.length) {
            const messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            })
            throw new ValidateException(messages);
        }

        return value;
    }
}