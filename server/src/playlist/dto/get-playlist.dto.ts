import {ApiProperty} from "@nestjs/swagger";
import {GetTrackDto} from "../../track/dto/get-track";

export class GetPlaylistDto {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'Название', description: 'Название плейлиста'})
    readonly name: string;

    @ApiProperty({example: 'Текст', description: 'Описание плейлиста'})
    readonly description: string;

    @ApiProperty()
    readonly image: string;

    @ApiProperty({type: [GetTrackDto]})
    readonly tracks: GetTrackDto[];
}