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
import styles from './TcmxbPage.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option

import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;


function TcmxbPage ({menu,dispatch,tcmxb}) {
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
            title:'',
            dataIndex:'key',
            key:'key',
            render:(text,record,index)=>(
                tcmxb.size*(tcmxb.current-1)+index+1
            )
        },
        {
        	title:'门店名称',
            dataIndex:'orgName',
            key:'orgName',
            sorter:(a,b)=>a.orgName.localeCompare(b.orgName)
        },
        {
            title:'账单号',
            dataIndex:'orderNo',
            key:'orderNo'
        },
        {
            title:'操作时间',
            dataIndex:'opTime',
            key:'opTime'
        },
        {
            title:'餐台编号',
            dataIndex:'tableCode',
            key:'tableCode'
        },
        {
            title:'餐台名称',
            dataIndex:'tableName',
            key:'tableName'
        },
        {
            title:'菜品分类',
            dataIndex:'categoryName',
            key:'categoryName'
        },
        {
            title:'菜品名称',
            dataIndex:'foodName',
            key:'foodName',
            sorter:(a,b)=>a.foodName.localeCompare(b.foodName)
        },
        {
            title:'规格',
            dataIndex:'specName',
            key:'specName'
        },
        {
            title:'做法',
            dataIndex:'methodName',
            key:'methodName'
        },
        {
            title:'数量',
            dataIndex:'num',
            key:'num'
        },
        {
            title:'单价',
            dataIndex:'singlePrice',
            key:'singlePrice'
        },
        {
            title:'金额',
            dataIndex:'totalPrice',
            key:'totalPrice'
        },
        {
            title:'原因',
            dataIndex:'retreatReason',
            key:'retreatReason'
        },
        {
            title:'操作员',
            dataIndex:'opName',
            key:'opName'
        }
    ]

    const pagination = {
        total: tcmxb.total,
        current:tcmxb.current,
        pageSize: tcmxb.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'tcmxb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'tcmxb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'tcmxb/getListRes',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*tcmxb.size-tcmxb.size;
        dispatch({type: 'tcmxb/updatePayload',payload:{start:offset,current:pageNo}});

        dispatch({
            type:'tcmxb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'tcmxb/getListRes',
            payload:{}
        })
    }


    function onChange(item,key){
        console.log(key)
        dispatch({
            type:'tcmxb/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }


    function selectChange(key){
        dispatch({
            type:'tcmxb/updatePayload',
            payload:{choosedIndex:key}
        })
    }

    function checkboxChange(key){
    	console.log(key)
    }

    var children=[<Option key="-1">全部</Option>]
    tcmxb.list1.forEach(function(value,index){
        children.push(<Option key={index}>{value.name}</Option>)
    })


    function onSearch(){
        dispatch({type: 'tcmxb/updatePayload',payload:{current:1,start:0,defaultExpandedKeys:[]}});
        dispatch({
            type:'tcmxb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'tcmxb/getListRes',
            payload:{}
        })
    }

    function onReset(){
        dispatch({type: 'tcmxb/updatePayload',payload:{current:1,start:0,defaultExpandedKeys:[]}});
        var startTime=new Date(new Date().toLocaleDateString()+' 00:00:00'),
            endTime=new Date(new Date(startTime).getTime()+24*3600*1000).toLocaleDateString()+' 00:00:00'
        dispatch({
            type:'tcmxb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,choosedIndex:-1,defaultCheckedKeys:tcmxb.tempCheckedKeys,restaurantIds:tcmxb.tempRestaurantIds,resIdOrgNameMap:tcmxb.tempResIdOrgNameMap,static_days:'1'}
        })
        dispatch({
            type:'tcmxb/getTotalRes',
            payload:{}
        })
        dispatch({
            type:'tcmxb/getListRes',
            payload:{}
        })
    }

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
            type:'tcmxb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    function onSelect(selectedKeys){
    	console.log(selectedKeys)
    }

    function onExpand(expandedKeys){
        dispatch({
            type:'tcmxb/updatePayload',
            payload:{defaultExpandedKeys:expandedKeys}
        })
    }

    function onCheck(checkedKeys){
    	const cate=tcmxb.cate,restaurantIds=[],resIdOrgNameMap={}
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
    		type:'tcmxb/updatePayload',
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
        let resIdOrgNameMap={},restaurantIds=[],restaurantNames=[]
        tcmxb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(value.id)
                    restaurantNames.push(value.name)
                }
            })
        })
        dispatch({
            type:'tcmxb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap,restaurantNames:restaurantNames}
        })
    }

    return(
      <Header {...HeaderProps}>
        <Spin spinning={tcmxb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div style={{marginTop:20}}>
            <Form>
              <Form.Item
                label="选择时间：" 
                {...formItemLayout}
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={[moment(tcmxb.startTime), moment(tcmxb.endTime)]}
                  allowClear={false}
                  onChange={onChange}
                />
                <span>
                    {tcmxb.static_days=='1'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(1)}>今天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(1)}>今天</a>
                    )}
                    {tcmxb.static_days=='2'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(2)}>昨天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(2)}>昨天</a>
                    )}
                    {tcmxb.static_days=='7'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(7)}>近7天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(7)}>近7天</a>
                    )}
                    {tcmxb.static_days=='15'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(15)}>近15天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(15)}>近15天</a>
                    )}
                    {tcmxb.static_days=='30'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(30)}>近30天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(30)}>近30天</a>
                    )}
                </span>
              </Form.Item>
              <Form.Item
                label="选择门店：" 
                {...formItemLayout1}
                style={{position:'relative'}}
              >
              	{/*
                <div className={styles.tree} id="tree">
	                <Tree
				        checkable
				        expandedKeys={tcmxb.defaultExpandedKeys}
				        defaultSelectedKeys={[]}
				        checkedKeys={tcmxb.defaultCheckedKeys}
				        onSelect={onSelect}
				        onCheck={onCheck}
                        onExpand={onExpand}
				    >
				        <TreeNode title="全选" key="0">
					        {tcmxb.cate.map((value,index)=>(
					        	<TreeNode title={value.name} key={value.key}>
					        		{value.restaurantList.map((val,idx)=>(
					        			<TreeNode title={val.name} key={val.key} />
					        		))}
					        	</TreeNode>
					        ))}
				        </TreeNode>
				    </Tree>
			    </div>
                <div className={styles.btns}>
                    <Button size="default" type="primary" style={{marginRight:20}} onClick={onSearch}>搜索</Button>
                    <Button size="default" onClick={onReset}>重置</Button>
                </div>
                */}
                <Select
                    mode="multiple"
                    placeholder="请选择门店"
                    onChange={multipleChange}
                    style={{width:350}}
                    value={tcmxb.restaurantNames}
                >
                    {tcmxb.restaurantList.map((val,idx)=>(
                        <Option key={String(val.id)}>{val.name}</Option>
                    ))}
                </Select>
                <Button size="default" type="primary" style={{marginLeft:20,marginRight:20}} onClick={onSearch}>搜索</Button>
                <Button size="default" onClick={getOutForm}>导出</Button>
              </Form.Item>
            </Form>
            

            <div className={styles.box}>
                <div className={styles.left}>
                    <span className={styles.txt}>数量</span>
                    <span className={styles.num}>{tcmxb.Base.num||'0.00'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>金额</span>
                    <span className={styles.num}>{tcmxb.Base.money||'0.00'}</span>
                </div>
            </div>

            <Table
                bordered
                columns={columns}
                dataSource={tcmxb.Detail}
                pagination={pagination}
             />
            
        </div>
        <form action={tcmxb.linkOrigin+'report/export/retreat'} method="post"  id='formOrderExport'>

        

            <input type="hidden" name="restaurantIds" value = {JSON.stringify(tcmxb.restaurantIds)} id='pay_way'/>
            <input type="hidden" name="startTime" value = {new Date(tcmxb.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(tcmxb.endTime).getTime()}/>
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(tcmxb.resIdOrgNameMap)}/>            

        </form>

      </Header>
    );

}

TcmxbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,tcmxb}) {
    return { menu,tcmxb };
}

export default connect(mapStateToProps)(TcmxbPage);

