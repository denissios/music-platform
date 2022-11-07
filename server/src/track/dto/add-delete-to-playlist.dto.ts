import {ApiProperty} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty} from "class-validator";

export class AddDeleteToPlaylistDto {
    @ApiProperty({example: '63513f86a02f86eba5d148f0', description: 'Id трека'})
    @IsNotEmpty()
    @IsMongoId({message: 'Должно быть MongoId'})
    readonly trackId: string;

    @ApiProperty({example: '63513f86a02f86eba5d148f0', description: 'Id плейлиста'})
    @IsNotEmpty()
    @IsMongoId({message: 'Должно быть MongoId'})
    readonly playlistId: string;
}