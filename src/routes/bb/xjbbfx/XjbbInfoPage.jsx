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
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const { MonthPicker } = DatePicker;
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';

import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';

const TreeNode = Tree.TreeNode;

function XjbbfxInfoPage ({menu,dispatch,xjbbInfo}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formItemLayout={
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    }

    function callback(e){
        dispatch({
            type:'xjbbInfo/updatePayload',
            payload:{
                activeKey:String(e)
            }
        })
        if(e==1){
            dispatch({
                type:'xjbbInfo/financeDay',
                payload:{}
            })
        }else if(e==2){
            dispatch({
                type:'xjbbInfo/financeMonth',
                payload:{}
            })
        }
    }

    function onChange(item,key){
        const year=key.split('-')[0],
            month=+(key.split('-')[1])
        dispatch({
            type:'xjbbInfo/updatePayload',
            payload:{
                year:year,
                month:month
            }
        })
    }

    function multipleChange(key){
        console.log(key)
        let restaurantIds=[]
        xjbbInfo.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'xjbbInfo/updatePayload',
            payload:{restaurantIds:restaurantIds}
        })
    }

    function multipleChange1(key){
        let restaurantIds=[]
        xjbbInfo.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'xjbbInfo/updatePayload',
            payload:{restaurantIds1:restaurantIds}
        })
    }

    function yearChange(e){
        console.log(e)
        dispatch({
            type:'xjbbInfo/updatePayload',
            payload:{
                year1:e
            }
        })
    }

    function jump(href){
        dispatch(routerRedux.push({
            pathname: href,
            query: {}
        }));
    }

    function getOutForm() {
        document.getElementById("formOrderExport").submit();
    }
    function getOutForm1() {
        document.getElementById("formOrderExport1").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
    }

    function onSearch(){
        dispatch({
            type:'xjbbInfo/financeDay',
            payload:{}
        })
    }

    function onSearch1(){
        dispatch({
            type:'xjbbInfo/financeMonth',
            payload:{}
        })
    }

    let columns1=[
        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
        {title:'大类',dataIndex:'categoryName',key:'categoryName',className:common.left},
        {title:'累计',dataIndex:'total',key:'total',className:common.right},
        {title:'日均',dataIndex:'avgDay',key:'avgDay',className:common.right},
        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
    ],list1=[]
    if(xjbbInfo.list1.length>0){
        xjbbInfo.list1[0].dayDetails.map((v,i)=>{
            columns1.push({
                title:v.day+v.week,
                dataIndex:'dw_'+i,
                key:'dw_'+i,
                className:common.right,
                render:(text,record,index)=>(
                    <span style={{cursor:'pointer',display:'block',width:'100%'}} onClick={()=>jumpToD(i,text,record,index)}>{record['dw_'+i]}</span>
                )
            })
        })
        xjbbInfo.list1.map((v,i)=>{
            v.dayDetails.map((vv,ii)=>{
                v['dw_'+ii]=vv.value
            })
            v.key=i
        })
        list1=xjbbInfo.list1
    }
    function jumpToD(i,text,record,index){
        console.log(i,text,record,index)
        dispatch(routerRedux.push({
            pathname: '/xjrb',
            query: {
                restaurantId:xjbbInfo.restaurantIds[0],
                targetTime:new Date(xjbbInfo.year+'-'+xjbbInfo.month+'-'+(+i+1)+' 00:00:00').getTime()
            }
        }));
    }

    let columns2=[
        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
        {title:'项目',dataIndex:'categoryName',key:'categoryName',className:common.left},
        {title:'合计',dataIndex:'total',key:'total',className:common.right},
        {title:'月均',dataIndex:'avgMonth',key:'avgMonth',className:common.right},
        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
    ],list2=[]
    if(xjbbInfo.list2.length>0){
        xjbbInfo.list2[0].monthDetails.map((v,i)=>{
            columns2.push({
                title:v.month,
                dataIndex:'mon_'+i,
                key:'mon_'+i,
                className:common.right,
                render:(text,record,index)=>(
                    <span style={{cursor:'pointer',display:'block',width:'100%'}} onClick={()=>jumpToD1(i,text,record,index)}>{record['mon_'+i]}</span>
                )
            })
        })
        xjbbInfo.list2.map((v,i)=>{
            v.monthDetails.map((vv,ii)=>{
                v['mon_'+ii]=vv.value
            })
            v.key=i
        })
        list2=xjbbInfo.list2
    }
    function jumpToD1(i,text,record,index){
        console.log(i,text,record,index)
        dispatch(routerRedux.push({
            pathname: '/xjyb',
            query: {
                restaurantId:xjbbInfo.restaurantIds1[0],
                targetTime:new Date(xjbbInfo.year1+'-'+(+i+1)+'-01 00:00:00').getTime()
            }
        }));
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
			type:'xjbbInfo/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'xjbbInfo/updatePayload',
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
      treeData:[xjbbInfo.obj1],
      value: xjbbInfo.value,
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
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>现金分析</Breadcrumb.Item>
                <Breadcrumb.Item>现金报表分析</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={xjbbInfo.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <Tabs activeKey={xjbbInfo.activeKey} onChange={callback}>
            <TabPane tab="日报" key="1">
                <div className={common.yzy_search_1}>
                    <div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择年月：</span>
                            <MonthPicker style={{width:'auto'}} onChange={onChange} allowClear={false} defaultValue={moment(xjbbInfo.year+'-'+xjbbInfo.month, 'YYYY-MM')} format="YYYY-MM" />
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
                <div style={{marginTop:20}}>
                    <Button type="primary" onClick={()=>jump('/xjrb')}>录入日报</Button>
                    <span style={{float:'right',color:'#999',marginRight:'50px'}}>单位：万元</span>
                </div>

                <Table
                    className={common.yzy}
                    columns={columns1}
                    dataSource={list1}
                    bordered
                    pagination={false}
                    style={{marginTop:'20px'}}
                    size="small"
                    scroll={{x:1700}}
                />
                

                <form action={xjbbInfo.linkOrigin+'report-api/report/export/financeday'} method="post" id='formOrderExport'>

                    <input type="hidden" name="restaurantIds" value = {JSON.stringify(xjbbInfo.restaurantIds)} id='pay_way'/>
                    <input type="hidden" name="targetTime" value = {JSON.stringify(new Date(xjbbInfo.year+'-'+xjbbInfo.month+'-01 00:00:00').getTime())} />       

                </form>
            </TabPane>
            <TabPane tab="月报" key="2">
                <div className={common.yzy_search_1}>
                    <div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择年：</span>
                            <Select onChange={yearChange} value={String(xjbbInfo.year1)} style={{width:'auto'}}>
                                {xjbbInfo.yearList.length>0&&xjbbInfo.yearList.map((v,i)=>(
                                    <Option key={String(v)}>{v}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择门店：</span>
                            <TreeSelect {...tProps} />
                        </div>
                        <div className={common.searchBlock}>
                            <Button size="default" type="primary" className={common.btn_1} onClick={onSearch1}>搜索</Button>
                            <Button size="default" className={common.btn_2} onClick={getOutForm1}>导出</Button>
                        </div>
                    </div>
                </div>
                
                <div>
                    <Button type="primary" onClick={()=>jump('/xjyb')}>录入月报</Button>
                    <span style={{float:'right',color:'#999',marginRight:'50px'}}>单位：万元</span>
                </div>


                <Table
                    className={common.yzy}
                    columns={columns2}
                    dataSource={list2}
                    bordered
                    pagination={false}
                    style={{marginTop:'20px'}}
                    size="small"
                    scroll={{x:1700}}
                />
                

                <form action={xjbbInfo.linkOrigin+'report-api/report/export/financemonth'} method="post" id='formOrderExport1'>

                    <input type="hidden" name="restaurantIds" value = {JSON.stringify(xjbbInfo.restaurantIds)} id='pay_way1'/>
                    <input type="hidden" name="targetTime" value = {JSON.stringify(new Date(xjbbInfo.year1+'-01-01 00:00:00').getTime())} />       

                </form>
            </TabPane>

        </Tabs>
      </Header>
    );

}

XjbbfxInfoPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,xjbbInfo}) {
    return { menu,xjbbInfo };
}

export default connect(mapStateToProps)(XjbbfxInfoPage);

