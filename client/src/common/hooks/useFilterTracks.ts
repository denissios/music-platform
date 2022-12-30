import {IOwnerTrack, ITrack} from "../../store/types/track";
import {useMemo} from "react";

const useSorted = (tracks: ITrack[] | IOwnerTrack[], sort: 'name' | 'owner' | 'likes' | '') => {
    return useMemo(() => {
        if(sort) {
            if(sort === 'likes') {
                return [...tracks].sort((a, b) => (b as IOwnerTrack).likes - (a as IOwnerTrack).likes)
            }
            return [...tracks].sort((a, b) => {
                return sort === 'owner' ? a.owner.name.localeCompare(b.owner.name) : a[sort].localeCompare(b[sort]);
            })
        }
        return tracks;
    }, [tracks, sort])
}

export const useFilterTracks = (tracks: ITrack[] | IOwnerTrack[], sort: 'name' | 'owner' | 'likes' | '', filter: string, isOwnerTracks: boolean) => {
    const sortedTracks = useSorted(tracks, sort);

    return useMemo(() => {
        if(filter) {
            return isOwnerTracks
                ?   sortedTracks.filter(st => st.name.includes(filter) || st.genres.map(g => g.name).join(' ').includes(filter))
                :   sortedTracks.filter(st => st.name.includes(filter) || st.owner.name.includes(filter))
        }
        return sortedTracks;
    }, [sortedTracks, filter])
}