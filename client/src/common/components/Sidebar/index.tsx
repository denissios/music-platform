import {Input, Modal, Tooltip} from 'antd';
import React, {FC, useRef, useState} from 'react';
import {SearchOutlined} from "@ant-design/icons";
import cl from './Sidebar.module.css'
import {useDebounce, useDebouncedCallback} from "use-debounce";
import SearchedTrackModal from "./components/SearchedTrackModal";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Text} from "../Text";
import {Link} from "react-router-dom";
import {useGetPlaylistsQuery} from "../../../store/api/playlists";
import {getElementHeight} from "../../utils";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CloseIcon from '@mui/icons-material/Close';
import Preloader from "../Preloader";
import AddIcon from "@mui/icons-material/Add";
import AddPlaylist from "./components/AddPlaylist";
import {useScreenWidth} from "../../hooks/useScreenWidth";
import {useAppDispatch, useAppSelector} from "../../../store/redux";
import {closeSidebar} from "../../../store/slices/commonSlice";

const Sidebar: FC = () => {
    const dispatch = useAppDispatch();
    const [isVisibleAddPlaylistModal, setIsVisibleAddPlaylistModal] = useState<boolean>(false);
    const [trackName, setTrackName] = useState<string>('');
    const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
    const {data: playlists, isLoading: isLoadingPlaylists} = useGetPlaylistsQuery();
    const [isVisiblePlaylists, setIsVisiblePlaylists] = useState<boolean>(false);
    const [isOverflowPlaylists, setIsOverflowPlaylists] = useState<boolean>(false);
    const debouncedValue = useDebounce(trackName, 300);
    const refPlaylist = useRef<HTMLDivElement>(null);
    const screenWidth = useScreenWidth();

    const onFocusInputHandler = () => {
        if(trackName) {
            setIsVisibleModal(true);
        }
    }

    const clickPlaylists = () => {
        if(isOverflowPlaylists) {
            setIsOverflowPlaylists(false);
        }
        setIsVisiblePlaylists(!isVisiblePlaylists);
        isOverflowPlaylistsCallback();
    }

    const addPlaylistHandler = (e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisibleAddPlaylistModal(true);
    }

    const isOverflowPlaylistsCallback = useDebouncedCallback(() => setIsOverflowPlaylists(true), 300);

    return (
        <div className={cl.sidebar}>
            {screenWidth <= 992 && <CloseIcon className={cl.closeIcon} onClick={() => dispatch(closeSidebar())}/>}
            <Input
                className={cl.search}
                prefix={<SearchOutlined/>}
                value={trackName}
                onChange={e => setTrackName(e.target.value)}
                onFocus={onFocusInputHandler}
                placeholder={'Найти треки'}
                allowClear
            />
            <SearchedTrackModal
                trackName={debouncedValue[0]}
                visible={isVisibleModal}
                setIsVisible={setIsVisibleModal}
            />

            <Link to={'/'}>
                <div className={cl.menuElem}>
                    <div className={cl.subheaderIconWrapper}>
                        <MusicNoteIcon className={[cl.subheaderIcon, cl.favouriteSongsIcon].join(' ')}/>
                    </div>
                    <Text className={cl.subheader} variant={"body"} color={"primary"}>Медиатека</Text>
                </div>
            </Link>


            <div className={[cl.menuElem, cl.playlistMenuElem].join(' ')} onClick={clickPlaylists}>
                <div className={cl.subheaderIconWrapper}>
                    <QueueMusicIcon className={cl.subheaderIcon}/>
                </div>
                <Text className={cl.subheader} variant={"body"} color={"primary"}>Плейлисты</Text>
                <KeyboardArrowDownIcon
                    className={[cl.arrowIcon, isVisiblePlaylists ? cl.playlistsTop : cl.playlistsBottom].join(' ')}
                />
                <Tooltip title={'Добавить плейлист'}>
                    <AddIcon className={[cl.subheaderIcon, cl.addPlaylistIcon].join(' ')} onClick={addPlaylistHandler}/>
                </Tooltip>
            </div>

            <div
                className={cl.playlistsWrapper}
                style={{height: isVisiblePlaylists ? getElementHeight(refPlaylist) + 10 : 0}}
            >
                {!isLoadingPlaylists
                    ?   <div
                           ref={refPlaylist}
                           className={isVisiblePlaylists ? [cl.playlists, isOverflowPlaylists && cl.isOverflowPlaylists].join(' ') : ''}
                        >
                           {playlists?.map(p =>
                               <Link to={`/playlist/${p._id}`} key={p._id} className={cl.playlist}>
                                   <Text variant={"small"} color={"primary"} as={'div'} boldItalic>{p.name}</Text>
                               </Link>
                           )}
                        </div>
                    :    <Preloader/>
                }
            </div>

            <Modal
                title={<Text variant={"subheader1"} color={"primary"}>Создание плейлиста</Text>}
                footer={null}
                open={isVisibleAddPlaylistModal}
                onCancel={() => setIsVisibleAddPlaylistModal(false)}
            >
                <AddPlaylist setVisibleModal={setIsVisibleAddPlaylistModal}/>
            </Modal>
        </div>
    );
};

export default Sidebar;