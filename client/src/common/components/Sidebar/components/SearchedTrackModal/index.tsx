import React, {FC, useEffect, useRef, useState} from 'react';
import cl from './SearchedTrackModal.module.css';
import {ITrack} from "../../../../../store/types/track";
import {useOutsideClicker} from "../../../../hooks/useOutsideClicker";
import {Text} from "../../../Text";
import SearchedTrack from "../SearchedTrack";
import Preloader from "../../../Preloader";
import {useObserve} from "../../../../hooks/useObserve";
import {useLazyGetSearchedTracksQuery} from "../../../../../store/api/tracks";

interface SearchedTrackModalProps {
    trackName: string,
    visible: boolean,
    setIsVisible: (value: boolean) => void
}

const SearchedTrackModal: FC<SearchedTrackModalProps> = ({trackName, visible, setIsVisible}) => {
    const classesTrackWrapper = visible ? [cl.mockSearchedTracksModalWrapper, cl.visibleMockTracksWrapper].join(' ') : cl.mockSearchedTracksModalWrapper;
    const [getSearchedTracks, {data, isFetching: isLoadingSearchedTracks}] = useLazyGetSearchedTracksQuery();
    const [searchedTracks, setSearchedTracks] = useState<ITrack[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const lastElement = useRef(null);
    const trackOptionsWrapperRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef(null);
    useOutsideClicker(parentRef, setIsVisible, trackOptionsWrapperRef);

    useEffect(() => {
        if(trackName) {
            setIsVisible(true);
            setSearchedTracks([]);
            getSearchedTracks({trackName, page: 1, limit});
            setPage(1);
        }
    }, [trackName]);

    useObserve(lastElement, parentRef, page < totalPages, isLoadingSearchedTracks, searchedTracks?.length, () => {
        setPage(page + 1);
    })

    useEffect(() => {
        if(trackName) {
            getSearchedTracks({trackName, page, limit});
        }
    }, [page])

    useEffect(() => {
        if(data) {
            setSearchedTracks([...searchedTracks, ...data.searchedTracks]);
            setTotalPages(Math.ceil(data.totalCount / limit));
        }
    }, [data])

    return (
        <div ref={trackOptionsWrapperRef} id='parent-div-for-options-modal' className={classesTrackWrapper}>
            <div ref={parentRef} className={cl.searchedTracksWrapper}>
                {!!searchedTracks?.length &&
                    <>
                        {searchedTracks.map(t =>
                            <div key={t._id} className={cl.track}>
                                <SearchedTrack track={t} parentRef={parentRef}/>
                            </div>
                        )}
                        <div ref={lastElement}/>
                    </>
                }

                {!isLoadingSearchedTracks
                    ?   !searchedTracks?.length &&
                            <div className={cl.notFoundTracks}>
                                <Text variant={"small"} color={"primary"}>Треки не найдены</Text>
                            </div>
                    :   <Preloader/>
                }
            </div>
        </div>
    );
};

export default SearchedTrackModal;