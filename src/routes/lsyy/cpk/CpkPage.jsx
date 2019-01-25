import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import CpdwPage from '../../../components/lsyy/cpk/cpdw/CpdwPage';
import CpxxPage from '../../../components/lsyy/cpk/cpxx/CpxxPage';
import TcxxPage from '../../../components/lsyy/cpk/tcxx/TcxxPage';
import CpflPage from '../../../components/lsyy/cpk/cpfl/CpflPage';
import GgglPage from '../../../components/lsyy/cpk/gggl/GgglPage';
import ZfglPage from '../../../components/lsyy/cpk/zfgl/ZfglPage';
import LabelPage from '../../../components/lsyy/cpk/label/LabelPage';
import KsqdPage from '../../../components/lsyy/cpk/ksqd/KsqdPage';
import ChooseRestaurant from '../../../components/base/usercenter/ChooseRestaurant';
import Select from "antd/lib/select/index";

const TabPane = Tabs.TabPane;

function CdglPage ({menu,lscpdw,dispatch,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lslabel,lsksqd,ctglBaseSetting,login,yybz }) {



    const HeaderProps = {
        menu,
        dispatch,
    };


    const Option = Select.Option;

    const children=[];

    lscpxx.brandList.length>0 && lscpxx.brandList.map((i,j)=>{

        children.push (
            <Option value={i.key} key={i.key}>{i.value}</Option>
        )

    })

    const CpxxProps = {
        lscpxx,
        lscpfl,
        lscpdw,
        lszfgl,
        lsgggl,
        lstcxx,
        lslabel,
        dispatch,
    };

    const TcxxProps = {
        lstcxx,
        lscpxx,
        lscpfl,
        dispatch,
    };

    const CpflProps = {
        lscpfl,
        dispatch,
    };

    const CpdwProps = {
        lscpdw,
        dispatch,
    };
    const GgglProps = {
        lsgggl,
        dispatch,
    };

    const ZfglProps = {
        lszfgl,
        dispatch,
    };

    const LabelProps = {
        lslabel,
        dispatch,
    };

    const KsqdProps = {
        ctglBaseSetting,
        lsksqd,
        dispatch,
    }

    const ChooseProps = {
        lscpfl,
        lstcxx,
        login,
        dispatch,
    }

    function callback(key) {
        dispatch({type: 'lscpxx/updateFood', payload: {tabkey: key}});
    }

    return(
        <Header {...HeaderProps}>

            请选择品牌：<Select value = {lscpxx.brandId} style = {{ width:180 }} placeholder="请选择" onChange={(e)=>{


                dispatch({
                    type: 'lscpxx/updatePayload',
                    payload:{
                        brandId:e,
                    }
                });

                dispatch({
                    type: 'lscpxx/queryChooseBrandList',
                    payload:{}
                });

            }} >
                {children}
            </Select>

            <div>
                <Tabs onChange={callback} activeKey = {lscpxx.tabkey} >
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
                    <TabPane tab="口味标签" key="7">
                        <LabelPage {...LabelProps}></LabelPage>
                    </TabPane>

                    <TabPane tab="菜品排序" key="8">
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

function mapStateToProps({menu,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lslabel,lsksqd ,ctglBaseSetting,login,yybz}) {
    return { menu,lscpxx ,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lslabel,lsksqd,ctglBaseSetting,login,yybz };
}

export default connect(mapStateToProps)(CdglPage);

