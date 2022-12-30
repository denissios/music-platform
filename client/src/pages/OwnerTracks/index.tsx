import React, {FC} from 'react';
import cl from './OwnerTracks.module.css';
import TrackList from "../../common/components/TrackList";
import {Text} from "../../common/components/Text";
import {useGetOwnerTracksQuery} from "../../store/api/tracks";
import {useParams} from "react-router-dom";

const OwnerTracks: FC = () => {
    const {id} = useParams();
    const {data: ownerTracks, isLoading: isLoadingOwnerTracks} = useGetOwnerTracksQuery(id ?? '')

    return (
        <div>
            <Text className={cl.header} variant={"subheader1"} color={"primary"} as={'div'}>Мои собственные треки</Text>
            <TrackList tracks={ownerTracks} isLoadingTracks={isLoadingOwnerTracks} isOwnerTracks/>
        </div>
    );
};

export default OwnerTracks;