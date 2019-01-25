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

function WmcpxlbPage ({menu,dispatch,wmcpxlb}) {
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
			<p className={wmbbStyles.notice_p}>销售量</p>
			<p>销售量=所有销量-退单数量</p>
			<p className={wmbbStyles.notice_p}>销售量占比</p>
			<p>销售量占比=销售量/全部菜品销售量*100</p>
			<p className={wmbbStyles.notice_p}>销售额</p>
			<p>销售额=所有销售额-退单金额</p>
			<p className={wmbbStyles.notice_p}>销售额占比</p>
			<p>销售额占比=销售额/全部菜品销售额*100</p>
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
			type:'wmcpxlb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	const tProps = {
      treeData:[wmcpxlb.obj1],
      value: wmcpxlb.value,
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
		total:wmcpxlb.total+Math.ceil(wmcpxlb.total/wmcpxlb.size),
        current:wmcpxlb.current,
        pageSize: wmcpxlb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        //showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'wmcpxlb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
        	type:'wmcpxlb/takeoutFoodStat',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*(wmcpxlb.size-1);
        dispatch({type: 'wmcpxlb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
        	type:'wmcpxlb/takeoutFoodStat',
        	payload:{}
        })
    }
	
	const columns=[
		{title:'序号',dataIndex:'rank',key:'rank',className:common.right,render:(text,record,index)=>(
			<span>{wmcpxlb.size*(wmcpxlb.current-1)+index+1}</span>
		)},
		{title:'菜品名称',dataIndex:'foodName',key:'foodName'},
		{title:'规格',dataIndex:'spceName',key:'spceName'},
		{title:'销售量',dataIndex:'sellNum',key:'sellNum',className:common.right},
		{title:'销售量占比',dataIndex:'numProportion',key:'numProportion',className:common.right},
		{title:'销售额',dataIndex:'sellMoney',key:'sellMoney',className:common.right},
		{title:'销售额占比',dataIndex:'moneyProportion',key:'moneyProportion',className:common.right},
	]
	
	//时间修改
	function onChange(item,key){
		dispatch({
            type:'wmcpxlb/updatePayload',
            payload:{startTime:moment(key[0]),endTime:moment(key[1]),static_days:'0'}
        })
    }

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
        if(t==0){
            startTime=moment().startOf("day")
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
            type:'wmcpxlb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }
	
	//搜索
	function searchAction(){
		dispatch({
			type:'wmcpxlb/updatePayload',
			payload:{
				start:0,
				current:1
			}
		}) 
		dispatch({
			type:'wmcpxlb/takeoutFoodStat',
			payload:{}
		})
	}
	
	//导出
	function loadOut(){
		dispatch({
			type:'wmcpxlb/_export',
			payload:{}
		})
	}

	//外卖平台修改
	function typeChange(e){
    	dispatch({
    		type:'wmcpxlb/updatePayload',
    		payload:{
    			takeOutType:e
    		}
    	})
    }

    //菜品名称修改
    function nameChange(e){
    	dispatch({
            type:'wmcpxlb/updatePayload',
            payload:{
                foodName:e.target.value
            }
        })
	}
	
	//排序修改
	function orderByTypeChange(e){
		dispatch({
            type:'wmcpxlb/updatePayload',
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
						<span>外卖菜品销量表</span>
						<Icon style = {{marginLeft:10}} type="question-circle" />
					</Popover>
				</Breadcrumb.Item>
            </Breadcrumb>
        </div>
		<Spin spinning={wmcpxlb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
		<div className={wmbbStyles.yzy_search}>
            <div>
            	<div className={wmbbStyles.searchBlock}>
                	<span className={wmbbStyles.yzy_txt}>选择时间：</span>
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={[moment(wmcpxlb.startTime), moment(wmcpxlb.endTime)]}
	                  allowClear={false}
	                  onChange={onChange}
                      className={wmbbStyles.yzy_datePicker}
                    />
                    <Select value={String(wmcpxlb.static_days)} className={wmbbStyles.periods_1} onChange={chooseDuration}>
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
                    <Select value={String(wmcpxlb.takeOutType)} className={wmbbStyles.platform} onChange={typeChange}>
						<Option key={0}>全部</Option>
						<Option key={1}>美团</Option>
						<Option key={2}>饿了么</Option>
						{/* <Option key={3}>百度</Option> */}
					</Select>
				</div>
				<div className={wmbbStyles.searchBlock}>
					<span className={wmbbStyles.yzy_txt}>菜品名称：</span>
                    <Input className={wmbbStyles.input} value={wmcpxlb.foodName} onChange={nameChange} />
                </div>
                <div className={wmbbStyles.searchBlock}>
	                <span className={wmbbStyles.yzy_txt}>选择门店：</span>
	                <TreeSelect {...tProps} />
                </div>
				<div className={wmbbStyles.searchBlock}>
					<RadioGroup className={wmbbStyles.yzy_txt} onChange={orderByTypeChange} value={String(wmcpxlb.orderByType)}>
						<Radio value="1">按销量排序</Radio>
						<Radio value="2">按销售额排序</Radio>
					</RadioGroup>
                </div>
                <Button size="default" type="primary" className={wmbbStyles.btn_1} onClick={searchAction}>搜索</Button>
            	<Button size="default"  className={wmbbStyles.btn_2} onClick={loadOut}>导出</Button>
            </div>
        </div>
		
		<Table
			className={common.jj_yzy}
			columns={columns}
			dataSource={wmcpxlb.list}
			bordered
			pagination={pagination}
			size="small"
			rowKey={record=>record.rank}
			scroll={{x:true}}
		/>
      </Header>
    );
}

WmcpxlbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,wmcpxlb}) {
    return { menu,wmcpxlb };
}

export default connect(mapStateToProps)(WmcpxlbPage);

