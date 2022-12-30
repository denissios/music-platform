export interface IRole {
    id: string,
    name: string
}

export interface IJwtUser {
    id: string,
    email: string,
    name: string,
    roles: IRole[]
}

export interface IUser {
    _id: string,
    email: string,
    name: string,
    isActivated: string,
    roles: IRole[]
}

export interface ISearchedUser {
    _id: string,
    email: string,
    name: string,
    isActivated: string
}