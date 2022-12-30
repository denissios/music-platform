import React, {FC, useEffect, useRef, useState} from 'react';
import cl from './SearchedUsers.module.css';
import {useLazyGetSearchedUsersQuery} from "../../../../store/api/user";
import {SearchOutlined} from "@ant-design/icons";
import {Input} from "antd";
import {useDebounce} from "use-debounce";
import {useObserve} from "../../../../common/hooks/useObserve";
import {ISearchedUser, IUser} from "../../../../store/types/user";
import SearchedUser from "../SearchedUser";
import {Text} from "../../../../common/components/Text";
import Preloader from "../../../../common/components/Preloader";

const SearchedUserList: FC = () => {
    const [filter, setFilter] = useState<string>('');
    const [getSearchedUsers, {data, isFetching: isLoadingUsers}] = useLazyGetSearchedUsersQuery();
    const [searchedUsers, setSearchedUsers] = useState<ISearchedUser[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const lastElement = useRef(null);
    const parentRef = useRef(null);
    const debouncedValue = useDebounce(filter, 300);

    useEffect(() => {
        if(filter) {
            setSearchedUsers([]);
            getSearchedUsers({value: filter, page: 1, limit});
            setPage(1);
        }
    }, [debouncedValue[0]]);

    useObserve(lastElement, parentRef, page < totalPages, isLoadingUsers, searchedUsers?.length, () => {
        setPage(page + 1);
    })

    useEffect(() => {
        if(filter) {
            getSearchedUsers({value: filter, page, limit});
        }
    }, [page])

    useEffect(() => {
        if(data) {
            setSearchedUsers([...searchedUsers, ...data.searchedUsers]);
            setTotalPages(Math.ceil(data.totalCount / limit));
        }
    }, [data])

    return (
        <div className={cl.wrapper}>
            <Input
                className={cl.searchUsers}
                prefix={<SearchOutlined/>}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder={'Найти пользователя по email или имени'}
                allowClear
            />
            <div ref={parentRef} className={cl.searchedUsersWrapper}>
                {searchedUsers.map(u =>
                    <SearchedUser key={u._id} user={u}/>
                )}
                <div ref={lastElement}/>

                {!isLoadingUsers
                    ?   !searchedUsers?.length && debouncedValue[0] && !data?.searchedUsers.length &&
                            <div className={cl.notFound}>
                                <Text variant={"small"} color={"primary"}>Пользователи не найдены</Text>
                            </div>
                    :   <Preloader/>
                }
            </div>
        </div>
    );
};

export default SearchedUserList;