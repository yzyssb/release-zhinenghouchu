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
const Option=Select.Option

function DprwPage ({menu,dispatch,dprw}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
		total:dprw.total,
        current:dprw.current,
        pageSize: dprw.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'dprw/updatePayload',payload:{size:pageSize,current:1,offset:0}});
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*dprw.size;
        dispatch({type: 'dprw/updatePayload',payload:{offset:offset,current:pageNo}});
    }
	
	
	const columns=[
		{title:'店铺名称',dataIndex:'restaurantName',key:'restaurantName'},
		{title:'前厅任务',dataIndex:'taskFrontNum',key:'taskFrontNum',render:(text,record,index)=>(<a onClick={()=>goFanganDetail(record,1)}>{record.taskFrontNum+'个任务'}</a>)},
		{title:'后厨任务',dataIndex:'taskAfterNum',key:'taskAfterNum',render:(text,record,index)=>(<a onClick={()=>goFanganDetail(record,2)}>{record.taskAfterNum+'个任务'}</a>)}
	]
	
	function goFanganDetail(record,type){
		dispatch(
			routerRedux.push({
				pathname:'/dprwDetail',
				query:{
					restaurantId:record.restaurantId,
					type:type
				}
			})
		)
	}

	function restaurantNameChange(e){
		dispatch({
			type:'dprw/updatePayload',
			payload:{
				restaurantName:e.target.value
			}
		})
	}

	function searchAction(){
		dispatch({
			type:'dprw/updatePayload',
			payload:{
				offset:0,
				current:1
			}
		})
		dispatch({
			type:'dprw/chainprogrammeRestaurantList',
			payload:{}
		})
	}

	function goDprwPage(){
		dispatch(
			routerRedux.push({
				pathname:'/rwfa',
				query:{}
			})
		)
	}


    return(
      <Header {...HeaderProps}>
      	<Spin spinning={dprw.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
      	<div style={{marginBottom:15,padding:'20px 10px',background:'#eee'}}>
			<span>门店名称</span>
			<Input style={{width:350,marginLeft:10}} value={dprw.restaurantName.length==0?null:dprw.restaurantName} onChange={restaurantNameChange} />
			<Button type="primary" style={{marginLeft:20}} onClick={searchAction}>开始查询</Button>
		</div>
		<Button type="primary" style={{marginBottom:15}} onClick={goDprwPage}>按方案查看任务</Button>
		
		<Table 
			columns={columns}
			dataSource={dprw.list}
			pagination={pagination}
			bordered
		/>
      </Header>
    );

}

DprwPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,dprw}) {
    return { menu,dprw };
}

export default connect(mapStateToProps)(DprwPage);

