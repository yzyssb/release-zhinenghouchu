import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import CpxxChild from '../../../components/ctgl/cdgl/cpxx/CpxxChildPage';

const TabPane = Tabs.TabPane;

function CpxxPage ({menu,cpdw,dispatch,cpxx,tcxx,cpfl,gggl,zfgl,ksqd,ctglBaseSetting, }) {


 
    const HeaderProps = {
        menu,
        dispatch,
    };

    

    const CpxxProps = {
        cpxx,
        cpfl,
        cpdw,
        zfgl,
        gggl,
        tcxx,
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

function mapStateToProps({menu,cpxx,tcxx,cpfl,gggl,zfgl,cpdw,ksqd ,ctglBaseSetting}) {
    return { menu,cpxx ,tcxx,cpfl,gggl,zfgl,cpdw,ksqd,ctglBaseSetting };
}

export default connect(mapStateToProps)(CpxxPage);

