import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import Tabs from 'antd/lib/tabs';
import BaseInfo from '../../../components/ctgl/jcsz/BaseInfo';
import LocationInfo from '../../../components/ctgl/jcsz/LocationInfo';
import SystemInfo from '../../../components/ctgl/jcsz/SystemInfo';
const TabPane = Tabs.TabPane;
import Spin from 'antd/lib/spin';
import styles from './CtglBaseSetting.less';

function CtglBaseSetting ({menu,ctglBaseSetting,dispatch,xtszPageConfig}) {


    const {
       baseInfo,baseInfoFormRest,loading,locationInfo,cityInfo,imageUrls
    } = ctglBaseSetting;

   
 
    const HeaderProps = {
        menu,
        dispatch,
    };

    const BaseInfoProps = {
        imageUrls,
        baseInfo,
        dispatch,
        ctglBaseSetting,
        baseInfoFormRest
    };



    const LocationInfoProps = {
        locationInfo,
        cityInfo,
        dispatch,
    };

    const SystemInfoProps = {
        xtszPageConfig,
        dispatch,
    };

    function callback(key) {
      if(key=="jbxx"){
          dispatch({
            type: 'ctglBaseSetting/getBase',
            payload: {
            },
          });
      }else if(key=="dzwz"){
        dispatch({
            type: 'ctglBaseSetting/getLocationInfo',
            payload: {
            },
          });
      }
    }

    return(
      <Header {...HeaderProps}>

        <div>
          <Spin spinning={loading} className={styles.load} size="large" />
          <Tabs onChange={callback} >
          <TabPane tab="基本信息" key="jbxx">
            <BaseInfo {...BaseInfoProps}></BaseInfo>
          </TabPane>
          <TabPane tab="地址位置" key="dzwz">
            <LocationInfo {...LocationInfoProps} ></LocationInfo>
          </TabPane>
        </Tabs>
        </div>

      </Header>
    );

}

    // <TabPane tab="绑定收银码" key="bdsym">
          //   <LocationInfo></LocationInfo>
          // </TabPane>
          
CtglBaseSetting.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,ctglBaseSetting,xtszPageConfig }) {
    return { menu,ctglBaseSetting,xtszPageConfig };
}

export default connect(mapStateToProps)(CtglBaseSetting);

