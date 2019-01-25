import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import CpyylbEditChild from '../../../components/ctgl/cpyylb/CpyylbEditChild';
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
         <CpyylbEditChild {...cpyylbchildProps}>
         </CpyylbEditChild>
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

