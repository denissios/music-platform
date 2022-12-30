import {ApiProperty} from "@nestjs/swagger";

export class GetGenreDto {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'Реп', description: 'Название жанра'})
    readonly name: string;
}