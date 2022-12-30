import {apiSlice} from "./index";
import {IPlaylist, IShortPlaylist} from "../types/playlist";

const playlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaylists: builder.query<IShortPlaylist[], void>({
            query: () => '/playlist',
            providesTags: ['Playlists'],
            extraOptions: {
                error: 'Не удалось загрузить плейлисты'
            }
        }),

        getPlaylist: builder.query<IPlaylist, string>({
            query: (id) => `/playlist/${id}`,
            providesTags: ['Playlist'],
            extraOptions: {
                error: 'Не удалось загрузить плейлист'
            }
        }),

        getPlaylistImage: builder.query<string, {name: string, size: number}>({
            query: ({name, size}) => {
                return {
                    url: `/file/image/${name}/${size}`,
                    responseHandler: async (response) => window.URL.createObjectURL(await response.blob())
                }
            },
            providesTags: ['PlaylistImage'],
            extraOptions: {
                error: 'Не удалось загрузить изображение плейлиста'
            }
        }),

        createPlaylist: builder.mutation<IPlaylist, FormData>({
            query: (data) => ({
                url: `/playlist`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Playlists'],
            extraOptions: {
                error: 'Не удалось создать плейлист',
                loading: 'Создаем...',
                success: 'Плейлист создан!'
            },
        }),

        deletePlaylist: builder.mutation<IPlaylist, string>({
            query: (id) => ({
                url: `/playlist/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlists'],
            extraOptions: {
                error: 'Не удалось удалить плейлист',
                loading: 'Удаляем...',
                success: 'Плейлист удален!'
            },
        }),

        savePlaylistChanges: builder.mutation<IPlaylist, {id: string, changes: FormData}>({
            query: ({id, changes}) => ({
                url: `/playlist/${id}`,
                method: 'PUT',
                body: changes
            }),
            invalidatesTags: ['Playlists', 'Playlist'],
            extraOptions: {
                error: 'Не удалось изменить данные',
                loading: 'Сохраняем...',
                success: 'Данные сохранены!'
            }
        }),
    })
})

export const {
    useGetPlaylistsQuery, useGetPlaylistQuery, useLazyGetPlaylistImageQuery,
    useDeletePlaylistMutation, useCreatePlaylistMutation, useSavePlaylistChangesMutation
} = playlistApiSlice