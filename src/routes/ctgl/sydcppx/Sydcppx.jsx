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
import SydcppxPage from './SydcppxPage';


function Sydcppx ({menu,dispatch,sydcppxPageConfig}){
	const HeaderProps = {
        menu,
        dispatch,
    };

	  return(
		<Header {...HeaderProps}>

			<SydcppxPage dispatch={dispatch} sydcppxPageConfig={sydcppxPageConfig} />

		</Header>
	  );

}


Sydcppx.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,sydcppxPageConfig }) {
    return { menu,sydcppxPageConfig };
}

export default connect(mapStateToProps)(Sydcppx);