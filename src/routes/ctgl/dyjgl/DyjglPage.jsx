import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import Spin from 'antd/lib/spin';

import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import DyjdlglPage from '../../../components/ctgl/dyjgl/DyjdlglInfo'
import DyjcpszPage from '../../../components/ctgl/dyjgl/DyjcpszInfo'
import PrinterPage from '../../../components/ctgl/dyjgl/PrinterInfo'


function DyjglPage({ menu, dispatch,dyjglPageConfig,printer }) {
  const HeaderProps = {
    menu,
    dispatch,
  };

  function callback(e){
    if(e=="dydlgl"){
      dispatch({
        type:'dyjglPageConfig/getList',
        payload:{}
      })
    }else if(e=="dycpsz"){  
      dispatch({
        type:'dyjglPageConfig/getListAll',
        payload:{}
      })
      dispatch({
        type:'dyjglPageConfig/getCpList',
        payload:{}
      })
      dispatch({
        type:'dyjglPageConfig/getFoodList',
        payload:{id:0,type:0,printCategoryId:0}
      })
      
    }else if(e=="printergl"){  
      dispatch({
        type:'printer/getList',
        payload:{}
      })
      dispatch({
        type:'printer/getCate',
        payload:{}
      })
    }
  }

  return(
    <Header {...HeaderProps}>
        <Spin spinning={dyjglPageConfig.loading||printer.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
        <div>
          <Tabs onChange={callback} >
            <TabPane tab="出品部门管理" key="dydlgl">
              <DyjdlglPage />
            </TabPane>
            <TabPane tab="打印机管理" key="printergl">
              <PrinterPage />
            </TabPane>
            <TabPane tab="打印菜品设置" key="dycpsz">
              <DyjcpszPage />
            </TabPane>
          </Tabs>
        </div>
      </Header>
  );

}

DyjglPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu,dyjglPageConfig,printer }) {
  return { menu,dyjglPageConfig,printer};
}

export default connect(mapStateToProps)(DyjglPage);