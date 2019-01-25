import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
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
import common from '../common.less';


function XjbbfxPage ({menu,dispatch,cwkmgl}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formItemLayout={
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    }

    function subjectSearch(e){
        console.log(e.target.value)
        dispatch({
            type:'cwkmgl/updatePayload',
            payload:{
                kw:e.target.value
            }
        })
        if(!e.target.value){
            dispatch({
                type:'cwkmgl/search',
                payload:{}
            })
        }
    }

    
    function inputSearch(){
        dispatch({
            type:'cwkmgl/search',
            payload:{}
        })
    }

    function back(){
        window.history.go(-1)
    }

    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>现金分析</Breadcrumb.Item>
                <Breadcrumb.Item>财务科目管理</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <div style={{marginTop:'20px'}}>
            <Form>
                <Form.Item
                    label="科目" 
                    {...formItemLayout}
                >
                    <Input onChange={subjectSearch} style={{width:'350px'}} onPressEnter={inputSearch} />
                    <Button type="primary" style={{marginLeft:'20px'}} onClick={inputSearch}>搜索</Button>
                </Form.Item>
            </Form>

            <div style={{width:'1000px'}}>
                <Table
                    className={common.yzy}
                    columns={cwkmgl.columns}
                    dataSource={cwkmgl.show_list}
                    bordered
                    pagination={false}
                    size="small"

                />
            </div>
        </div>
      </Header>
    );

}

XjbbfxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cwkmgl}) {
    return { menu,cwkmgl };
}

export default connect(mapStateToProps)(XjbbfxPage);

