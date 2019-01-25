import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import LabelDetailPage from '../../../components/lsyy/cpk/label/LabelDetailPage';

const TabPane = Tabs.TabPane;

function CpxxPage ({menu,dispatch,lslabel }) {


 
    const HeaderProps = {
        menu,
        dispatch,
    };

    

    const CpxxProps = {
        lslabel,
        dispatch,
    };

return(
      <Header {...HeaderProps}>

        <div>

            <LabelDetailPage {...CpxxProps}></LabelDetailPage>

        </div>

      </Header>
);

}

CpxxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,lslabel}) {
    return { menu,lslabel};
}

export default connect(mapStateToProps)(CpxxPage);

