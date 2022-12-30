import {apiSlice} from "./index";
import {IRole, ISearchedUser, IUser} from "../types/user";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUser, string>({
            query: (id) => `/user/${id}`,
            providesTags: ['User'],
            extraOptions: {
                error: 'Не удалось загрузить пользователя'
            }
        }),

        saveUserChanges: builder.mutation({
            query: ({id, changes}) => ({
                url: `/user/${id}`,
                method: 'PATCH',
                body: changes
            }),
            invalidatesTags: ['User'],
            extraOptions: {
                error: 'Не удалось изменить данные',
                loading: 'Сохраняем...',
                success: 'Данные сохранены!'
            }
        }),

        getSearchedUsers: builder.query<{searchedUsers: ISearchedUser[], totalCount: number}, {value: string, page: number, limit: number}>({
            query: (args) => {
                const {value, limit, page} = args;
                return `/user/search/?value=${value}&page=${page}&limit=${limit}`
            },
            providesTags: ['SearchedUsers'],
            extraOptions: {
                error: 'Не удалось загрузить найденных пользователей'
            }
        }),

        checkBanUser: builder.query<boolean, string>({
            query: userId => `/user/check-ban/${userId}`,
            providesTags: ['UserBan'],
            extraOptions: {
                error: 'Не удалось получить сведения о бане',
            }
        }),

        banUser: builder.mutation({
            query: ({userId, banReason, description}) => ({
                url: `/user/ban`,
                method: 'POST',
                body: {
                    userId,
                    banReason,
                    description
                }
            }),
            invalidatesTags: ['UserBan'],
            extraOptions: {
                error: 'Не удалось забанить пользователя',
                loading: 'Баним...',
                success: 'Пользователь забанен!'
            }
        }),

        unbanUser: builder.mutation({
            query: (userId) => ({
                url: `/user/unban`,
                method: 'POST',
                body: {
                    userId
                }
            }),
            invalidatesTags: ['UserBan'],
            extraOptions: {
                error: 'Не удалось разбанить пользователя',
                loading: 'Разбаниваем...',
                success: 'Пользователь разбанен!'
            }
        }),

        getRolesForUser: builder.query<IRole[], string>({
            query: userId => `/user/role/${userId}`,
            providesTags: ['UserRoles'],
            extraOptions: {
                error: 'Не удалось получить сведения о ролях',
            }
        }),

        addRoleUser: builder.mutation({
            query: ({userId, roleName}) => ({
                url: `/user/role`,
                method: 'POST',
                body: {
                    userId,
                    roleName
                }
            }),
            invalidatesTags: ['UserRoles'],
            extraOptions: {
                error: 'Не удалось добавить роль пользователю',
                loading: 'Добавляем...',
                success: 'Роль добавлена!'
            }
        }),
    })
})

export const {
    useGetUserQuery, useSaveUserChangesMutation, useLazyGetSearchedUsersQuery,
    useBanUserMutation, useUnbanUserMutation, useCheckBanUserQuery,
    useGetRolesForUserQuery, useAddRoleUserMutation
} = userApiSlice