import {ApiProperty} from "@nestjs/swagger";

class SearchedUser {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    readonly email: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly name: string;

    @ApiProperty()
    readonly isActivated: boolean;

    @ApiProperty()
    readonly isBanned: boolean;
}

export class GetSearchedUsersDto {
    @ApiProperty({type: [SearchedUser]})
    readonly searchedUsers: SearchedUser[];

    @ApiProperty({description: 'Общее количество найденных пользователей'})
    readonly totalCount: number;
}