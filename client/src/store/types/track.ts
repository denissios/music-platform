export interface ITrack {
    _id: string,
    name: string,
    text: string,
    duration: number,
    owner: {
        name: string
    },
    genres: [{
        name: string
    }],
    image: string,
    audio: string
}

export interface IOwnerTrack {
    _id: string,
    name: string,
    text: string,
    duration: number,
    plays: number,
    likes: number,
    owner: {
        name: string
    },
    genres: [{
        name: string
    }],
    image: string,
    audio: string
}

export interface IImage {
    trackId: string,
    image: string
}