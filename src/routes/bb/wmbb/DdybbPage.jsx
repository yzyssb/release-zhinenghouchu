import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import common from '../common.less';
import {Breadcrumb} from 'antd';
import { TreeSelect,Popover,Icon } from 'antd';
import wmbbStyles from './wmbb.less';

function DdybbPage ({menu,dispatch,ddybb}) {
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
	
	const content=(
		<div className={wmbbStyles.notice}>
			<p className={wmbbStyles.notice_p}>客付价</p>
			<p>用户在线支付订单额</p>
			<p className={wmbbStyles.notice_p}>净收入</p>
			<p>净收入=营业额-平台佣金-商家补贴-部分退款</p>
		</div>
	)
	
	let yearsList=[],year=new Date().getFullYear()
	for(let i=2000;i<=year;i++){
		yearsList.push(i)
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
			type:'ddybb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	const tProps = {
      treeData:[ddybb.obj1],
      value: ddybb.value,
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
		total:ddybb.total+Math.ceil(ddybb.total/ddybb.size),
        current:ddybb.current,
        pageSize: ddybb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        //showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'ddybb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
        	type:'ddybb/takeoutOrderMonthStat',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*(ddybb.size-1);
        dispatch({type: 'ddybb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
        	type:'ddybb/takeoutOrderMonthStat',
        	payload:{}
        })
    }
	
	function searchAction(){
		dispatch({
			type:'ddybb/updatePayload',
			payload:{
				start:0,
				current:1
			}
		}) 
		dispatch({
			type:'ddybb/takeoutOrderMonthStat',
			payload:{}
		})
	}
	
	function loadOut(){
		dispatch({
			type:'ddybb/_export',
			payload:{}
		})
	}

	function yearChange(e){
		dispatch({
    		type:'ddybb/updatePayload',
    		payload:{
    			year:e
    		}
    	})
	}


    function typeChange(e){
    	dispatch({
    		type:'ddybb/updatePayload',
    		payload:{
    			takeOutType:e
    		}
    	})
	}
	
    return(
      <Header {...HeaderProps}>
        <div id="yzy_ddybb" style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>外卖报表</Breadcrumb.Item>
                <Breadcrumb.Item>
					<Popover placement="rightTop" content={content}>
						<span>订单月报表</span>
						<Icon style = {{marginLeft:10}} type="question-circle" />
					</Popover>
				</Breadcrumb.Item>
            </Breadcrumb>
        </div>
		<Spin spinning={ddybb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
		<div className={wmbbStyles.yzy_search}>
            <div>
            	<div className={wmbbStyles.searchBlock}>
                	<span className={wmbbStyles.yzy_txt}>选择时间：</span>
                    <Select value={String(ddybb.year)} style={{width:100}} onChange={yearChange}>
						{yearsList.length>0&&yearsList.map((v,i)=>(<Option key={v}>{v}</Option>))}
					</Select>
                </div>
                <div className={wmbbStyles.searchBlock}>
                    <span className={wmbbStyles.yzy_txt}>外卖平台：</span>
                    <Select value={String(ddybb.takeOutType)} className={wmbbStyles.platform} onChange={typeChange}>
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
            	<Button size="default"  className={wmbbStyles.btn_2} onClick={loadOut}>导出</Button>
            </div>
        </div>
		
		<Table
			className={common.yzy}
			columns={ddybb.columns}
			dataSource={ddybb.list}
			bordered
			pagination={pagination}
			size="small"
			scroll={{x:ddybb.scrollX,y:ddybb.scrollX==false?false:500}}
			rowKey={record=>record.restaurantId}
		/>
      </Header>
    );

}

DdybbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,ddybb}) {
    return { menu,ddybb };
}

export default connect(mapStateToProps)(DdybbPage);

