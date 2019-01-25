import React, {PropTypes} from 'react';
import Header from '../../../components/Header';
import {connect} from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import {routerRedux} from 'dva/router';

import Form from 'antd/lib/form';

const FormItem = Form.Item;

import styles from './HybkxqPage.less';

import moment from 'moment';

import DatePicker from 'antd/lib/date-picker';

const RangePicker = DatePicker.RangePicker;

import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Tabs from 'antd/lib/tabs';
import {config} from "../../../services/HttpService";
import {getUserToken} from "../../../services/CommonService";
import Input from 'antd/lib/input';
import Popover from 'antd/lib/popover'
import Icon from 'antd/lib/icon'

const Option = Select.Option
const TabPane = Tabs.TabPane;
import common from './common.less';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

function HybkxqPage({menu, dispatch, hybkxq}) {
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

    const columns = [
         {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            className:common.right,
        },
        {
            title: '会员昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            className:common.left,
        },
        {
            title: '会员手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            className:common.left,
        },
        {
            title: '注册日期',
            dataIndex: 'regTime',
            key: 'regTime',
            className:common.left,
            render: (text, record, index) => (
                managerTimeHandle(record.regTime)
            ),
        },
        {
            title: '办卡时间',
            dataIndex: 'createtime',
            key: 'createtime',
            className:common.left,
            render: (text, record, index) => (
                managerTimeHandle(record.createtime)
            ),
        },
        {
            title: '会费金额',
            dataIndex: 'vipMoney',
            key: 'vipMoney',
            className:common.right,
        },
        {
            title: '会员消费总额',
            dataIndex: 'totalPay',
            key: 'totalPay',
            className:common.right,
        },
        {
            title: '开卡门店',
            dataIndex: 'restaurantName',
            key: 'restaurantName',
            className:common.left,
        },


    ]

    function managerRestaurantNameHandle(restaurantId){

        var restaurantName = '';
        if (hybkxq.storeList.shopList) {
                hybkxq.storeList.shopList.map((j) => {
                   
                        if(j.id == restaurantId)
                        {
                            restaurantName=j.name;
                        }
                  
                })
            }

        return restaurantName;

    }
    function managerTimeHandle(time) {

        return timestampToTime(time);

    }

    function addZero(number){
    
        return number <10 ? '0' + number : number;

    }
    function timestampToTime(timestamp) {

        var time = '';
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = addZero(date.getMonth() + 1) + '-';
        var D = addZero(date.getDate()) + ' ';
        var h = addZero(date.getHours()) + ':';
        var m = addZero(date.getMinutes()) + ':';
        var s = addZero(date.getSeconds());
        time = Y + M + D + h + m + s;
        return time;
    }

    function selectChange(key) {
        var postMap={};
        let choosedIndex=[]

        // map.
        if(key.length>0)
        {
            if (hybkxq.storeList.shopList) {
                hybkxq.storeList.shopList.map((j) => {
                    key.map(function(selectId){
                        if(j.id == selectId)
                        {
                            postMap[j.id]=j.name;
                            choosedIndex.push(String(j.id))
                        }
                    })
                })
            }
        }
        dispatch({
            type: 'hybkxq/updatePayload',
            payload: {postChoosedIndex: choosedIndex}
        })
        dispatch({
            type: 'hybkxq/updatePayload',
            payload: {choosedIndex: choosedIndex,postMap:postMap}
        })
    }
   

    var cuisineOptionHtml = [];

    if (hybkxq.storeList && hybkxq.storeList.shopList) {
        hybkxq.storeList.shopList.map((j) => {
            cuisineOptionHtml.push(<Option key={j.id}>{j.name}</Option>)


        })
    }

    function onSearch() {

        console.log(hybkxq.choosedIndex)
        dispatch({
            type: 'hybkxq/query',
            payload: {}
        })
        
    }
   

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'hybkxq/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                postStartTime: new Date(dates[0].format('YYYY-MM-DD HH:mm:ss')).valueOf(),
                postEndTime: new Date(dates[1].format('YYYY-MM-DD HH:mm:ss')).valueOf(),
                static_days:'0'
            }
        });
    };
    

  
    function loadFoodOut() {

        dispatch({
            type: 'hybkxq/_export',
            payload: {
                
            }
        });
    }


    const pagination = {
        total: hybkxq.total,
        current:hybkxq.current,
        pageSize: hybkxq.size,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize){


        dispatch({type: 'hybkxq/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({type: 'hybkxq/query',payload:{}}); 


    }

    function onPageChange(pageNo){
        
        var offset = pageNo*hybkxq.size-hybkxq.size;
        dispatch({type: 'hybkxq/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'hybkxq/query',payload:{}}); 


    }

    function onInputSearch(e){
         dispatch({type: 'hybkxq/updatePayload',payload:{mobile:e.target.value}});
    }

    const content = (
      <div>
        <p>截止昨日会员总数</p>
      
      </div>
    );

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
        if(t==1){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==2){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==7){
            startTime=moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'hybkxq/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t,postStartTime:new Date(startTime).getTime(),postEndTime:new Date(endTime).getTime()}
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
			type:'hybkxq/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'hybkxq/updatePayload',
			payload:{
				value1:value
			}
		})
	}
	
	//无限级树
	function renderTreeNodes(data) {
		return data.map(function (item) {
		  if (item.children) {
			return (
			  <TreeNode title={item.title} key={item.key} dataRef={item}>
				{renderTreeNodes(item.children)}
			  </TreeNode>
			);
		  }
		  return <TreeNode {...item} />;
		});
	}
	
	//无限级treeSelect
	const SHOW_PARENT = TreeSelect.SHOW_PARENT;
	
	const tProps = {
      treeData:[hybkxq.obj1],
      value: hybkxq.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择',
      style: {
        width: 350,
      },
	  maxTagCount:3,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };

    return (
        <Header {...HeaderProps}>
            <div>
                
                <Form style={{marginTop:20}}>

                    <div className={styles.box}>
                        <div className={styles.left}>

                            <span className={styles.txt}>昨日新增会员</span>
                            <span className={styles.num}>{hybkxq.yesterdayTotal}</span>

                        </div>
                        <div className={styles.right}>
                            <Popover content={content}>
                                <span className={styles.txt}>会员总数</span>
                                <Icon style = {{marginLeft:10}} type="question-circle" />
                            </Popover>
                            <span className={styles.num}>{hybkxq.vipTotal}</span>
                        </div>
                    </div>

                    <Form.Item
                        label="选择时间："
                        {...formItemLayout}
                    >
                        
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(hybkxq.startTime), moment(hybkxq.endTime)]}
                          allowClear={false}
                          onChange={onSearchDateChange}
                        />
                        <span>
                            {hybkxq.static_days=='1'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(1)}>今天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(1)}>今天</a>
                            )}
                            {hybkxq.static_days=='2'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(2)}>昨天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(2)}>昨天</a>
                            )}
                            {hybkxq.static_days=='7'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(7)}>近7天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(7)}>近7天</a>
                            )}
                            {hybkxq.static_days=='15'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(15)}>近15天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(15)}>近15天</a>
                            )}
                            {hybkxq.static_days=='30'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(30)}>近30天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(30)}>近30天</a>
                            )}
                        </span>
                    </Form.Item>
                    <Form.Item
                        label="选择门店："
                        {...formItemLayout}
                    >
						{/*无限级树*/}
						{/*<div style={{position:'absolute',left:'0px',zIndex:100,background:'#fff',display:'inline-block',maxHeight:200,width:350,overflowY:'scroll',border:'1px solid #ddd'}}>
							{hybkxq.obj1&&Object.keys(hybkxq.obj1).length>0&&
								<Tree
									checkable
									checkedKeys={hybkxq.value}
									onCheck={treeChange}
									autoExpandParent={hybkxq.autoExpand}
									expandedKeys={hybkxq.value1}
									onExpand={treeExpand}
								>
									{renderTreeNodes([hybkxq.obj1])}
								</Tree>
							}
						</div>*/}
						
						{/*无限级treeSelect*/}
						<TreeSelect {...tProps} />
                    </Form.Item>
                    <Form.Item
                        label="会员手机号："
                        {...formItemLayout}
                    >
                        <Input style={{width:350}} onChange = {onInputSearch}/>
                        <Button size="default" type="primary" style={{marginLeft:20,marginRight: 20}} onClick={onSearch}>搜索</Button>
                        <Button size="default" onClick={loadFoodOut}>导出</Button>
                    </Form.Item>
                </Form>


                <Table
                    className={common.yzy}
                    bordered
                    columns={columns}
                    dataSource={hybkxq.list}
                    rowKey={record => record.id}
                    pagination={pagination}
                    size="small"
                    scroll={{x:1700}}
                    bordered/>
            
            
                 
            </div>


           
           
        </Header>
    );

}

HybkxqPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, hybkxq}) {
    return {menu, hybkxq};
}

export default connect(mapStateToProps)(HybkxqPage);

