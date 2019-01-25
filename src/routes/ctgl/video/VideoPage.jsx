import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Video_Child from '../../../components/ctgl/video/Video_Child';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;

function VideoPage ({menu,video,dispatch,}) {

    const {
       modalVisible,

    } = video

   

    const HeaderProps = {
        menu,
        dispatch,
    };

    const videoChildProps = {
      dispatch,
      video
    }

    return(
      <Header {...HeaderProps}>

        <div>
         <Video_Child {...videoChildProps}>
         </Video_Child>
        </div>

      </Header>
    );

}

VideoPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,video }) {
    return { menu,video };
}

export default connect(mapStateToProps)(VideoPage);

