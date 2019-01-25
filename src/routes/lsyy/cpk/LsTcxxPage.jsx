import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import TcxxChild from '../../../components/lsyy/cpk/tcxx/TcxxChildPage';

const TabPane = Tabs.TabPane;

function TcxxPage ({menu,lscpdw,dispatch,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lsksqd,ctglBaseSetting, }) {



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
        dispatch,
    };

    return(
        <Header {...HeaderProps}>

            <div>

                <TcxxChild {...CpxxProps}></TcxxChild>

            </div>

        </Header>
    );

}

TcxxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lsksqd ,ctglBaseSetting}) {
    return { menu,lscpxx,lstcxx,lscpfl,lsgggl,lszfgl,lscpdw,lsksqd,ctglBaseSetting };
}

export default connect(mapStateToProps)(TcxxPage);

