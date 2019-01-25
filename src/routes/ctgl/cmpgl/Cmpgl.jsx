import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import CmpglPage from './CmpglPage';

function Cmpgl ({menu,dispatch,cmpglPageConfig}){
  const HeaderProps = {
        menu,
        dispatch,
    };

    return(
    <Header {...HeaderProps}>

      <CmpglPage dispatch={dispatch} cmpglPageConfig={cmpglPageConfig} />

    </Header>
    );

}


Cmpgl.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cmpglPageConfig }) {
    return { menu,cmpglPageConfig };
}

export default connect(mapStateToProps)(Cmpgl);