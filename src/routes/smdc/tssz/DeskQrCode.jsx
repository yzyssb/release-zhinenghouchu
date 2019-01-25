import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Header from '../../../components/Header';
import Tabs from 'antd/lib/tabs';
import styles from './DeskQrCode.less';
import Spin from 'antd/lib/spin';
import DeskCodeSetting from '../../../components/smdc/stsz/ztewm/DeskCodeSetting';
import DeskCodeForm from '../../../components/smdc/stsz/ztewm/DeskCodeForm';
import ReserveCode from '../../../components/smdc/stsz/ydewm/ReserveCode';
import ShowCodePage from '../../../components/smdc/stsz/ztewm/ShowCodePage'
import ShowTaCodePage from '../../../components/smdc/stsz/ztewm/ShowTaCodePage'
import BaseInfo from '../../../components/ctgl/jcsz/BaseInfo';
import LocationInfo from '../../../components/ctgl/jcsz/LocationInfo';

const TabPane = Tabs.TabPane;
import WxctcppxPage from '../../../components/smdc/wxctcppx/WxctcppxPage';
import WxSmdcPage from '../../../components/smdc/wxctcppx/WxSmdcPage';
import JcpzPage from '../../../components/smdc/jcpz/JcpzPage';

function DeskQrCode ({menu,deskQrCode,dispatch}) {

    const {
        baseInfo,baseInfoFormRest,loading,locationInfo,cityInfo,pageNo,total,current,isShow,qrCodeList,dataSource,visible,wxState,wxToken,
    } = deskQrCode;

    const HeaderProps = {
        menu,
        dispatch,
    };


    const BaseInfoProps = {
        baseInfo,
        dispatch,
        baseInfoFormRest
    };

    const  CodeSetting = {
        deskQrCode,
        wxState,
        dispatch,
        wxToken,
    };

    const DeskCodeFormProps = {
            pageNo,
            total,
            current,
            dispatch,
            deskQrCode,
            qrCodeList,
    };

    const LocationInfoProps = {
        locationInfo,
        cityInfo,
        dispatch,
    };

    const ReserveCodeProps = {

    };

    const ShowCodePageProps = {
        deskQrCode,
        dispatch,
        onCancel() {
            dispatch({
                type: 'deskQrCode/updateShow',
                payload:{isShow:false}
            });
        },
    };
    const ShowTaCodePageProps = {
        deskQrCode,
        dispatch,
        onCancel() {
            dispatch({
                type: 'deskQrCode/updatePayload',
                payload:{modalVisible:false}
            });
        },
    };


    const WxctcppxPageProps={
        dataSource,
        visible,
        dispatch,
    }

    const WxSmdcPageProps={

        dispatch,
    }

    const jcpzPageProps = {
        deskQrCode,
        dispatch
    }

    function callback(key) {
        if(key=="ztewm"){
            dispatch({
                type: 'deskQrCode/getBase',
                payload: {
                },
            });
            dispatch({
                type: 'wxctcppx/getList',
                payload: {},
            });
        }else if(key=="ydewm"){
            dispatch({
                type: 'deskQrCode/getLocationInfo',
                payload: {
                },
            });
        }else if(key=='wxctcppx'){
            dispatch({
                type: 'deskQrCode/getList',
                payload: {},
            });
        }
    }


    return(
        <Header {...HeaderProps}>
            <Spin spinning={loading} className={styles.load} size="large" />
            <div>
                <Tabs onChange={callback} >
                    {/*<TabPane tab="桌台二维码" key="ztewm">*/}
                        {/*<DeskCodeSetting {...CodeSetting}></DeskCodeSetting>*/}
                        {/*<DeskCodeForm {...DeskCodeFormProps}></DeskCodeForm>*/}
                        {/*<ShowCodePage {...ShowCodePageProps}></ShowCodePage>*/}
                        {/*<ShowTaCodePage {...ShowTaCodePageProps}></ShowTaCodePage>*/}
                    {/*</TabPane>*/}

                    {/*<TabPane tab="预定二维码" key="ydewm">*/}
                        {/*<ReserveCode {...ReserveCodeProps}></ReserveCode>*/}
                    {/*</TabPane>*/}

                    {/*<TabPane tab="微信餐厅菜品排序" key="wxctcppx">*/}
                      {/*<WxctcppxPage {...WxctcppxPageProps} />*/}
                    {/*</TabPane>*/}

                    <TabPane tab="页面配置" key="YMPZ">
                        <WxSmdcPage {...WxSmdcPageProps} />
                    </TabPane>

                    <TabPane tab="基础配置" key="JCPZ">
                        <JcpzPage {...jcpzPageProps} />
                    </TabPane>

                </Tabs>

            </div>
        </Header>
    );

}

DeskQrCode.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,deskQrCode}) {
    return { menu,deskQrCode };
}


export default connect(mapStateToProps)(DeskQrCode);