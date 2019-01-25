import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
const Option=Select.Option
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import CfgllbPage from '../../ctgl/cfgllb/CfgllbPage';
import CmpglPage from '../../ctgl/cmpgl/CmpglPage';

function ZhinenghouchuPage ({menu,dispatch,cfgllb,cmpglPageConfig}) {
    const HeaderProps = {
        menu,
        dispatch,
    };
	
	function callback(e){
		console.log(e)
	}
	
    return(
      <Header {...HeaderProps}>
      	<Tabs defaultActiveKey="1" onChange={callback}>
			<TabPane tab="厨房管理" key="1">
				<CfgllbPage dispatch={dispatch} cfgllb={cfgllb} />
			</TabPane>
			<TabPane tab="触摸屏管理" key="2">
				<CmpglPage dispatch={dispatch} cmpglPageConfig={cmpglPageConfig} />
			</TabPane>
		</Tabs>
      </Header>
    );

}

ZhinenghouchuPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cfgllb,cmpglPageConfig}) {
    return { menu,cfgllb,cmpglPageConfig };
}

export default connect(mapStateToProps)(ZhinenghouchuPage);

