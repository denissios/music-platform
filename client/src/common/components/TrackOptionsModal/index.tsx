import React, {FC, useEffect, useRef} from 'react';
import cl from './TrackOptionsModal.module.css';
import {Text} from "../Text";
import {
    useAddToFavouriteMutation, useAddToPlaylistMutation,
    useDeleteFromFavouriteMutation, useDeleteFromPlaylistMutation, useDeleteTrackMutation,
    useGetFavouriteTracksQuery
} from "../../../store/api/tracks";
import {ITrack} from "../../../store/types/track";
import {useOutsideClicker} from "../../hooks/useOutsideClicker";
import AddIcon from '@mui/icons-material/Add';
import {DeleteOutlined} from "@mui/icons-material";
import {createPortal} from "react-dom";
import {checkOutOfBottomScreen} from "../../utils";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import {useGetPlaylistsQuery} from "../../../store/api/playlists";
import Preloader from "../Preloader";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../store/redux";
import {setNextTracks} from "../../../store/slices/playerSlice";
import toast from "react-hot-toast";

interface TrackOptionsModalProps extends React.HTMLAttributes<HTMLElement> {
    track: ITrack,
    visible: boolean,
    onClose: (value: boolean) => void,
    isCreatePortal?: boolean,
    parentRef?: React.RefObject<HTMLElement>,
    isPlaylist?: boolean,
    isOwnerTrack?: boolean
}

const TrackOptionsModal: FC<TrackOptionsModalProps> = ({track, visible, onClose, parentRef,
                                                           isPlaylist = false, isCreatePortal= false,
                                                           isOwnerTrack = false, ...props}) => {
    const dispatch = useAppDispatch();
    const {id: playlistId} = useParams();
    const classesTrackOptions = visible ? [cl.trackOptionsWrapper, cl.visibleTrackOptionsWrapper].join(' ') : cl.trackOptionsWrapper;
    const {nextTracks} = useAppSelector(state => state.playerReducer);
    const [addToFavourite, {isLoading: isLoadingAddToFavourite}] = useAddToFavouriteMutation();
    const [deleteFromFavourite, {isLoading: isLoadingDeleteFromFavourite}] = useDeleteFromFavouriteMutation();
    const [addToPlaylist, {isLoading: isLoadingAddToPlaylist}] = useAddToPlaylistMutation();
    const [deleteFromPlaylist, {isLoading: isLoadingDeleteFromPlaylist}] = useDeleteFromPlaylistMutation();
    const {data: favouriteTracks, isFetching: isLoadingFT} = useGetFavouriteTracksQuery();
    const {data: playlists, isLoading: isLoadingPlaylists} = useGetPlaylistsQuery();
    const [deleteTrack, {isLoading: isLoadingDeleteTrack}] = useDeleteTrackMutation();
    const refPlaylists = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClicker(ref, onClose);

    useEffect(() => {
        if(!visible && parentRef?.current) {
            parentRef.current.style.overflowY = 'auto';
            parentRef.current.style.filter = 'none';
        }
        if(visible && checkOutOfBottomScreen(ref) && ref.current) {
            ref.current.style.top = 'auto';
            ref.current.style.bottom = '0';
            ref.current.style.right = '57%';
        }
        if(visible && checkOutOfBottomScreen(refPlaylists) && refPlaylists.current) {
            refPlaylists.current.style.top = 'auto';
            refPlaylists.current.style.bottom = '0';
        }
    }, [visible])

    const addToFavouriteHandler = () => {
        if(!isLoadingAddToFavourite && !isLoadingFT) {
            addToFavourite(track._id);
        }
    }

    const deleteFromFavouriteHandler = () => {
        if(!isLoadingDeleteFromFavourite && !isLoadingFT) {
            deleteFromFavourite(track._id);
        }
    }

    const addToPlaylistHandler = (playlistId: string) => {
        if(!isLoadingAddToPlaylist) {
            addToPlaylist({trackId: track._id, playlistId})
        }
    }

    const deleteFromPlaylistHandler = (playlistId: string) => {
        if(!isLoadingDeleteFromPlaylist) {
            deleteFromPlaylist({trackId: track._id, playlistId})
        }
    }

    const deleteTrackHandler = (trackId: string) => {
        if(!isLoadingDeleteTrack) {
            deleteTrack(trackId);
        }
    }

    const addToNextHandler = () => {
        dispatch(setNextTracks([track, ...nextTracks]));
        toast.success('Добавлено в очередь следующим');
        onClose(false);
    }

    const returnElem = (
        <div className={classesTrackOptions}>
            <div ref={ref} className={cl.trackOptions} onClick={e => e.stopPropagation()} {...props}>
                {!favouriteTracks?.find(ft => ft._id === track._id)
                    ?   <div className={cl.option} onClick={addToFavouriteHandler}>
                            <Text variant={"xs"} color={"primary"} as={'div'}>Добавить в медиатеку</Text>
                            <AddIcon className={cl.icon}/>
                        </div>
                    :   <div className={cl.option} onClick={deleteFromFavouriteHandler}>
                            <Text variant={"xs"} color={"primary"} as={'div'}>Удалить из медиатеки</Text>
                            <DeleteOutlined className={cl.icon}/>
                        </div>
                }

                <div className={cl.option} onClick={addToNextHandler}>
                    <Text variant={"xs"} color={"primary"} as={'div'}>Воспроизвести далее</Text>
                    <PlaylistPlayIcon className={cl.icon}/>
                </div>

                <div className={cl.option}>
                    <div ref={refPlaylists} className={[cl.playlists, cl.trackOptions].join(' ')}>
                        {!isLoadingPlaylists
                            ?   playlists?.map(p =>
                                <div key={p._id} className={cl.option} onClick={() => addToPlaylistHandler(p._id)}>
                                    <Text variant={"xs"} color={"primary"} as={'div'}>{p.name}</Text>
                                    <QueueMusicIcon className={cl.icon}/>
                                </div>
                            )
                            :   <Preloader/>
                        }
                    </div>
                    <Text variant={"xs"} color={"primary"} as={'div'}>Добавить в плейлист</Text>
                    <KeyboardArrowRightIcon className={cl.icon}/>
                </div>

                {isPlaylist && !!playlistId &&
                    <div className={cl.option} onClick={() => deleteFromPlaylistHandler(playlistId)}>
                        <Text variant={"xs"} color={"primary"} as={'div'}>Удалить из плейлиста</Text>
                        <PlaylistRemoveIcon className={cl.icon}/>
                    </div>
                }

                {isOwnerTrack &&
                    <div className={cl.option} onClick={() => deleteTrackHandler(track._id)}>
                        <Text variant={"xs"} color={"primary"} as={'div'}>Удалить трек</Text>
                        <DeleteForeverOutlinedIcon className={cl.icon}/>
                    </div>
                }
            </div>
        </div>
    )

    return isCreatePortal
        ?   createPortal(returnElem,document.getElementById('parent-div-for-options-modal') ?? document.body )
        :   returnElem
};

export default TrackOptionsModal;