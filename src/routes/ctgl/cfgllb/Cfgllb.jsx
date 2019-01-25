import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import CfgllbPage from './CfgllbPage';




function Cfgllb ({menu,dispatch,cfgllb}){
  const HeaderProps = {
        menu,
        dispatch,
    };

    return(
    <Header {...HeaderProps}>

      <CfgllbPage dispatch={dispatch} cfgllb={cfgllb} />

    </Header>
    );

}


Cfgllb.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cfgllb }) {
    return { menu,cfgllb };
}

export default connect(mapStateToProps)(Cfgllb);