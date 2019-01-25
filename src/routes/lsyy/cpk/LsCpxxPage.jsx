import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import CpxxChild from '../../../components/lsyy/cpk/cpxx/CpxxChildPage';

const TabPane = Tabs.TabPane;

function CpxxPage ({menu,lscpdw,dispatch,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lsksqd,lslabel,ctglBaseSetting, }) {


 
    const HeaderProps = {
        menu,
        dispatch,
    };

    

    const CpxxProps = {
        lscpxx,
        lscpfl,
        lscpdw,
        lszfgl,
        lsgggl,
        lstcxx,
        lslabel,
        dispatch,
    };

return(
      <Header {...HeaderProps}>

        <div>

            <CpxxChild {...CpxxProps}></CpxxChild>

        </div>

      </Header>
);

}

CpxxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lsksqd,lslabel,ctglBaseSetting}) {
    return { menu,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lsksqd,lslabel,ctglBaseSetting };
}

export default connect(mapStateToProps)(CpxxPage);

