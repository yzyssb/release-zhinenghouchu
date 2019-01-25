import React, { PropTypes } from 'react';
import Header from '../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Checkbox from 'antd/lib/checkbox';
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const { MonthPicker } = DatePicker;
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
import {Breadcrumb} from 'antd';
import JjtjbPage from './jjtjb/JjtjbPage';
import MdjjxqPage from './mdjjxq/MdjjxqPage';
import GrjjxqPage from './grjjxq/GrjjxqPage';
import message from 'antd/lib/message';


function ZdglPage ({menu,dispatch}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function jump(href){
        dispatch(routerRedux.push({
            pathname: href,
            query: {}
        }));
    }

    return(
      <Header {...HeaderProps}>
		<div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/jyzd')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>交易账单</div>
            <div onClick={()=>jump('/zjzd')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',cursor:'pointer'}}>资金账单</div>
        </div>
      </Header>
    );

}

ZdglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu}) {
    return { menu };
}

export default connect(mapStateToProps)(ZdglPage);
