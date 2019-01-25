import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Cpyylb_Child from '../../../components/lsyy/cpyylb/Cpyylb_Child';
import Tabs from 'antd/lib/tabs';
import Select from "antd/lib/select";
const TabPane = Tabs.TabPane;

function CpyylbPage ({menu,cpyylb,dispatch,}) {

    const {
       modalVisible,

    } = cpyylb

   

    const HeaderProps = {
        menu,
        dispatch,
    };

   

    const cpyylbchildProps = {
      dispatch,
      cpyylb
    }

    const Option = Select.Option;

    const children=[];

    cpyylb.brandList.length>0 && cpyylb.brandList.map((i,j)=>{

        children.push (
            <Option value={i.key} key={i.key}>{i.value}</Option>
        )

    })

    return(
      <Header {...HeaderProps}>
          请选择品牌：<Select value = {cpyylb.brandId} style = {{ width:180 }} placeholder="请选择" onChange={(e)=>{


          dispatch({
              type: 'cpyylb/updatePayload',
              payload:{
                  brandId:e,
              }
          });

          dispatch({
              type: 'cpyylb/queryChooseBrandList',
              payload:{}
          });

      }} >
          {children}
      </Select>

        <div style={{marginTop:10}}>
         <Cpyylb_Child {...cpyylbchildProps}>
         </Cpyylb_Child>
        </div>

      </Header>
    );

}

CpyylbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cpyylb }) {
    return { menu,cpyylb };
}

export default connect(mapStateToProps)(CpyylbPage);

