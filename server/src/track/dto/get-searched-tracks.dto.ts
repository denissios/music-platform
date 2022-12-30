import {ApiProperty} from "@nestjs/swagger";
import {GetTrackDto} from "./get-track";

export class GetSearchedTracksDto {
    @ApiProperty({type: [GetTrackDto]})
    readonly searchedTracks: GetTrackDto[];

    @ApiProperty({description: 'Общее количество найденных треков'})
    readonly totalCount: number;
}