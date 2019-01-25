import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import CpdwPage from '../../../components/ctgl/cdgl/cpdw/CpdwPage';
import CpxxPage from '../../../components/ctgl/cdgl/cpxx/CpxxPage';
import TcxxPage from '../../../components/ctgl/cdgl/tcxx/TcxxPage';
import CpflPage from '../../../components/ctgl/cdgl/cpfl/CpflPage';
import GgglPage from '../../../components/ctgl/cdgl/gggl/GgglPage';
import ZfglPage from '../../../components/ctgl/cdgl/zfgl/ZfglPage';
import KsqdPage from '../../../components/ctgl/cdgl/ksqd/KsqdPage';
import ChooseRestaurant from '../../../components/base/usercenter/ChooseRestaurant';

const TabPane = Tabs.TabPane;

function CdglPage ({menu,cpdw,dispatch,cpxx,tcxx,cpfl,gggl,zfgl,ksqd,ctglBaseSetting,login }) {



    const HeaderProps = {
        menu,
        dispatch,
    };



    const CpxxProps = {
        cpxx,
        cpfl,
        cpdw,
        zfgl,
        gggl,
        tcxx,
        dispatch,
    };

    const TcxxProps = {
        tcxx,
        cpxx,
        cpfl,
        dispatch,
    };

    const CpflProps = {
        cpfl,
        dispatch,
    };

    const CpdwProps = {
        cpdw,
        dispatch,
    };
    const GgglProps = {
        gggl,
        dispatch,
    };

    const ZfglProps = {
        zfgl,
        dispatch,
    };

    const KsqdProps = {
        ctglBaseSetting,
        ksqd,
        dispatch,
    }

    const ChooseProps = {
        cpfl,
        tcxx,
        login,
        dispatch,
    }

    function callback(key) {
        dispatch({type: 'cpxx/updateFood', payload: {tabkey: key}});
    }

    return(
        <Header {...HeaderProps}>

            <div>
                <Tabs onChange={callback} activeKey = {cpxx.tabkey} >
                    <TabPane tab="菜品信息" key="1">
                        <CpxxPage {...CpxxProps}></CpxxPage>
                    </TabPane>
                    <TabPane tab="套餐信息" key="2">
                        <TcxxPage {...TcxxProps}></TcxxPage>
                    </TabPane>
                    <TabPane tab="菜品分类" key="3">
                        <CpflPage {...CpflProps}></CpflPage>
                    </TabPane>

                    <TabPane tab="菜品单位" key="4">

                        <CpdwPage {...CpdwProps}></CpdwPage>

                    </TabPane>

                    <TabPane tab="规格管理" key="5">
                        <GgglPage {...GgglProps}></GgglPage>
                    </TabPane>

                    <TabPane tab="做法管理" key="6">
                        <ZfglPage {...ZfglProps}></ZfglPage>
                    </TabPane>

                    <TabPane tab="可售清单" key="7">
                        <KsqdPage {...KsqdProps}></KsqdPage>
                    </TabPane>
                </Tabs>
            </div>

        </Header>
    );

}

CdglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cpxx,tcxx,cpfl,gggl,zfgl,cpdw,ksqd ,ctglBaseSetting,login}) {
    return { menu,cpxx ,tcxx,cpfl,gggl,zfgl,cpdw,ksqd,ctglBaseSetting,login };
}

export default connect(mapStateToProps)(CdglPage);

