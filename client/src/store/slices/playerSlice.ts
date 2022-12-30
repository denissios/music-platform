import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITrack} from "../types/track";

export interface IPlayerSlice {
    audio: HTMLAudioElement,
    currentTime: number,
    duration: number,
    activeTrack: ITrack | null,
    volume: number,
    pause: boolean,
    prevTracks: ITrack[],
    nextTracks: ITrack[]
}

const initialState: IPlayerSlice = {
    audio: new Audio(),
    currentTime: 0,
    duration: 0,
    activeTrack: null,
    volume: 50,
    pause: true,
    prevTracks: [],
    nextTracks: []
}

export const playerSlice = createSlice({
    name: 'playerSlice',
    initialState: initialState,
    reducers: {
        setPlay: (state) => {
            state.pause = false;
        },
        setPause: (state) => {
            state.pause = true;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        setActiveTrack: (state, action: PayloadAction<ITrack>) => {
            state.duration = 0;
            state.currentTime = 0;
            state.activeTrack = action.payload;
        },
        setPrevTracks: (state, action: PayloadAction<ITrack[]>) => {
            state.prevTracks = action.payload;
        },
        setNextTracks: (state, action: PayloadAction<ITrack[]>) => {
            state.nextTracks = action.payload;
        },
    }
});

export const { setPlay, setPause, setActiveTrack, setCurrentTime, setDuration, setVolume, setPrevTracks, setNextTracks } = playerSlice.actions;
export default playerSlice.reducer;