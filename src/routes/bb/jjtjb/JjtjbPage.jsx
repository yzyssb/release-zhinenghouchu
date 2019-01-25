import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Checkbox from 'antd/lib/checkbox';
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import styles from './JjtjbPage.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import message from 'antd/lib/message';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

const JjtjbPage=({
    dispatch,
    jjtjb
})=>{
    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formItemLayout1 = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const columns=[
        {
            title:'序号',
            dataIndex:'key',
            key:'key',
            className:common.right,
            render:(text,record,index)=>(
                jjtjb.size*(jjtjb.current-1)+index+1
            )
        },
        {
        	title:'门店名称',
            dataIndex:'restaurantName',
            key:'restaurantName',
            className:common.left,
        },
        {
            title:'菜品加工数量',
            dataIndex:'prodFoodNum',
            key:'prodFoodNum',
            className:common.right,
        },
        {
            title:'传菜量',
            dataIndex:'sendFoodNum',
            key:'sendFoodNum',
            className:common.right,
        },

        {
            title:'后厨任务量',
            dataIndex:'kitchenNum',
            key:'kitchenNum',
            className:common.right,
        },
        {
            title:'前厅任务量',
            dataIndex:'lobbyNum',
            key:'lobbyNum',
            className:common.right,
        },
        {
            title:'打包备餐量',
            dataIndex:'boxNum',
            key:'boxNum',
            className:common.right,
        },
        {
            title:'自外卖配送量',
            dataIndex:'takeoutNum',
            key:'takeoutNum',
            className:common.right,
        },

        {
            title:'开台数',
            dataIndex:'initiateNum',
            key:'initiateNum',
            className:common.right,
        },
        {
            title:'撤台量',
            dataIndex:'revertNum',
            key:'revertNum',
            className:common.right,
        },
        {
            title:'上餐具数量',
            dataIndex:'coverNum',
            key:'coverNum',
            className:common.right,
        },
        {
            title:'总订单菜量',
            dataIndex:'orderFoodNum',
            key:'orderFoodNum',
            className:common.right,
        },
        {
            title:'操作',
            dataIndex:'action',
            key:'action',
            className:common.left,
            render:(text,record,index)=>(
                <a onClick={()=>goDetail(record)}>详情</a>
            )
        }
    ]

    function goDetail(record){
        console.log(record)
        /*dispatch(routerRedux.push({
            pathname: '/mdjjxq',
            query: {restaurantId:record.restaurantId,startTime:new Date(jjtjb.startTime).getTime(),endTime:new Date(jjtjb.endTime).getTime()},
        }));*/
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{
                restaurantId:record.restaurantId,
                employeeId:null,
                activeKey:'2',
                restaurantName:record.restaurantName,
                employeeName:'',
            }
        })
        dispatch({
            type:'mdjjxq/updatePayload',
            payload:{
                restaurantId:record.restaurantId,
                startTime:new Date(jjtjb.startTime).getTime(),
                endTime:new Date(jjtjb.endTime).getTime(),
                static_days:'0'
            }
        })
          
        dispatch({
            type: 'mdjjxq/getData',
            payload: {},
        });
        dispatch({
            type: 'mdjjxq/getList',
            payload: {},
        });
    }

    const pagination = {
        total: jjtjb.total,
        current:jjtjb.current,
        pageSize: jjtjb.size,      
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'jjtjb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'jjtjb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'jjtjb/getListRes',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*jjtjb.size-jjtjb.size;
        dispatch({type: 'jjtjb/updatePayload',payload:{start:offset,current:pageNo}});

        dispatch({
            type:'jjtjb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'jjtjb/getListRes',
            payload:{}
        })
    }


    function onChange(item,key){
        dispatch({
            type:'jjtjb/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }


    function selectChange(key){
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{choosedIndex:key}
        })
    }

    function checkboxChange(key){
    	console.log(key)
    }

    var children=[<Option key="-1">全部</Option>]
    jjtjb.list1.forEach(function(value,index){
        children.push(<Option key={index}>{value.name}</Option>)
    })


    function onSearch(){
        dispatch({type: 'jjtjb/updatePayload',payload:{current:1,start:0,defaultExpandedKeys:[]}});
        dispatch({
            type:'jjtjb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'jjtjb/getListRes',
            payload:{}
        })
    }


    function onSelect(selectedKeys){
    	console.log(selectedKeys)
    }

    function onExpand(expandedKeys){
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{defaultExpandedKeys:expandedKeys}
        })
    }

    function onCheck(checkedKeys){
    	const cate=jjtjb.cate,restaurantIds=[],resIdOrgNameMap={}
    	cate.forEach((val1,idx1)=>{
    		val1.restaurantList.forEach((val2,idx2)=>{
    			checkedKeys.forEach((val3,idx3)=>{
    				if(val3==val2.key){
    					restaurantIds.push(val2.id)
    					resIdOrgNameMap[val2.id]=val2.name
    				}
    			})
    		})
    	})
    	dispatch({
    		type:'jjtjb/updatePayload',
    		payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap,defaultCheckedKeys:checkedKeys}
    	})
    }

    function getOutForm() {
        document.getElementById("formOrderExport").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
    }

    function multipleChange(key){
        let resIdOrgNameMap={},restaurantIds=[]
        jjtjb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
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
            type:'jjtjb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
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
			type:'jjtjb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'jjtjb/updatePayload',
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
      treeData:[jjtjb.obj1],
      value: jjtjb.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
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


    return(
        <span>
        <Spin spinning={jjtjb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />

        <div>
            <div className={common.yzy_search_1}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(jjtjb.startTime), moment(jjtjb.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(jjtjb.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择门店：</span>
                        <TreeSelect {...tProps} />
                    </div>
                    <div className={common.searchBlock}>
                        <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                        <Button size="default" className={common.btn_2} onClick={getOutForm}>导出</Button>
                    </div>
                </div>
            </div>
            
            <div className={styles.box}>
                <div className={styles.left}>
                    <span className={styles.txt}>菜品加工量</span>
                    <span className={styles.num}>{jjtjb.Base.prodFoodNum||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>传菜量</span>
                    <span className={styles.num}>{jjtjb.Base.sendFoodNum||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>后厨任务量</span>
                    <span className={styles.num}>{jjtjb.Base.kitchenNum||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>前厅任务量</span>
                    <span className={styles.num}>{jjtjb.Base.lobbyNum||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>打包备餐量</span>
                    <span className={styles.num}>{jjtjb.Base.boxNum||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>自外卖配送量</span>
                    <span className={styles.num}>{jjtjb.Base.takeoutNum||'0'}</span>
                </div>
            </div>

            <Table
                className={common.jj_yzy}
                bordered
                columns={columns}
                dataSource={jjtjb.Detail}
                pagination={pagination}
                size="small"
                scroll={{x:true}}
             />
            
        </div>
        <form action={jjtjb.linkOrigin+'report-api/report/export/piece/brand'} method="post"  id='formOrderExport'>
        

            <input type="hidden" name="restaurantIds" value = {JSON.stringify(jjtjb.restaurantIds)} id='pay_way'/>
            <input type="hidden" name="startTime" value = {new Date(jjtjb.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(jjtjb.endTime).getTime()}/>
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(jjtjb.resIdOrgNameMap)}/>
            <input type="hidden" name="orgName" value = {jjtjb.orgName}/>
            <input type="hidden" name="token" value = {JSON.stringify(getUserToken())}/>

        </form>
        </span>
    );

}


function mapStateToProps({jjtjb}) {
    return { jjtjb };
}

export default connect(mapStateToProps)(JjtjbPage);

