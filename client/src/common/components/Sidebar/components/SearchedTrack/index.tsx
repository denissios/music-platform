import React, {FC, useRef, useState} from 'react';
import cl from './Track.module.css';
import {ITrack} from "../../../../../store/types/track";
import {Text} from "../../../Text";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {useAppDispatch, useAppSelector} from "../../../../../store/redux";
import {setPlay, setActiveTrack, setPause} from "../../../../../store/slices/playerSlice";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TrackOptionsModal from "../../../TrackOptionsModal";
import TrackPicture from "../../../TrackPicture";

interface SearchedTrackProps {
    track: ITrack,
    parentRef: React.RefObject<HTMLElement>
}

const SearchedTrack: FC<SearchedTrackProps> = ({track, parentRef}) => {
    const dispatch = useAppDispatch();
    const [offsetTop, setOffsetTop] = useState<number>(0);
    const [isVisibleOptionsModal, setIsVisibleOptionsModal] = useState<boolean>(false);
    const {pause, activeTrack} = useAppSelector(state => state.playerReducer);
    const ref = useRef<HTMLDivElement>(null);

    const playTrack = () => {
        if(activeTrack && activeTrack._id === track._id) {
            pause ? dispatch(setPlay()) : dispatch(setPause());
        } else {
            dispatch(setActiveTrack(track));
        }
    }

    const clickTrackOptions = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if(parentRef.current && ref.current) {
            parentRef.current.style.overflow = 'hidden';
            parentRef.current.style.filter = 'blur(2px)';
            setOffsetTop(ref.current.getBoundingClientRect().top);
        }
        e.stopPropagation();
        setIsVisibleOptionsModal(true);
    }

    return (
        <div ref={ref} className={cl.track} onClick={playTrack}>
            <div className={cl.trackImageWrapper}>
                <TrackPicture className={cl.trackImage} isShowPicture={!!track.image} image={track.image}/>
                {!pause && activeTrack && activeTrack._id === track._id
                    ?   <PauseIcon className={cl.playPause}/>
                    :   <PlayArrowIcon className={cl.playPause}/>
                }
            </div>
            <div className={cl.trackDescription}>
                <Text className={cl.trackName} as={'div'} variant={"xs"} color={"primary"}>{track.name} ({track.owner.name})</Text>
                <Text variant={"xs"} color={"primary"}>
                    Жанр: {track.genres.map((g, i) => g.name + (i !== track.genres.length - 1 ? ', ' : ''))}
                </Text>
            </div>

            <div className={cl.trackOptionsWrapper}>
                <MoreHorizIcon className={cl.trackOptions} onClick={e => clickTrackOptions(e)}/>
            </div>
            <TrackOptionsModal
                track={track}
                visible={isVisibleOptionsModal}
                onClose={setIsVisibleOptionsModal}
                isCreatePortal={true}
                parentRef={parentRef}
                style={{top: offsetTop - 15}}
            />
        </div>
    );
};

export default SearchedTrack;