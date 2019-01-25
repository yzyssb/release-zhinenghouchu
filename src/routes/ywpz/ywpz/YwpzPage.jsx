import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';

import SystemInfo from '../../../components/ctgl/jcsz/SystemInfo';
import SwitchInfo from '../../../components/ywpz/ywpz/SwitchInfo';
const TabPane = Tabs.TabPane;

function YwpzPage ({menu,dispatch,ywpz,xtszPageConfig}) {



    const HeaderProps = {
        menu,
        dispatch,
    };



    const SystemInfoProps = {
        xtszPageConfig,
        dispatch,
    };

    const SwitchInfoProps = {
        ywpz,
        dispatch,
    };

    function callback(key) {
        dispatch({type: 'ywpz/updatePayload', payload: {tabkey: key}});

        if(key=="1"){
            dispatch({
                type: 'xtszPageConfig/getBase',
                payload: {
                },
            });
        }
    }

    return(
        <Header {...HeaderProps}>

            <div>
                <Tabs onChange={callback} activeKey = {ywpz.tabkey} >
                    <TabPane tab="基础配置" key="1">
                        <SystemInfo {...SystemInfoProps} ></SystemInfo>
                    </TabPane>
                    <TabPane tab="业务开关" key="2">
                        <SwitchInfo {...SwitchInfoProps} ></SwitchInfo>
                    </TabPane>

                </Tabs>
            </div>

        </Header>
    );

}

YwpzPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,ywpz,xtszPageConfig}) {
    return { menu,ywpz,xtszPageConfig };
}

export default connect(mapStateToProps)(YwpzPage);

