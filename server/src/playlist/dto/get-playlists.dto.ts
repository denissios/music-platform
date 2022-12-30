import {ApiProperty} from "@nestjs/swagger";

export class GetPlaylistsDto {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'Название', description: 'Название плейлиста'})
    readonly name: string;

    @ApiProperty({example: 'Текст', description: 'Описание плейлиста'})
    readonly description: string;
}