import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Yybz_Child from '../../../components/ctgl/yybz/Yybz_Child';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import ReasonAddModal from '../../../components/ctgl/yybz/ReasonAddModal';

function YybzPage ({menu,yybz,dispatch,}) {

    const {
       modalVisible,

    } = yybz

   

    const HeaderProps = {
        menu,
        dispatch,
    };

   
    const ReasonAddModalProps = {
        visible: modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
          dispatch({
            type: 'yybz/updatePayload',
            payload:{modalVisible:false}
          });
        },
        yybz,
      };

    const yybzchildProps = {
      dispatch,
      yybz
    }

    return(
      <Header {...HeaderProps}>

        <div>
         <Yybz_Child {...yybzchildProps}>
         </Yybz_Child>
         <ReasonAddModal  {...ReasonAddModalProps} />
        </div>

      </Header>
    );

}

YybzPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,yybz }) {
    return { menu,yybz };
}

export default connect(mapStateToProps)(YybzPage);

