import {ApiProperty} from "@nestjs/swagger";

class Genres {
    @ApiProperty({example: 'Реп', description: 'Жанры'})
    readonly name: string;
}

class Owner {
    @ApiProperty({example: 'Иван', description: 'Создатель'})
    readonly name: string;
}

export class GetTrackDto {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'Название', description: 'Название трека'})
    readonly name: string;

    @ApiProperty({example: 'Текст', description: 'Текст трека'})
    readonly text: string;

    @ApiProperty({description: 'Длительность трека'})
    readonly duration: number;

    @ApiProperty({type: Owner})
    readonly owner: Owner;

    @ApiProperty({type: [Genres]})
    readonly genres: Genres[];

    @ApiProperty()
    readonly audio: string;

    @ApiProperty()
    readonly image: string;
}