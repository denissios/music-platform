import {ITrack} from "./track";

export interface IShortPlaylist {
    _id: string,
    name: string,
    description: string
}

export interface IPlaylist {
    _id: string,
    name: string,
    description: string,
    image: string,
    tracks: ITrack[]
}
