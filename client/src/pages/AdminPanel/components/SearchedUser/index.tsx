import React, {FC, useState} from 'react';
import cl from './SearchedUser.module.css';
import {Button, Modal} from "antd";
import {Text} from "../../../../common/components/Text";
import {ISearchedUser} from "../../../../store/types/user";
import {useCheckBanUserQuery, useUnbanUserMutation} from "../../../../store/api/user";
import BanUser from "../BanUser";
import Preloader from "../../../../common/components/Preloader";
import RolesUser from "../RolesUser";

interface SearchedUserProps {
    user: ISearchedUser
}

const SearchedUser: FC<SearchedUserProps> = ({user}) => {
    const [isVisibleBanModal, setIsVisibleBanModal] = useState<boolean>(false);
    const [isVisibleRoleModal, setIsVisibleRoleModal] = useState<boolean>(false);
    const [unbanUser, {isLoading: isLoadingUnbanUser}] = useUnbanUserMutation();
    const {data: isBan, isLoading: isLoadingIsBanUser} = useCheckBanUserQuery(user._id);

    const unbanUserHandler = () => {
        if(!isLoadingUnbanUser) {
            unbanUser(user._id);
        }
    }

    return (
        <div className={cl.user}>
            <div className={cl.userPropsWrapper}>
                <Text className={cl.userProps} variant={"small"} color={"primary"}>{user.email}</Text>
            </div>
            <div className={cl.userPropsWrapper}>
                <Text className={cl.userProps} variant={"small"} color={"primary"}>{user.name}</Text>
            </div>

            <Button className={['buttonGreen', cl.role].join(' ')} onClick={() => setIsVisibleRoleModal(true)}>
                <Text className={'buttonTextGreen'} variant={"small"} color={"green"}>Роли</Text>
            </Button>

            {!isLoadingIsBanUser
                ?   isBan
                    ?   <Button className={'buttonGreen'} onClick={unbanUserHandler}>
                            <Text className={'buttonTextGreen'} variant={"small"} color={"green"}>Разбанить</Text>
                        </Button>
                    :   <Button className={'buttonRed'} danger onClick={() => setIsVisibleBanModal(true)}>
                            <Text className={'buttonTextRed'} variant={"small"} color={"red"}>Забанить</Text>
                        </Button>
                :   <div>
                        <Preloader/>
                    </div>
            }

            <Modal
                title={<Text variant={"subheader1"} color={"primary"}>Причина бана</Text>}
                footer={null}
                open={isVisibleBanModal}
                onCancel={() => setIsVisibleBanModal(false)}
            >
                <BanUser userId={user._id} setIsVisibleModal={setIsVisibleBanModal}/>
            </Modal>
            <Modal
                title={<Text variant={"subheader1"} color={"primary"}>Роли</Text>}
                footer={null}
                open={isVisibleRoleModal}
                onCancel={() => setIsVisibleRoleModal(false)}
            >
                <RolesUser user={user} setIsVisibleModal={setIsVisibleRoleModal}/>
            </Modal>
        </div>
    );
};

export default SearchedUser;