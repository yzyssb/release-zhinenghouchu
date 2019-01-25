import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';
import CppxChildPage from '../../../components/ctgl/cppx/CppxChildPage';


function CppcPage ({menu,dispatch,sydcppxPageConfig,cppx}){
	const HeaderProps = {
        menu,
        dispatch,
    };

	  return(
		<Header {...HeaderProps}>

			<CppxChildPage dispatch={dispatch} cppx = {cppx} sydcppxPageConfig={sydcppxPageConfig} />

		</Header>
	  );

}


CppcPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,sydcppxPageConfig,cppx }) {
    return { menu,sydcppxPageConfig,cppx };
}

export default connect(mapStateToProps)(CppcPage);