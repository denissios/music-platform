import React, {FC, useEffect, useState} from 'react';
import cl from './TrackList.module.css';
import {Text} from "../Text";
import {useLazyGetImagesQuery} from "../../../store/api/tracks";
import Track from "../Track";
import Preloader from "../Preloader";
import {IImage, IOwnerTrack, ITrack} from "../../../store/types/track";
import {Input, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {useFilterTracks} from "../../hooks/useFilterTracks";
import {useAppDispatch, useAppSelector} from "../../../store/redux";
import {setNextTracks, setPrevTracks} from "../../../store/slices/playerSlice";

interface TrackListProps {
    tracks: ITrack[] | IOwnerTrack[] | undefined,
    isLoadingTracks: boolean,
    isPlaylistTracks?: boolean,
    isOwnerTracks?: boolean
}

type sortType = 'name' | 'owner' | 'likes' | '';

const TrackList: FC<TrackListProps> = ({tracks, isLoadingTracks, isPlaylistTracks = false, isOwnerTracks = false}) => {
    const dispatch = useAppDispatch();
    const {prevTracks, nextTracks} = useAppSelector(state => state.playerReducer);
    const [allImages, setAllImages] = useState<IImage[]>([]);
    const [getImages, {data: images}] = useLazyGetImagesQuery();
    const [sort, setSort] = useState<sortType>('');
    const [filter, setFilter] = useState<string>('');
    const [currentIdxTrack, setCurrentIdxTrack] = useState<number>(-1);

    useEffect(() => {
        (async () => {
            if(tracks) {
                let value: IImage[] = [];
                let count = 0;

                for (const ft of tracks) {
                    value.push({
                        trackId: ft._id,
                        image: ft.image
                    })

                    if(!(++count % Number(process.env.REACT_APP_DOWNLOADING_IMAGES_PORTION)) || count === tracks.length) {
                        await getImages(value);
                        value = [];
                    }
                }
            }
        })()
    }, [tracks])

    useEffect(() => {
        if(images) {
            setAllImages([...allImages, ...images]);
        }
    }, [images])

    const getImage = (trackId: string) => {
        for(const ai of allImages) {
            if(ai.trackId === trackId) {
                return ai.image;
            }
        }
        return "";
    }

    useEffect(() => {
        if(currentIdxTrack !== -1) {
            dispatch(setPrevTracks(tracks?.slice(0, currentIdxTrack).map(t => ({...t, image: getImage(t._id)})) ?? []));
            dispatch(setNextTracks(tracks?.slice(currentIdxTrack + 1, tracks?.length).map(t => ({...t, image: getImage(t._id)})) ?? []));
        }
    }, [currentIdxTrack])

    const sortedAndFilteredTracks = useFilterTracks(tracks ?? [], sort, filter, isOwnerTracks);

    return (
        <div>
            {!isLoadingTracks
                ?   tracks?.length
                    ?   <>
                            <div className={cl.filters}>
                                <Input
                                    className={cl.searchFavouriteTracks}
                                    prefix={<SearchOutlined/>}
                                    value={filter}
                                    onChange={e => setFilter(e.target.value)}
                                    placeholder={'Поиск по медиатеке'}
                                    allowClear
                                />
                                <Select
                                    className={cl.sortFavouriteTracks}
                                    defaultValue="Сортировать"
                                    style={{ width: 120 }}
                                    onChange={e => setSort(e as sortType)}
                                >
                                    <Select.Option value={'name'}>Название</Select.Option>
                                    {isOwnerTracks
                                        ?   <Select.Option value={'likes'}>Лайки</Select.Option>
                                        :   <Select.Option value={'owner'}>Артист</Select.Option>
                                    }
                                </Select>
                            </div>
                            <div className={cl.trackListHeaderWrapper}>
                                <Text className={cl.trackListHeader} variant={"small"} color={"primary"} as={'div'}>Название</Text>
                                {isOwnerTracks
                                    ?   <>
                                            <Text className={cl.trackListHeader} variant={"small"} color={"primary"} as={'div'}>Жанр</Text>
                                            <Text className={cl.trackListHeader} variant={"small"} color={"primary"} as={'div'}>Лайки</Text>
                                        </>
                                    :   <Text className={cl.trackListHeader} variant={"small"} color={"primary"} as={'div'}>Артист</Text>
                                }
                                <Text className={cl.time} variant={"small"} color={"primary"} as={'div'}>Время</Text>
                            </div>
                            {sortedAndFilteredTracks?.map((ft, i) =>
                                <Track
                                    key={ft._id}
                                    track={{...ft, image: getImage(ft._id)}}
                                    index={i}
                                    filter={filter}
                                    isPlaylistTrack={isPlaylistTracks}
                                    isOwnerTrack={isOwnerTracks}
                                    setCurrentIdxTrack={setCurrentIdxTrack}
                                />
                            )}
                        </>
                    :   <Text className={cl.emptyTracks} variant={"subheader1"} color={"primary"} as={'div'}>
                            {isPlaylistTracks ? 'В этом плейлисте пока нет треков' :
                                (isOwnerTracks ? 'Вы пока не добавили ни одного трека' : 'В Вашей медиатеке пока нет треков')}
                        </Text>
                :   <div className={cl.preloaderWrapper}>
                        <Preloader size={35}/>
                    </div>
            }
        </div>
    );
};

export default TrackList;