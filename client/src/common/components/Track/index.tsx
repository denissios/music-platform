import React, {FC, useState} from 'react';
import cl from './Track.module.css';
import {IOwnerTrack, ITrack} from "../../../store/types/track";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {Text} from "../Text";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TrackOptionsModal from "../TrackOptionsModal";
import {useAppDispatch, useAppSelector} from "../../../store/redux";
import {setActiveTrack, setPause, setPlay} from "../../../store/slices/playerSlice";
import {calculateMinutesSeconds, makeBold} from "../../utils";
import TrackPicture from "../TrackPicture";
import parse from 'html-react-parser';
import {Button, Popconfirm} from "antd";
import {useDeleteTrackMutation} from "../../../store/api/tracks";
import {useScreenWidth} from "../../hooks/useScreenWidth";

interface TrackProps {
    track: ITrack | IOwnerTrack,
    index: number,
    setCurrentIdxTrack?: (value: number) => void,
    filter?: string,
    isPlaylistTrack?: boolean,
    isOwnerTrack?: boolean,
    isAdminPanelTrackList?: boolean,
    setDeleteTrackAdminIdx?: (value: number) => void
}

const Track: FC<TrackProps> = ({track, index, filter, setCurrentIdxTrack = () => ({}),
                                   isPlaylistTrack = false, isOwnerTrack = false, isAdminPanelTrackList = false,
                                   setDeleteTrackAdminIdx = () => ({})}) => {
    const dispatch = useAppDispatch();
    const screenWidth = useScreenWidth();
    const [isVisibleOptionsModal, setIsVisibleOptionsModal] = useState<boolean>(false);
    const [deleteTrackByAdmin, {isLoading: isLoadingDeleteTrackByAdmin}] = useDeleteTrackMutation();
    const {pause, activeTrack} = useAppSelector(state => state.playerReducer);
    const {seconds, minutes} = calculateMinutesSeconds(track.duration);

    const deleteTrackByAdminHandler = (e: any) => {
        e.stopPropagation();
        if(!isLoadingDeleteTrackByAdmin) {
            deleteTrackByAdmin(track._id)
                .unwrap()
                .then(() => setDeleteTrackAdminIdx(index))
                .catch(e => console.log(e));
        }
    }

    const playTrack = () => {
        setCurrentIdxTrack(index);
        if(activeTrack && activeTrack._id === track._id) {
            pause ? dispatch(setPlay()) : dispatch(setPause());
        } else {
            dispatch(setActiveTrack(track));
        }
    }

    const clickTrackOptions = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        setIsVisibleOptionsModal(true);
    }

    return (
        <div className={index % 2 ? cl.track : [cl.track, cl.trackGrey].join(' ')} onClick={playTrack}>
            <div className={cl.trackImageNameWrapper}>
                {!(isAdminPanelTrackList && screenWidth <= 480) &&
                    <div className={cl.trackImageWrapper}>
                        <TrackPicture className={cl.trackImage} isShowPicture={!!track.image} image={track.image}/>
                        {!pause && activeTrack && activeTrack._id === track._id
                            ? <PauseIcon className={cl.playPause}/>
                            : <PlayArrowIcon className={cl.playPause}/>
                        }
                    </div>
                }
                <Text className={[cl.trackName, cl.trackDescription].join(' ')} as={'div'} variant={"xs"} color={"primary"}>
                    {parse(makeBold(track.name, filter ?? ''))}
                </Text>
                <div className={cl.trackOptionsWrapper} style={{backgroundColor: index % 2 ? 'var(--background-color)' : 'var(--color-light-grey)'}}>
                    <MoreHorizIcon className={cl.trackOptions} onClick={e => clickTrackOptions(e)}/>
                </div>
            </div>
            <Text className={[cl.trackArtist, cl.trackDescription].join(' ')} as={'div'} variant={"xs"} color={"primary"}>
                {isOwnerTrack
                    ?   parse(makeBold(track.genres.map((g, i) => g.name + (i !== track.genres.length - 1 ? ', ' : '')).join(' '), filter ?? ''))
                    :   parse(makeBold(track.owner.name, filter ?? ''))
                }
            </Text>

            {isOwnerTrack &&
                <Text className={cl.likes} as={'div'} variant={"xs"} color={"primary"}>
                    {(track as IOwnerTrack).likes}
                </Text>
            }

            {isAdminPanelTrackList
                ?   <Popconfirm
                        placement={'topRight'}
                        title={'Вы действительно хотите удалить трек?'}
                        onConfirm={deleteTrackByAdminHandler}
                        onCancel={e => e?.stopPropagation()}
                    >
                        <Button className={'buttonRed'} danger onClick={e => e.stopPropagation()}>
                            <Text className={'buttonTextRed'} variant={"small"} color={"red"}>Удалить</Text>
                        </Button>
                    </Popconfirm>
                :   <Text className={cl.trackTime} variant={"xs"} color={"primary"}>
                        {minutes}:{(seconds < 10 ? '0' + seconds.toString() : seconds)}
                    </Text>
            }

            <TrackOptionsModal
                track={track}
                visible={isVisibleOptionsModal}
                onClose={setIsVisibleOptionsModal}
                isPlaylist={isPlaylistTrack}
                isOwnerTrack={isOwnerTrack}
                style={{right: '55%', top: 40}}
            />
        </div>
    );
};

export default Track;