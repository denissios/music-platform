import React, {FC} from 'react';
import cl from './AdminPanel.module.css';
import SearchedUserList from "./components/SearchedUserList";
import SearchedTrackList from "./components/SearchedTrackList";
import {Text} from "../../common/components/Text";

const AdminPanel: FC = () => {
    return (
        <div className={cl.adminPanelWrapper}>
            <Text variant={"header"}>Панель администратора</Text>

            <SearchedUserList/>
            <SearchedTrackList/>
        </div>
    );
};

export default AdminPanel;