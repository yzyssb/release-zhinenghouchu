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
import { TreeSelect,Popover,Icon } from 'antd';
import wmbbStyles from './wmbb.less';

function WmyybbPage ({menu,dispatch,wmyybb}) {
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
			<p className={wmbbStyles.notice_p}>净收入</p>
			<p>平台专送：净收入=营业额-平台佣金-商家补贴</p>
			<p className={wmbbStyles.notice_p}>营业收入</p>
			<p>营业收入=净收入+平台佣金</p>
			<p className={wmbbStyles.notice_p}>营业额</p>
			<p>菜品销售额+餐盒费</p>
			<p className={wmbbStyles.notice_p}>菜品金额</p>
			<p>菜品销售额=营业额-餐盒费</p>
			<p className={wmbbStyles.notice_p}>优惠金额</p>
			<p>优惠金额=平台补贴+商家补贴</p>
			<p>优惠金额：包含平台各类的营销活动及红包优惠金额的总和</p>
			<p className={wmbbStyles.notice_p}>商家最终客付价</p>
			<p>商家最终客付价=菜品销售额+餐盒费+配送收入-优惠金额-部分退款额</p>
			<p className={wmbbStyles.notice_p}>净退款额</p>
			<p>净退款额=已退款单据净收入汇总（包含全额退和部分退）</p>
			<p className={wmbbStyles.notice_p}>客单价</p>
			<p>客单价=营业额/有效订单数</p>
			<p className={wmbbStyles.notice_p}>净单价</p>
			<p>净单价=净收入/有效订单数</p>
			<p className={wmbbStyles.notice_p}>退单订单数</p>
			<p>已退款状态单据的数量汇总，包括部分退款单据数</p>
		</div>
	)

	
	//选择时间
	function onChange(item,key){
		dispatch({
            type:'wmyybb/updatePayload',
            payload:{startTime:moment(key[0]),endTime:moment(key[1]),static_days:'0'}
        })
    }
	
	function chooseDuration(t){
        var startTime,endTime=moment().endOf('day')
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
            type:'wmyybb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }
	
	//pagination
	const pagination = {
		total:wmyybb.total+Math.ceil(wmyybb.total/wmyybb.size),
        current:wmyybb.current,
        pageSize: wmyybb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        //当可以切换页面展示数量时有问题
        //showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'wmyybb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
        	type:'wmyybb/takeoutBizStat',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = (pageNo-1)*(11-1);
        dispatch({type: 'wmyybb/updatePayload',payload:{start:offset,current:pageNo,size:11}});
        dispatch({
        	type:'wmyybb/takeoutBizStat',
        	payload:{}
        })
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
			type:'wmyybb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	const tProps = {
      treeData:[wmyybb.obj1],
      value: wmyybb.value,
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

    //外卖平台修改
	function typeChange(e){
    	dispatch({
    		type:'wmyybb/updatePayload',
    		payload:{
    			takeOutType:e
    		}
    	})
    }
	
	function searchAction(){
		dispatch({
			type:'wmyybb/updatePayload',
			payload:{
				start:0,
				current:1,
				size:11
			}
		})
		dispatch({
			type:'wmyybb/takeoutBizStat',
			payload:{}
		})
	}
	
	function loadOut(){
		dispatch({
			type:'wmyybb/_export',
			payload:{}
		})
	}

	
    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>外卖报表</Breadcrumb.Item>
                <Breadcrumb.Item>
					<Popover placement="rightTop" content={content}>
						<span>营业报表</span>
						<Icon style = {{marginLeft:10}} type="question-circle" />
					</Popover>
				</Breadcrumb.Item>
            </Breadcrumb>
        </div>
		<Spin spinning={wmyybb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
		<div className={wmbbStyles.yzy_search}>
            <div>
            	<div className={wmbbStyles.searchBlock}>
                	<span className={wmbbStyles.yzy_txt}>选择时间：</span>
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={[moment(wmyybb.startTime), moment(wmyybb.endTime)]}
	                  allowClear={false}
	                  onChange={onChange}
                      className={wmbbStyles.yzy_datePicker}
                    />
                    <Select value={String(wmyybb.static_days)} className={wmbbStyles.periods_1} onChange={chooseDuration}>
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
                    <Select value={String(wmyybb.takeOutType)} className={wmbbStyles.platform} onChange={typeChange}>
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
			columns={wmyybb.columns}
			dataSource={wmyybb.list}
			bordered
			pagination={pagination}
			size="small"
			scroll={{x:1900,y:500}}
			rowKey={record=>record.key}
		/>
      </Header>
    );

}

WmyybbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,wmyybb}) {
    return { menu,wmyybb };
}

export default connect(mapStateToProps)(WmyybbPage);

