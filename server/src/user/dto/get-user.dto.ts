import {ApiProperty} from "@nestjs/swagger";

export class Role {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty()
    readonly name: string;
}

export class GetUserDto {
    @ApiProperty()
    readonly _id: string;

    @ApiProperty({example: 'example@email.com', description: 'Почта'})
    readonly email: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly name: string;

    @ApiProperty()
    readonly isActivated: boolean;

    @ApiProperty({type: [Role]})
    readonly roles: Role[];
}