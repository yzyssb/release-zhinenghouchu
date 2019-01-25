import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Cpyylb_Child from '../../../components/lsyy/cpyylb/Cpyylb_Child';
import Tabs from 'antd/lib/tabs';
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

    return(
      <Header {...HeaderProps}>

        <div>
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

