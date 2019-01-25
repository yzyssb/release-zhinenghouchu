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


function YybbPage ({menu,dispatch}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function jump(href){
        dispatch(routerRedux.push({
            pathname: href,
            query: { }
        }));
    }
    
    return(
      <Header {...HeaderProps}>
        <div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/yyhzb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>营业汇总表</div>
            <div onClick={()=>jump('/yymxb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',cursor:'pointer'}}>营业明细表</div>
        </div>
        <div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/zdmxb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>账单明细表</div>
            <div onClick={()=>jump('/mdmxb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',cursor:'pointer'}}>免单明细表</div>
        </div>
        <div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/tczcmxb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>退菜赠菜明细表</div>
            <div onClick={()=>jump('/sdfx')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',cursor:'pointer'}}>
            时段分析</div>
        </div>
        {/*<div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/fjzbb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>反结账报表</div>
            <div style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',opacity:'0'}}></div>
        </div>*/}
        <div style={{display:'flex',flexDirection:'row',padding:'20px 20px 10px 20px',fontSize:'24px'}}>
            <div onClick={()=>jump('/ymhzb')} style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',cursor:'pointer'}}>优免汇总表</div>
            <div style={{width:'500px',textAlign:'center',height:'150px',lineHeight:'150px',background:'rgb(242,242,242)',marginLeft:'30px',opacity:'0'}}></div>
        </div>


      </Header>
    );

}

YybbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu}) {
    return { menu };
}

export default connect(mapStateToProps)(YybbPage);

