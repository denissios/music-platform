import {apiSlice} from "./index";
import {IImage, IOwnerTrack, ITrack} from "../types/track";
import {IGenre} from "../types/genre";

const trackApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSearchedTracks: builder.query<{searchedTracks: ITrack[], totalCount: number}, {trackName: string, page: number, limit: number}>({
            query: (args) => {
                const {trackName, limit, page} = args;
                return `/track/search/?name=${trackName}&page=${page}&limit=${limit}`
            },
            providesTags: ['SearchedTracks'],
            extraOptions: {
                error: 'Не удалось загрузить найденные треки'
            }
        }),

        getAudio: builder.query<string, string>({
            query: (name) => {
                return {
                    url: `/track/audio/${name}`,
                    responseHandler: async (response) => window.URL.createObjectURL(await response.blob())
                }
            },
            providesTags: ['ActiveTrack'],
            extraOptions: {
                error: 'Не удалось загрузить аудио'
            }
        }),

        getImages: builder.query<IImage[], IImage[]>({
            query: (value) => {
                return {
                    url: `/track/images/45`,
                    method: 'POST',
                    body: {
                        value
                    }
                }
            },
            providesTags: ['ImagesForTracks'],
            extraOptions: {
                error: 'Не удалось загрузить картинки'
            }
        }),

        getFavouriteTracks: builder.query<ITrack[], void>({
            query: () => `/track/favourite`,
            providesTags: ['FavouriteTracks'],
            extraOptions: {
                error: 'Не удалось загрузить медиатеку'
            }
        }),

        getOwnerTracks: builder.query<IOwnerTrack[], string>({
            query: (id) => `/track/owner/${id}`,
            providesTags: ['OwnersTracks'],
            extraOptions: {
                error: 'Не удалось загрузить медиатеку'
            }
        }),

        getAllGenres: builder.query<IGenre[], void>({
            query: () => `/genre`,
            providesTags: ['Genres'],
            extraOptions: {
                error: 'Не удалось загрузить жанры'
            }
        }),

        createTrack: builder.mutation<ITrack, FormData>({
            query: (data) => ({
                url: `/track`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['OwnersTracks'],
            extraOptions: {
                error: 'Не удалось создать трек',
                loading: 'Создаем...',
                success: 'Трек создан!'
            },
        }),

        deleteTrack: builder.mutation<ITrack, string>({
            query: (id) => ({
                url: `/track/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['OwnersTracks', 'SearchedTracks', 'FavouriteTracks', 'Playlist'],
            extraOptions: {
                error: 'Не удалось удалить трек',
                loading: 'Удаляем...',
                success: 'Трек удален!'
            },
        }),

        addToFavourite: builder.mutation<string, string>({
            query: (trackId) => ({
                url: `/track/favourite`,
                method: 'POST',
                body: {
                    trackId
                }
            }),
            invalidatesTags: ['FavouriteTracks', 'OwnersTracks'],
            extraOptions: {
                error: 'Не удалось добавить трек',
                loading: 'Добавляем...',
                success: 'Трек добавлен!'
            },
        }),

        deleteFromFavourite: builder.mutation<string, string>({
            query: (trackId) => ({
                url: `/track/favourite`,
                method: 'DELETE',
                body: {
                    trackId
                }
            }),
            invalidatesTags: ['FavouriteTracks', 'OwnersTracks'],
            extraOptions: {
                error: 'Не удалось удалить трек',
                loading: 'Удаляем...',
                success: 'Трек удален!'
            },
        }),

        addToPlaylist: builder.mutation<string, {trackId: string, playlistId: string}>({
            query: ({trackId, playlistId}) => ({
                url: `/track/playlist`,
                method: 'POST',
                body: {
                    trackId,
                    playlistId
                }
            }),
            invalidatesTags: ['Playlist'],
            extraOptions: {
                error: 'Не удалось добавить трек',
                loading: 'Добавляем...',
                success: 'Трек добавлен!'
            },
        }),

        deleteFromPlaylist: builder.mutation<string, {trackId: string, playlistId: string}>({
            query: ({trackId, playlistId}) => ({
                url: `/track/playlist`,
                method: 'DELETE',
                body: {
                    trackId,
                    playlistId
                }
            }),
            invalidatesTags: ['Playlist'],
            extraOptions: {
                error: 'Не удалось удалить трек',
                loading: 'Удаляем...',
                success: 'Трек удален!'
            },
        }),

        getAdminSearchedTracks: builder.query<{searchedTracks: ITrack[], totalCount: number}, {trackName: string, page: number, limit: number}>({
            query: (args) => {
                const {trackName, limit, page} = args;
                return `/track/search/?name=${trackName}&page=${page}&limit=${limit}`
            },
            providesTags: ['AdminSearchedTracks'],
            extraOptions: {
                error: 'Не удалось загрузить найденные треки'
            }
        }),
    })
})

export const {
    useLazyGetSearchedTracksQuery, useLazyGetAudioQuery, useLazyGetImagesQuery,
    useAddToFavouriteMutation, useDeleteFromFavouriteMutation, useGetFavouriteTracksQuery,
    useAddToPlaylistMutation, useDeleteFromPlaylistMutation, useGetAllGenresQuery,
    useCreateTrackMutation, useGetOwnerTracksQuery, useDeleteTrackMutation,
    useLazyGetAdminSearchedTracksQuery
} = trackApiSlice