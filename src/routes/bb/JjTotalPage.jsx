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
import Breadcrumb from 'antd/lib/breadcrumb';
import JjtjbPage from './jjtjb/JjtjbPage';
import MdjjxqPage from './mdjjxq/MdjjxqPage';
import GrjjxqPage from './grjjxq/GrjjxqPage';
import message from 'antd/lib/message';


function JjTotalPage ({menu,dispatch,jjtjb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function callback(e){
        console.log(e)
        if(e==2&&!jjtjb.restaurantId){
            message.error('请先选择门店，查看详情')
            return
        }
        if(e==3&&!jjtjb.restaurantId){
            message.error('请先选择门店，查看详情')
            return
        }
        if(e==3&&jjtjb.restaurantId&&jjtjb.employeeId===null){
            message.error('请先选择员工，查看详情')
            return
        }
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{
               activeKey:String(e) 
            }
        })
    }

    function back(){
        window.history.go(-1)
    }

    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>计件分析</Breadcrumb.Item>
                <Breadcrumb.Item>计件统计表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Tabs activeKey={String(jjtjb.activeKey)} onChange={callback}>
            <TabPane tab="计件统计表" key="1">
                <JjtjbPage />
            </TabPane>
            {jjtjb.restaurantId&&(
                <TabPane tab={jjtjb.restaurantName} key="2">
                    <MdjjxqPage />
                </TabPane>
            )}
            {jjtjb.restaurantId&&(jjtjb.employeeId!=null)&&(
                <TabPane tab={jjtjb.employeeName} key="3">
                    <GrjjxqPage />
                </TabPane>
            )}
        </Tabs>
      </Header>
    );

}

JjTotalPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,jjtjb}) {
    return { menu,jjtjb };
}

export default connect(mapStateToProps)(JjTotalPage);
