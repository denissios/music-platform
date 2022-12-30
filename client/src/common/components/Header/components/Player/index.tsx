import React, {ChangeEvent, FC, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../../store/redux";
import {useLazyGetAudioQuery} from "../../../../../store/api/tracks";
import {
    setActiveTrack,
    setCurrentTime,
    setDuration, setNextTracks,
    setPause,
    setPlay, setPrevTracks,
    setVolume
} from "../../../../../store/slices/playerSlice";
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from "@mui/icons-material/Pause";
import cl from "./Player.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {Text} from "../../../Text";
import InputVolume from "../InputVolume";
import TrackProgress from "../TrackProgress";
import {calculateMinutesSeconds} from "../../../../utils";
import TrackPicture from "../../../TrackPicture";
import {useScreenWidth} from "../../../../hooks/useScreenWidth";

const Player: FC = () => {
    const dispatch = useAppDispatch();
    const screenWidth = useScreenWidth();
    const {audio, currentTime, pause, activeTrack, duration, volume, prevTracks, nextTracks} = useAppSelector(state => state.playerReducer);
    const [getAudio, {data: downloadedAudio}] = useLazyGetAudioQuery();

    useEffect(() => {
        if(activeTrack) {
            getAudio(activeTrack.audio);
        }
    }, [activeTrack])

    useEffect(() => {
        if(downloadedAudio) {
            setAudio();
            pause ? dispatch(setPlay()) : playTrack();
        }
    }, [downloadedAudio])

    useEffect(() => {
        if(activeTrack) {
            playTrack();
        }
    }, [pause])

    const setAudio = () => {
        if (downloadedAudio) {
            audio.src = downloadedAudio;
            audio.volume = volume / 100;
            audio.onloadedmetadata = () => {
                dispatch(setDuration(audio.duration));
            }
            audio.ontimeupdate = () => {
                dispatch(setCurrentTime(audio.currentTime));
            }
        }
    }

    const playTrack = () => {
        if(pause && activeTrack) {
            audio.pause();
        } else if(activeTrack) {
            audio.play();
        }
    }

    const changeCurrentTime = (e: ChangeEvent<HTMLInputElement>) => {
        audio.currentTime = Number(e.target.value);
        dispatch(setCurrentTime(Number(e.target.value)));
    }

    const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100;
        dispatch(setVolume(Number(e.target.value)));
    }

    const playNextHandler = () => {
        if(nextTracks.length && activeTrack) {
            dispatch(setPrevTracks([...prevTracks, activeTrack]));
            dispatch(setActiveTrack(nextTracks[0]));
            dispatch(setNextTracks(nextTracks.slice(1, nextTracks.length)));
        } else if (!prevTracks.length && !nextTracks.length && activeTrack) {
            setAudio();
            playTrack();
        } else if (!nextTracks.length && activeTrack) {
            dispatch(setNextTracks([...prevTracks.slice(1, prevTracks.length), activeTrack]));
            dispatch(setActiveTrack(prevTracks[0]));
            dispatch(setPrevTracks([]));
        }
    }
    const playPrevHandler = () => {
        if(currentTime > 5) {
            setAudio();
            playTrack();
            return;
        }
        if(prevTracks.length && activeTrack) {
            dispatch(setNextTracks([activeTrack, ...nextTracks]));
            dispatch(setActiveTrack(prevTracks[prevTracks.length - 1]));
            dispatch(setPrevTracks(prevTracks.slice(0, prevTracks.length - 1)))
        } else if (!prevTracks.length && !nextTracks.length && activeTrack) {
            setAudio();
            playTrack();
        } else if (!prevTracks.length && activeTrack) {
            dispatch(setPrevTracks([activeTrack, ...nextTracks.slice(0, nextTracks.length - 1)]));
            dispatch(setActiveTrack(nextTracks[nextTracks.length - 1]));
            dispatch(setNextTracks([]))
        }
    }
    useEffect(() => {
        if(activeTrack && duration && !(duration - currentTime)) {
            playNextHandler();
        }
    }, [currentTime])

    const startTime = useMemo(() => {
        const {seconds, minutes} = calculateMinutesSeconds(currentTime);
        return minutes + ":" + (seconds < 10 ? "0" + Math.floor(seconds).toString() : Math.floor(seconds));
    }, [currentTime])
    const remainingTime = useMemo(() => {
        const remainingTime = duration - currentTime;
        const {seconds, minutes} = calculateMinutesSeconds(remainingTime);
        return minutes + ":" + (seconds < 10 ? '0' + Math.floor(seconds).toString() : Math.floor(seconds));
    }, [currentTime])

    return (
        <div className={cl.playerWrapper}>
            <div className={cl.player}>
                <FastRewindIcon className={activeTrack ? cl.icon : cl.notClickableIcon} onClick={playPrevHandler}/>
                {!pause
                    ?   <PauseIcon className={activeTrack ? cl.icon : cl.notClickableIcon} onClick={() => dispatch(setPause())}/>
                    :   <PlayArrowIcon className={activeTrack ? cl.icon : cl.notClickableIcon} onClick={() => dispatch(setPlay())}/>
                }
                <FastForwardIcon className={activeTrack ? cl.icon : cl.notClickableIcon} onClick={playNextHandler}/>
            </div>
            <div className={cl.track}>
                <TrackPicture isShowPicture={!!activeTrack} image={activeTrack ? activeTrack.image : null} size={50}/>
                <div className={cl.trackDescription}>
                    <Text className={cl.trackDescriptionProperty} variant={"xs"} color={"primary"} bold>{activeTrack && activeTrack.name}</Text>
                    <Text className={cl.trackDescriptionProperty} variant={"xs"} color={"primary"}>{activeTrack && activeTrack.owner.name}</Text>
                    {activeTrack && <Text className={cl.startTime} variant={"xxs"} color={"primary"}>{startTime}</Text>}
                    <TrackProgress
                        className={activeTrack ? cl.trackProgress : cl.trackProgressEmpty}
                        max={duration}
                        current={currentTime}
                        onChange={changeCurrentTime}
                    />
                    {activeTrack && <Text className={cl.remainingTime} variant={"xxs"} color={"primary"}>{remainingTime}</Text>}
                </div>
            </div>
            {screenWidth > 992 &&
                <div className={cl.volumeWrapper}>
                    <InputVolume max={100} current={volume} onChange={changeVolume}/>
                </div>
            }
        </div>
    );
};

export default Player;