import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Header from '../../../components/Header';
import PageSetting from '../../../components/smdc/smdcsz/fmsz/PageSetting';
import Tabs from 'antd/lib/tabs';
import styles from './PageSettingRoute.less';
import Spin from 'antd/lib/spin';
import WxSetting from '../../../components/smdc/smdcsz/gzhsz/WxSetting';

//切换view
import BaseInfo from '../../../components/ctgl/jcsz/BaseInfo';
import LocationInfo from '../../../components/ctgl/jcsz/LocationInfo';

const TabPane = Tabs.TabPane;

function PageSettingRoute ({menu,pageSettingRoute,dispatch}) {

    const {
        baseInfo,baseInfoFormRest,loading,locationInfo,cityInfo,activeTab,turnWxUrl,showAgree,
        showRemake,showImg,
    } = pageSettingRoute;

    const HeaderProps = {
        menu,
        dispatch,
    };



    const BaseInfoProps = {
        baseInfo,
        dispatch,
        baseInfoFormRest
    };

    const PageSettingProps = {
        dispatch,
        pageSettingRoute,
        showImg
    }

    const WxSettingProps = {
        dispatch,
        turnWxUrl,
        showAgree,
        showRemake,
    };

    const WxUrl = {
        turnWxUrl,

    };


    const LocationInfoProps = {
        locationInfo,
        cityInfo,
        dispatch,
    };

    function callback(key) {
        if(key=="fmsz"){
            dispatch({
                type: 'pageSettingRoute/getBase',
                payload: {
                },
            });
            dispatch({
                type:'pageSettingRoute/updatePayload',
                payload: {
                    activeTab:'fmsz'
                },
            });
        }else if(key=="ewmsz"){

            dispatch({
                type:'pageSettingRoute/updatePayload',
                payload: {
                    activeTab:'ewmsz'
                },
            });
        }
    }


    return(
        <Header {...HeaderProps}>
            <Spin spinning={loading} className={styles.load} size="large" />
           <div>
               <Tabs onChange={callback} activeKey={activeTab}>
                   <TabPane tab="封面设置" key="fmsz">
                       <PageSetting {...PageSettingProps}></PageSetting>
                   </TabPane>
               </Tabs>
           </div>

        </Header>
    );

}

PageSettingRoute.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,pageSettingRoute}) {
    return { menu,pageSettingRoute };
}


export default connect(mapStateToProps)(PageSettingRoute);