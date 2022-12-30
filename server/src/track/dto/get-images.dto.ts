import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

class TrackImages {
    @ApiProperty()
    @IsNotEmpty()
    readonly trackId: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly image: string;
}

export class GetImagesDto {
    @ApiProperty({type: [TrackImages]})
    @IsNotEmpty()
    value: TrackImages[]
}