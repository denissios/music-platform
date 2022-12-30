import React, {FC} from 'react';
import {ConfigProvider, Layout} from "antd";
import ruRU from "antd/es/locale/ru_RU";
import Header from "../../common/components/Header";
import Sidebar from "../../common/components/Sidebar";
import { Outlet } from 'react-router-dom';
import {useAppSelector} from "../../store/redux";
import {useScreenWidth} from "../../common/hooks/useScreenWidth";
import Footer from "../../common/components/Footer";

const MainPage: FC = () => {
    const screenWidth = useScreenWidth();
    const {isOpenSidebar} = useAppSelector(state => state.commonReducer);
    const {activeTrack} = useAppSelector(state => state.playerReducer);

    return (
        <Layout style={{height: '100%'}}>
            <ConfigProvider locale={ruRU}>
                <Layout.Sider className={isOpenSidebar ? 'layout-sider layout-sider-open' : 'layout-sider'}>
                    <Sidebar/>
                </Layout.Sider>

                <Layout>
                    <Layout.Header className='layout-header'>
                        <Header/>
                    </Layout.Header>

                    <Layout.Content className='layout-main'>
                        <Outlet/>
                    </Layout.Content>

                    {screenWidth <= 992 && activeTrack &&
                        <Layout.Footer className='layout-footer'>
                            <Footer/>
                        </Layout.Footer>
                    }
                </Layout>
            </ConfigProvider>
        </Layout>
    );
};

export default MainPage;