import React, { PropTypes } from 'react';
import Header from '../components/Header';
import { connect } from 'dva';
import LeftMenu from '../components/LeftMenu';

const TestPage = ({menu}) =>

<Header menu={menu}>

      <p>未找到该页面</p>
 </Header>

TestPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({menu }) {
  return { menu };
}

export default connect(mapStateToProps)(TestPage);

