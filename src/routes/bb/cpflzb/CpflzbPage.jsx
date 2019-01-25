import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Spin from 'antd/lib/spin';
import styles from './CpflzbPage.less';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
const Option=Select.Option
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

function CpflzbPage ({menu,dispatch,cpflzb}) {
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
            span: 4,
        },
    };
    const formItemLayout2= {
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
                cpflzb.size*(cpflzb.current-1)+index+1
            )
        },
        {
            title:'分类名称',
            dataIndex:'categoryName',
            key:'categoryName',
            className:common.left,
            sorter:(a,b)=>a.categoryName.localeCompare(b.categoryName,'zh')
        },
        {
            title:'销售量',
            dataIndex:'num',
            key:'num',
            className:common.right,
            sorter: (a, b) => a.num - b.num
        },
        {
            title:'实收合计',
            dataIndex:'realMoney',
            key:'realMoney',
            className:common.right,
            sorter: (a, b) => a.realMoney - b.realMoney
        },
        {
            title:'实收占比',
            dataIndex:'realProportion',
            key:'realProportion',
            className:common.right,
            sorter:(a,b)=>a.realProportion.split('%')[0] - b.realProportion.split('%')[0]
        },
        {
            title:'堂食实收合计',
            dataIndex:'realMoneyIn',
            key:'realMoneyIn',
            className:common.right,
            sorter: (a, b) => a.realMoneyIn - b.realMoneyIn
        },
        {
            title:'堂食实收占比',
            dataIndex:'realProportionIn',
            key:'realProportionIn',
            className:common.right,
            sorter:(a,b)=>a.realProportionIn.split('%')[0] - b.realProportionIn.split('%')[0]
        },
        {
            title:'外卖实收合计',
            dataIndex:'realMoneyOut',
            key:'realMoneyOut',
            className:common.right,
            sorter: (a, b) => a.realMoneyOut - b.realMoneyOut
        },
        {
            title:'外卖实收占比',
            dataIndex:'realProportionOut',
            key:'realProportionOut',
            className:common.right,
            sorter:(a,b)=>a.realProportionOut.split('%')[0] - b.realProportionOut.split('%')[0]
        },
    ]

    const columns1=[
        {
            title:'序号',
            dataIndex:'key',
            key:'key',
            className:common.right,
            render:(text,record,index)=>(
                cpflzb.size*(cpflzb.current-1)+index+1
            )
        },
        {
            title:'部门名称',
            dataIndex:'categoryName',
            key:'categoryName',
            className:common.left,
            sorter:(a,b)=>a.categoryName.localeCompare(b.categoryName,'zh')
        },
        {
            title:'销售量',
            dataIndex:'num',
            key:'num',
            className:common.right,
            sorter: (a, b) => a.num - b.num
        },
        {
            title:'实收合计',
            dataIndex:'realMoney',
            key:'realMoney',
            className:common.right,
            sorter: (a, b) => a.realMoney - b.realMoney
        },
        {
            title:'实收占比',
            dataIndex:'realProportion',
            key:'realProportion',
            className:common.right,
            sorter:(a,b)=>a.realProportion.split('%')[0] - b.realProportion.split('%')[0]
        },
        {
            title:'堂食实收合计',
            dataIndex:'realMoneyIn',
            key:'realMoneyIn',
            className:common.right,
            sorter: (a, b) => a.realMoneyIn - b.realMoneyIn
        },
        {
            title:'堂食实收占比',
            dataIndex:'realProportionIn',
            key:'realProportionIn',
            className:common.right,
            sorter:(a,b)=>a.realProportionIn.split('%')[0] - b.realProportionIn.split('%')[0]
        },
        {
            title:'外卖实收合计',
            dataIndex:'realMoneyOut',
            key:'realMoneyOut',
            className:common.right,
            sorter: (a, b) => a.realMoneyOut - b.realMoneyOut
        },
        {
            title:'外卖实收占比',
            dataIndex:'realProportionOut',
            key:'realProportionOut',
            className:common.right,
            sorter:(a,b)=>a.realProportionOut.split('%')[0] - b.realProportionOut.split('%')[0]
        },
    ]


    const pagination = {
        current:cpflzb.current,
        pageSize: cpflzb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'cpflzb/updatePayload',payload:{size:pageSize,current:1,start:0}});
    }

    function onPageChange(pageNo){
        var offset = pageNo*cpflzb.size-cpflzb.size;
        dispatch({type: 'cpflzb/updatePayload',payload:{start:offset,current:pageNo}});
    }


    function onChange(item,key){
        console.log(key)
        let startTime=moment(new Date(key[0])).format('YYYY-MM-DD 00:00:00'),
            endTime=moment(new Date(key[1])).format('YYYY-MM-DD 23:59:59')
        console.log(startTime,endTime)
        dispatch({
            type:'cpflzb/updatePayload',
            payload:{startTime:moment(key[0]).format('YYYY-MM-DD 00:00:00'),endTime:moment(key[1]).format('YYYY-MM-DD 23:59:59'),static_days:'0'}
        })
    }


    function selectChange1(key){
        dispatch({
            type:'cpflzb/updatePayload',
            payload:{choosedIndex1:key}
        })
    }

    var children=[<Option key="-1">全部</Option>]
    cpflzb.list1.forEach(function(value,index){
        children.push(<Option key={index}>{value.name}</Option>)
    })


    function onSearch(){
        dispatch({type: 'cpflzb/updatePayload',payload:{current:1,start:0,defaultExpandedKeys:[],changeSearch:cpflzb.choosedIndex1==1?false:true}});
        dispatch({
            type:'cpflzb/getListRes',
            payload:{}
        })
        
    }

    function chooseDuration(t){
        var startTime,endTime=moment().endOf('day')
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
            type:'cpflzb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }
    

    function getOutForm() {
        document.getElementById("formOrderExport").submit();
    }
    function getUserToken() {

        const userStatus = myApp._store.getState().account.token;

        return userStatus;
        // test7
        // return "MV8xXzlfMTUyNDA0NTUwNTEyNg==";

    }
    function onSelect(selectedKeys){
        console.log(selectedKeys)
    }
    function onExpand(expandedKeys){
        dispatch({
            type:'cpflzb/updatePayload',
            payload:{defaultExpandedKeys:expandedKeys}
        })
    }

    function onCheck(checkedKeys){
        const cate=cpflzb.cate,restaurantIds=[],resIdOrgNameMap={}
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
            type:'cpflzb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap,defaultCheckedKeys:checkedKeys}
        })
    }

    function multipleChange(key){
        console.log(key)
        let resIdOrgNameMap={},restaurantIds=[]
        cpflzb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'cpflzb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

    function nameChange(e){
        console.log(e.target.value)
        dispatch({
            type:'cpflzb/updatePayload',
            payload:{categoryName:e.target.value}
        })
    }

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
			type:'cpflzb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'cpflzb/updatePayload',
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
      treeData:[cpflzb.obj1],
      value: cpflzb.value,
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
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>菜品销量</Breadcrumb.Item>
                <Breadcrumb.Item>菜品分类占比表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={cpflzb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD"
                          value={[moment(cpflzb.startTime), moment(cpflzb.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(cpflzb.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>分类方式：</span>
                        <Select value={String(cpflzb.choosedIndex1)} className={common.yzy_margin} onChange={selectChange1}>
                            <Option key="1">按菜品分类</Option>
                            <Option key="2">按出品部门</Option>
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
            
            

            {/*<div className={styles.box}>
                <div className={styles.left}>
                    <span className={styles.txt}>数量</span>
                    <span className={styles.num}>{cpflzb.Base.num==null?'0.00':cpflzb.Base.num}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>实收金额</span>
                    <span className={styles.num}>{cpflzb.Base.realMoney==null?'0.00':cpflzb.Base.realMoney}</span>
                </div>
            </div>*/}

            <Table
                className={common.yzy}
                bordered
                columns={!cpflzb.changeSearch?columns:columns1}
                dataSource={cpflzb.Detail}
                pagination={pagination}
                scroll={{x:1000}}
                size="small"
             />
            
        </div>
        <form action={cpflzb.linkOrigin+'report-api/report/export/category'} method="post"  id='formOrderExport'>
            
            <input type="hidden" name="restaurantIds" value = {JSON.stringify(cpflzb.restaurantIds)} id='pay_way'/>
            <input type="hidden" name="startTime" value = {new Date(cpflzb.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(cpflzb.endTime).getTime()}/>
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(cpflzb.resIdOrgNameMap)}/>
            <input type="hidden" name="queryType" value = {cpflzb.choosedIndex1}/>

            {cpflzb.categoryName.length>0&&(<input type="hidden" name="categoryName" value = {cpflzb.categoryName}/>)}

        </form>

      </Header>
    );

}

CpflzbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,cpflzb}) {
    return { menu,cpflzb };
}

export default connect(mapStateToProps)(CpflzbPage);

