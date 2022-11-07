import {ApiProperty} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty} from "class-validator";

export class AddPlayLikesDto {
    @ApiProperty({example: '63513f86a02f86eba5d148f0', description: 'Id трека'})
    @IsNotEmpty()
    @IsMongoId({message: 'Должно быть MongoId'})
    readonly trackId: string;
}