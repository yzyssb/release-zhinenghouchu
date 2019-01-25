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


function XjbbfxPage ({menu,dispatch}) {
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
            <div onClick={()=>jump('/cwkmgl')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>财务科目管理</div>
            <div onClick={()=>jump('/xjbbInfo')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',cursor:'pointer'}}>现金报表分析</div>
        </div>
      </Header>
    );

}

XjbbfxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu}) {
    return { menu };
}

export default connect(mapStateToProps)(XjbbfxPage);

