import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import styles from '../../stat/bill.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const { MonthPicker } = DatePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import common from '../common.less';
import {Breadcrumb} from 'antd';
import { TreeSelect,Popover,Icon } from 'antd';
import wmbbStyles from './wmbb.less';

function DdrbbPage ({menu,dispatch,ddrbb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };
	
	const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
	
	function back(){
        window.history.go(-1)
    }
	
	function treeChange(value){
		let arr=[],obj={}
		if(value.length>0){
			value.map((v,i)=>{
				let id=v.split('-')[0],name=v.split('-')[1]
				arr.push(id)
				obj[String(id)]=name
			})
		}
		dispatch({
			type:'ddrbb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	const tProps = {
      treeData:[ddrbb.obj1],
      value: ddrbb.value,
      onChange: treeChange,
      treeCheckable: true,
      searchPlaceholder: '请选择门店',
      style: {
        width: 'auto',
        minWidth:334,
        marginTop:20
      },
	  maxTagCount:1,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };
	
	//pagination
	const pagination = {
		total:ddrbb.total+Math.ceil(ddrbb.total/ddrbb.size),
        current:ddrbb.current,
        pageSize: ddrbb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        //showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'ddrbb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
        	type:'ddrbb/takeoutOrderDayStat',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*(ddrbb.size-1);
        dispatch({type: 'ddrbb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
        	type:'ddrbb/takeoutOrderDayStat',
        	payload:{}
        })
    }
	
	function onChange(item,key){
        let startTime=moment(new Date(key[0])).format('YYYY-MM-DD 00:00:00'),
            endTime=moment(new Date(key[1])).format('YYYY-MM-DD 23:59:59')
        dispatch({
            type:'ddrbb/updatePayload',
            payload:{startTime:moment(key[0]).format('YYYY-MM-DD 00:00:00'),endTime:moment(key[1]).format('YYYY-MM-DD 23:59:59'),static_days:'0'}
        })
    }
	
	function searchAction(){
		dispatch({
			type:'ddrbb/updatePayload',
			payload:{
				start:0,
				current:1
			}
		}) 
		dispatch({
			type:'ddrbb/takeoutOrderDayStat',
			payload:{}
		})
	}
	
	function loadOut(){
		dispatch({
			type:'ddrbb/_export',
			payload:{}
		})
	}

	function monthChange(item,key){
        const year=key.split('-')[0],
            month=+(key.split('-')[1])
        dispatch({
            type:'ddrbb/updatePayload',
            payload:{
                year:year,
                month:month
            }
        })
    }

	function typeChange(e){
    	dispatch({
    		type:'ddrbb/updatePayload',
    		payload:{
    			takeOutType:e
    		}
    	})
	}

	const content=(
		<div className={wmbbStyles.notice}>
			<p className={wmbbStyles.notice_p}>客付价</p>
			<p>用户在线支付订单额</p>
			<p className={wmbbStyles.notice_p}>净收入</p>
			<p>净收入=营业额-平台佣金-商家补贴-部分退款</p>
		</div>
	)
	
    return(
      <Header {...HeaderProps}>
        <div id="yzy" style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>外卖报表</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Popover placement="rightTop" content={content}>
						<span>订单日报表</span>
						<Icon style = {{marginLeft:10}} type="question-circle" />
					</Popover>
				</Breadcrumb.Item>
            </Breadcrumb>
        </div>
		<Spin spinning={ddrbb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
		<div className={wmbbStyles.yzy_search}>
            <div>
            	<div className={wmbbStyles.searchBlock}>
                	<span className={wmbbStyles.yzy_txt}>选择年月：</span>
                    <MonthPicker style={{width:200}} onChange={monthChange} allowClear={false} value={moment(ddrbb.year+'-'+ddrbb.month, 'YYYY-MM')} format="YYYY-MM" />
                </div>
                <div className={wmbbStyles.searchBlock}>
                    <span className={wmbbStyles.yzy_txt}>外卖平台：</span>
                    <Select value={String(ddrbb.takeOutType)} className={wmbbStyles.platform} onChange={typeChange}>
						<Option key={0}>全部</Option>
						<Option key={1}>美团</Option>
						<Option key={2}>饿了么</Option>
						{/* <Option key={3}>百度</Option> */}
					</Select>
				</div>
				<div className={wmbbStyles.searchBlock}>
	                <span className={wmbbStyles.yzy_txt}>选择门店：</span>
	                <TreeSelect {...tProps} />
                </div>
                <Button size="default" type="primary" className={wmbbStyles.btn_1} onClick={searchAction}>搜索</Button>
            	<Button size="default" className={wmbbStyles.btn_2} onClick={loadOut}>导出</Button>
            </div>
        </div>
		
		{ddrbb.list.length==0?
			<Table
				className={common.yzy}
				columns={ddrbb.columns}
				dataSource={ddrbb.list}
				bordered
				pagination={pagination}
				size="small"
				rowKey={record=>record.restaurantId}
			/>
		:
			<Table
				className={common.yzy}
				columns={ddrbb.columns}
				dataSource={ddrbb.list}
				bordered
				pagination={pagination}
				size="small"
				scroll={{x:ddrbb.scrollX,y:500}}
				rowKey={record=>record.restaurantId}
			/>
		}
		
      </Header>
    );

}

DdrbbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,ddrbb}) {
    return { menu,ddrbb };
}

export default connect(mapStateToProps)(DdrbbPage);

