import React, {FC, useEffect, useState} from 'react';
import cl from './Playlist.module.css'
import PlaylistPicture from "./components/PlaylistPicture";
import {Text} from "../../common/components/Text";
import {useDeletePlaylistMutation, useGetPlaylistQuery, useLazyGetPlaylistImageQuery} from "../../store/api/playlists";
import {useParams} from "react-router-dom";
import Preloader from "../../common/components/Preloader";
import TrackList from "../../common/components/TrackList";
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {Modal, Popconfirm} from "antd";
import { useNavigate } from 'react-router-dom';
import ChangePlaylist from "./components/ChangePlaylist";

const Playlist: FC = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [isVisibleChangePlaylistModal, setIsVisibleChangePlaylistModal] = useState<boolean>(false);
    const {data: playlist, isLoading: isLoadingPlaylist} = useGetPlaylistQuery(id ?? '');
    const [getPlaylistImage, {data: playlistImage}] = useLazyGetPlaylistImageQuery();
    const [deletePlaylist, {isLoading: isLoadingDeletePlaylist}] = useDeletePlaylistMutation();

    useEffect(() => {
        if(playlist) {
            getPlaylistImage({name: playlist?.image?.split('/')[1], size: 200});
        }
    }, [playlist])

    const deletePlaylistHandler = () => {
        if(!isLoadingDeletePlaylist && playlist) {
            deletePlaylist(playlist?._id)
                .unwrap()
                .then(() => navigate('/'))
                .catch(e => console.log(e));
        }
    }

    return (
        <div>
            {!isLoadingPlaylist
                ?   !!playlist
                    ?   <>
                            <div className={cl.playlistInfoWrapper}>
                                <PlaylistPicture className={cl.playlistPicture} isShowPicture={!!playlist.image} image={playlistImage ?? ''} size={200}/>
                                <div className={cl.playlistInfo}>
                                    <div className={cl.playlistHeaderWrapper}>
                                        <Text variant={"subheader1"} color={"primary"} bold>{playlist.name}</Text>
                                        <BorderColorOutlinedIcon className={cl.changePlaylistIcon} onClick={() => setIsVisibleChangePlaylistModal(true)}/>
                                    </div>
                                    <Text className={cl.playlistDescription} variant={"body"} color={"primary"} as={'div'}>{playlist.description}</Text>
                                    <Popconfirm
                                        placement={'topRight'}
                                        title={'Вы действительно хотите удалить плейлист?'}
                                        onConfirm={deletePlaylistHandler}
                                    >
                                        <div className={cl.deletePlaylistWrapper}>
                                            <Text className={cl.deletePlaylistText} variant={"small"} color={"primary"} as={'div'}>Удалить плейлист</Text>
                                            <DeleteSweepOutlinedIcon className={cl.icon}/>
                                        </div>
                                    </Popconfirm>
                                </div>
                            </div>
                            <TrackList tracks={playlist.tracks} isLoadingTracks={isLoadingPlaylist} isPlaylistTracks/>

                            <Modal
                                title={<Text variant={"subheader1"} color={"primary"}>Изменение плейлиста</Text>}
                                footer={null}
                                open={isVisibleChangePlaylistModal}
                                onCancel={() => setIsVisibleChangePlaylistModal(false)}
                            >
                                <ChangePlaylist playlist={playlist} playlistImage={playlistImage ?? ''} setVisibleModal={setIsVisibleChangePlaylistModal}/>
                            </Modal>
                        </>
                    :   <Text className={cl.emptyPlaylist} variant={"subheader1"} color={"primary"} as={'div'}>Плейлист не найден</Text>
                :   <Preloader size={35}/>
            }
        </div>
    );
};

export default Playlist;