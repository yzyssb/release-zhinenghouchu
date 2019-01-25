import React, { PropTypes } from 'react';
import Header from '../../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../../components/LeftMenu';
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
import { Radio,InputNumber,Transfer,Switch,Checkbox } from 'antd';
const { TextArea } = Input;
const Option=Select.Option
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import Breadcrumb from 'antd/lib/breadcrumb';

function DprwDetailPage ({menu,dispatch,dprw}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
		total:dprw.total_1,
        current:dprw.current_1,
        pageSize: dprw.size_1,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'dprw/updatePayload',payload:{size_1:pageSize,current_1:1,offset_1:0}});
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*dprw.size_1;
        dispatch({type: 'dprw/updatePayload',payload:{offset_1:offset,current_1:pageNo}});
    }
	
	const columns=[
		{title:'序号',dataIndex:'key',key:'key'},
		{title:'任务名称',dataIndex:'taskName',key:'taskName'},
		{title:'抢单时间1',dataIndex:'timeOne',key:'timeOne'},
		{title:'抢单时间2',dataIndex:'timeTwo',key:'timeTwo'},
		{title:'抢单时间3',dataIndex:'timeThree',key:'timeThree'},
		{title:'抢单时间4',dataIndex:'timeFour',key:'timeFour'},
		{title:'抢单时间5',dataIndex:'timeFive',key:'timeFive'},
	]
	
    function back(){
        window.history.go(-1)
    }

    return(
		<Header {...HeaderProps}>
            <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>店铺任务</Breadcrumb.Item>
                    <Breadcrumb.Item>任务推送时间</Breadcrumb.Item>
                </Breadcrumb>
            </div>
			<Spin spinning={dprw.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
			<Table 
				columns={columns}
				dataSource={dprw.detailList}
				bordered
				pagination={pagination}
			/>
			
		</Header>
    );

}

DprwDetailPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,dprw}) {
    return { menu,dprw };
}

export default connect(mapStateToProps)(DprwDetailPage);

