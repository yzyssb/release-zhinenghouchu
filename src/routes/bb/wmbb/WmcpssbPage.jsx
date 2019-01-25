import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import common from '../common.less';
import {Breadcrumb} from 'antd';
import { TreeSelect,Popover,Icon,Input } from 'antd';
import wmbbStyles from './wmbb.less';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;

function WmcpssbPage ({menu,dispatch,wmcpssb}) {
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
			<p>1、实售单价=菜品实收/售卖数量</p>
			<p>2、菜品应收=菜品单价*售卖数量</p>
			<p>3、菜品实收=该菜在所有账单中实收汇总</p>
			<p>4、实收日均=菜品实收/所选日期天数</p>
			<p>5、实收额占比=菜品实收/总菜品实收</p>
			<p>6、售卖占比=售卖数量/总菜品售卖量</p>
			<p>7、日均销量=售卖数量/所选日期天数</p>
			<p>8、日均销量占比=日均销量/总日均销量</p>
			<p>9、售卖数量=有效订单数+部分退款单中未被退掉的菜</p>
		</div>
	)
	
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
			type:'wmcpssb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	const tProps = {
      treeData:[wmcpssb.obj1],
      value: wmcpssb.value,
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
		total:wmcpssb.total+Math.ceil(wmcpssb.total/wmcpssb.size),
        current:wmcpssb.current,
        pageSize: wmcpssb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        //showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'wmcpssb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
        	type:'wmcpssb/takeoutFoodStat',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*(wmcpssb.size-1);
        dispatch({type: 'wmcpssb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
        	type:'wmcpssb/takeoutFoodStat',
        	payload:{}
        })
    }
	
	const columns=[
		{title:'序号',dataIndex:'rank',key:'rank',className:common.right,render:(text,record,index)=>(
			<span>{wmcpssb.size*(wmcpssb.current-1)+index+1}</span>
		)},
		{title:'菜品名称',dataIndex:'foodName',key:'foodName'},
		{title:'规格',dataIndex:'specName',key:'spceName'},
		{title:'单位',dataIndex:'unitName',key:'unitName'},
		{title:'菜品分类',dataIndex:'categoryName',key:'categoryName'},

		{title:'菜品单价',dataIndex:'singlePrice',key:'singlePrice',className:common.right},
		{title:'实售单价',dataIndex:'realPrice',key:'realPrice',className:common.right},
		{title:'售卖数量',dataIndex:'num',key:'num',className:common.right},
		{title:'菜品应收',dataIndex:'amtNeed',key:'amtNeed',className:common.right},
		{title:'菜品实收',dataIndex:'amtRecv',key:'amtRecv',className:common.right},

		{title:'实收日均',dataIndex:'avgAmtDay',key:'avgAmtDay',className:common.right},
		{title:'售卖占比',dataIndex:'numProportion',key:'numProportion',className:common.right},
		{title:'实收额占比',dataIndex:'realProportion',key:'realProportion',className:common.right},
		{title:'日均销量',dataIndex:'avgNumDay',key:'avgNumDay',className:common.right},
		{title:'日均销量占比',dataIndex:'avgNumDayProportion',key:'avgNumDayProportion',className:common.right},		
	]
	
	//时间修改
	function onChange(item,key){
		dispatch({
            type:'wmcpssb/updatePayload',
            payload:{startTime:moment(key[0]),endTime:moment(key[1]),static_days:'0'}
        })
    }

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
        if(t==0){
            startTime=moment().startOf("month")
            endTime=moment().endOf("day")
        }else if(t==1){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==2){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==7){
            startTime=moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'wmcpssb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }
	
	//搜索
	function searchAction(){
		dispatch({
			type:'wmcpssb/updatePayload',
			payload:{
				start:0,
				current:1
			}
		}) 
		dispatch({
			type:'wmcpssb/takeoutFoodRealRecv',
			payload:{}
		})
	}
	
	//导出
	function loadOut(){
		dispatch({
			type:'wmcpssb/_export',
			payload:{}
		})
	}

	//外卖平台修改
	function typeChange(e){
    	dispatch({
    		type:'wmcpssb/updatePayload',
    		payload:{
    			takeOutType:e
    		}
    	})
    }

    //菜品名称修改
    function nameChange(e){
    	dispatch({
            type:'wmcpssb/updatePayload',
            payload:{
                foodName:e.target.value
            }
        })
	}

	function foodTypeChange(e){
		dispatch({
            type:'wmcpssb/updatePayload',
            payload:{
                foodType:e
            }
        })
	}

	//排序修改
	function orderByTypeChange(e){
		dispatch({
            type:'wmcpssb/updatePayload',
            payload:{
                orderByType:e.target.value
            }
        })
	}
	
	
    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>外卖报表</Breadcrumb.Item>
                <Breadcrumb.Item>
					<Popover placement="rightTop" content={content}>
						<span>外卖菜品实收表</span>
						<Icon style = {{marginLeft:10}} type="question-circle" />
					</Popover>
				</Breadcrumb.Item>
            </Breadcrumb>
        </div>
		<Spin spinning={wmcpssb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
		<div className={wmbbStyles.yzy_search}>
            <div>
            	<div className={wmbbStyles.searchBlock}>
                	<span className={wmbbStyles.yzy_txt}>选择时间：</span>
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={[moment(wmcpssb.startTime), moment(wmcpssb.endTime)]}
	                  allowClear={false}
	                  onChange={onChange}
                      className={wmbbStyles.yzy_datePicker}
                    />
                    <Select value={String(wmcpssb.static_days)} className={wmbbStyles.periods_1} onChange={chooseDuration}>
                    	<Select.Option key="0">请选择时间跨度</Select.Option>
                        <Select.Option key="1">昨天</Select.Option>
                        <Select.Option key="2">今天</Select.Option>
                        <Select.Option key="7">近7天</Select.Option>
                        <Select.Option key="15">近15天</Select.Option>
                        <Select.Option key="30">近30天</Select.Option>
                    </Select>
                </div>
                <div className={wmbbStyles.searchBlock}>
                    <span className={wmbbStyles.yzy_txt}>外卖平台：</span>
                    <Select value={String(wmcpssb.takeOutType)} className={wmbbStyles.platform} onChange={typeChange}>
						<Option key={0}>全部</Option>
						<Option key={1}>美团</Option>
						<Option key={2}>饿了么</Option>
						{/* <Option key={3}>百度</Option> */}
					</Select>
				</div>
				<div className={wmbbStyles.searchBlock}>
					<span className={wmbbStyles.yzy_txt}>菜品名称：</span>
                    <Input className={wmbbStyles.input} value={wmcpssb.foodName} onChange={nameChange} />
                </div>
                <div className={wmbbStyles.searchBlock}>
	                <span className={wmbbStyles.yzy_txt}>选择门店：</span>
	                <TreeSelect {...tProps} />
                </div>
				<div className={wmbbStyles.searchBlock}>
					<span className={wmbbStyles.yzy_txt}>菜品类型：</span>
                    <Select value={String(wmcpssb.foodType)} className={wmbbStyles.platform} style={{width:200}} onChange={foodTypeChange}>
						<Option key={1}>单品+套餐明细</Option>
						<Option key={2}>单品+套餐主项</Option>
					</Select>
                </div>
				<div className={wmbbStyles.searchBlock}>
					<RadioGroup className={wmbbStyles.yzy_txt} onChange={orderByTypeChange} value={String(wmcpssb.orderByType)}>
						<Radio value="1">按销量排序</Radio>
						<Radio value="2">按实收额排序</Radio>
					</RadioGroup>
                </div>
                <Button size="default" type="primary" className={wmbbStyles.btn_1} onClick={searchAction}>搜索</Button>
            	<Button size="default"  className={wmbbStyles.btn_2} onClick={loadOut}>导出</Button>
            </div>
        </div>
		
		<Table
			className={common.jj_yzy}
			columns={columns}
			dataSource={wmcpssb.list}
			bordered
			pagination={pagination}
			size="small"
			rowKey={record=>record.rank}
			scroll={{x:true}}
		/>
      </Header>
    );

}

WmcpssbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,wmcpssb}) {
    return { menu,wmcpssb };
}

export default connect(mapStateToProps)(WmcpssbPage);

