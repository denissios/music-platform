import React, {FC} from 'react';
import {useGetFavouriteTracksQuery} from "../../store/api/tracks";
import TrackList from "../../common/components/TrackList";

const FavouriteTracks: FC = () => {
    const {data: favouriteTracks, isLoading: isLoadingFavouriteTracks} = useGetFavouriteTracksQuery();

    return (
        <TrackList tracks={favouriteTracks} isLoadingTracks={isLoadingFavouriteTracks}/>
    );
};

export default FavouriteTracks;