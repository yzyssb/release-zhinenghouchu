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
import styles from './MdjjxqPage.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Input from 'antd/lib/input';

import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
import common from '../common.less';


const MdjjxqPage=({
    mdjjxq,
    jjtjb,
    grjjxq,
    dispatch
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
                <span>{(mdjjxq.current-1)*mdjjxq.size+record.key}</span>
            )
        },
        {
            title:'员工编号',
            dataIndex:'employeeCode',
            key:'employeeCode',
            className:common.left,
        },
        {
        	title:'员工姓名',
            dataIndex:'employeeName',
            key:'employeeName',
            className:common.left,
        },
        {
            title:'岗位',
            dataIndex:'postName',
            key:'postName',
            className:common.left,
        },
        {
            title:'总菜品加工量',
            dataIndex:'prodFoodNum',
            key:'prodFoodNum',
            className:common.right,
        },
        {
            title:'总传菜量',
            dataIndex:'sendFoodNum',
            key:'sendFoodNum',
            className:common.right,
        },

        {
            title:'总后厨任务量',
            dataIndex:'kitchenNum',
            key:'kitchenNum',
            className:common.right,
        },
        {
            title:'总前厅任务量',
            dataIndex:'lobbyNum',
            key:'lobbyNum',
            className:common.right,
        },
        {
            title:'总打包备餐量',
            dataIndex:'boxNum',
            key:'boxNum',
            className:common.right,
        },
        {
            title:'总配送量',
            dataIndex:'takeoutNum',
            key:'takeoutNum',
            className:common.right,
        },

        {
            title:'总上餐具次数',
            dataIndex:'coverNum',
            key:'coverNum',
            className:common.right,
        },
        //{
        //    title:'上餐具计费',
        //    dataIndex:'coverMoney',
        //    key:'coverMoney'
        //},
        {
            title:'总撤台量',
            dataIndex:'revertNum',
            key:'revertNum',
            className:common.right,
        },
        //{
        //    title:'撤台计费',
        //    dataIndex:'revertMoney',
        //    key:'revertMoney'
        //},
        //{
        //    title:'菜品加工计费',
        //    dataIndex:'prodFoodMoney',
        //    key:'prodFoodMoney'
        //},
        //{
        //    title:'传菜计费',
        //    dataIndex:'sendFoodMoney',
        //    key:'sendFoodMoney'
        //},
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
        /*dispatch(routerRedux.push({
            pathname: '/grjjxq',
            query: {restaurantId:mdjjxq.restaurantId,employeeId:record.employeeId,startTime:new Date(mdjjxq.startTime).getTime(),endTime:new Date(mdjjxq.endTime).getTime()},
        }));*/
        dispatch({
            type:'jjtjb/updatePayload',
            payload:{
                restaurantName:jjtjb.restaurantName,
                restaurantId:record.restaurantId,
                employeeId:record.employeeId,
                activeKey:'3',
                employeeName:record.employeeName
            }
        })
        dispatch({
            type:'grjjxq/updatePayload',
            payload:{
                restaurantId:mdjjxq.restaurantId,
                employeeId:record.employeeId,
                startTime:new Date(mdjjxq.startTime).getTime(),
                endTime:new Date(mdjjxq.endTime).getTime(),
                static_days:'0'
            }
        })
        dispatch({
            type: 'grjjxq/getData',
            payload: {},
        });
    }

    const pagination = {
        total: mdjjxq.total,
        current:mdjjxq.current,
        pageSize: mdjjxq.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'mdjjxq/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'mdjjxq/getData',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*mdjjxq.size-mdjjxq.size;
        dispatch({type: 'mdjjxq/updatePayload',payload:{start:offset,current:pageNo}});

        dispatch({
            type:'mdjjxq/getData',
            payload:{}
        })
    }


    function onChange(item,key){
        dispatch({
            type:'mdjjxq/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }



    function onSearch(){
        dispatch({type: 'mdjjxq/updatePayload',payload:{current:1,start:0}});
        dispatch({
            type:'mdjjxq/getData',
            payload:{}
        })
    }


    function getOutForm() {
        document.getElementById("formOrderExport1").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
    }

    function searchInput1(e){
        dispatch({
            type:'mdjjxq/updatePayload',
            payload:{employeeName:trim(e.target.value)}
        })
    }

    function searchInput2(e){
        dispatch({
            type:'mdjjxq/updatePayload',
            payload:{postId:+e}
        })
    }

    function trim(str){
        return str.replace(/^\s+$/g,'')
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
            type:'mdjjxq/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }


    return(
      <span>
        <Spin spinning={mdjjxq.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search_1}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(mdjjxq.startTime), moment(mdjjxq.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(mdjjxq.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>姓名：</span>
                        <Input className={common.input} onChange={searchInput1} />
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>岗位：</span>
                        <Select defaultValue="0" onChange={searchInput2} className={common.yzy_cate}>
                            <Option key="0">请选择</Option>
                            {mdjjxq.list&&mdjjxq.list.length>0&&mdjjxq.list.map((val,idx)=>(
                                <Option key={String(val.id)}>{val.name}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                        <Button size="default" className={common.btn_2} onClick={getOutForm}>导出</Button>
                    </div>
                </div>
            </div>

            <Table
                className={common.jj_yzy}
                bordered
                columns={columns}
                dataSource={mdjjxq.Detail}
                pagination={pagination}
                size="small"
                scroll={{x:true}}
             />
            
        </div>
        <form action={mdjjxq.linkOrigin+'report-api/report/export/piece/restaurant'} method="post"  id='formOrderExport1'>
        
            <input type="hidden" name="restaurantName" value = {jjtjb.restaurantName}/>
            <input type="hidden" name="restaurantId" value = {JSON.stringify(+mdjjxq.restaurantId)}/>
            <input type="hidden" name="startTime" value = {new Date(mdjjxq.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(mdjjxq.endTime).getTime()}/>

            {mdjjxq.postId>0&&(<input type="hidden" name="postId" value = {JSON.stringify(+mdjjxq.postId)}/>)}
            {mdjjxq.employeeName.length>0&&(<input type="hidden" name="employeeName" value = {mdjjxq.employeeName}/>)}

            <input type="hidden" name="token" value = {JSON.stringify(getUserToken())}/>

        </form>


      </span>
    );

}


function mapStateToProps({mdjjxq,jjtjb,grjjxq}) {
    return { mdjjxq,jjtjb,grjjxq };
}

export default connect(mapStateToProps)(MdjjxqPage);

