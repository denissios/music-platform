import React, {FC, useEffect, useRef, useState} from 'react';
import cl from './SearchedTrackList.module.css';
import {SearchOutlined} from "@ant-design/icons";
import {Input} from "antd";
import {useDebounce} from "use-debounce";
import {useObserve} from "../../../../common/hooks/useObserve";
import {ITrack} from "../../../../store/types/track";
import {useLazyGetAdminSearchedTracksQuery} from "../../../../store/api/tracks";
import {Text} from "../../../../common/components/Text";
import Preloader from "../../../../common/components/Preloader";
import Track from "../../../../common/components/Track";

const SearchedTrackList: FC = () => {
    const [filter, setFilter] = useState<string>('');
    const [getSearchedTracks, {data, isFetching: isLoadingTracks}] = useLazyGetAdminSearchedTracksQuery();
    const [searchedTracks, setSearchedTracks] = useState<ITrack[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteTrackIdx, setDeleteTrackIdx] = useState<number>(-1);
    const lastElement = useRef(null);
    const parentRef = useRef(null);
    const debouncedValue = useDebounce(filter, 300);

    useEffect(() => {
        if(filter) {
            setSearchedTracks([]);
            getSearchedTracks({trackName: filter, page: 1, limit});
            setPage(1);
        }
    }, [debouncedValue[0]]);

    useObserve(lastElement, parentRef, page < totalPages, isLoadingTracks, searchedTracks?.length, () => {
        setPage(page + 1);
    })

    useEffect(() => {
        if(filter) {
            getSearchedTracks({trackName: filter, page, limit});
        }
    }, [page])

    useEffect(() => {
        if(data) {
            setSearchedTracks([...searchedTracks, ...data.searchedTracks]);
            setTotalPages(Math.ceil(data.totalCount / limit));
        }
    }, [data])

    useEffect(() => {
        if(deleteTrackIdx !== -1) {
            const newSearchedTracks = [...searchedTracks];
            newSearchedTracks.splice(deleteTrackIdx, 1);
            setSearchedTracks([...newSearchedTracks]);
        }
    }, [deleteTrackIdx])

    return (
        <div className={cl.wrapper}>
            <Input
                className={cl.searchTracks}
                prefix={<SearchOutlined/>}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder={'Найти трек по названию'}
                allowClear
            />
            <div ref={parentRef} className={cl.searchedTracksWrapper}>
                {searchedTracks.map((t, i) =>
                    <Track key={t._id} track={t} index={i} isAdminPanelTrackList={true} setDeleteTrackAdminIdx={setDeleteTrackIdx}/>
                )}
                <div ref={lastElement}/>

                {!isLoadingTracks
                    ?   !searchedTracks?.length && debouncedValue[0] && !data?.searchedTracks.length &&
                            <div className={cl.notFound}>
                                <Text variant={"small"} color={"primary"}>Треки не найдены</Text>
                            </div>
                    :   <Preloader/>
                }
            </div>
        </div>
    );
};

export default SearchedTrackList;