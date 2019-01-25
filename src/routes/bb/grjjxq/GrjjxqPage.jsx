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
import styles from './GrjjxqPage.less';
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
import common from '../common.less';


const GrjjxqPage=({
    grjjxq,
    jjtjb,
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
                grjjxq.size*(grjjxq.current-1)+index+1
            )
        },
        // {
        // 	title:'时间',
        //     dataIndex:'time',
        //     key:'time',
        //     className:common.left,
        // },
        {
            title:'订单编号',
            dataIndex:'billNo',
            key:'billNo',
            className:common.left,
        },
        {
            title:'计件内容',
            dataIndex:'name',
            key:'name',
            className:common.left,
        },
        {
            title:'菜品名称',
            dataIndex:'foodName',
            key:'foodName',
            className:common.left,
        },
        {
            title:'任务名称',
            dataIndex:'taskName',
            key:'taskName',
            className:common.left,
        },
        {
            title:'数量',
            dataIndex:'num',
            key:'num',
            className:common.right,
        },
        {
            title:'任务接受时间',
            dataIndex:'startTime',
            key:'startTime',
            className:common.left,
        },
        {
            title:'任务完成时间',
            dataIndex:'endTime',
            key:'endTime',
            className:common.left,
        },
        {
            title:'耗时',
            dataIndex:'useTime',
            key:'useTime',
            className:common.left,
        }
    ]

    const pagination = {
        total: grjjxq.total,
        current:grjjxq.current,
        pageSize: grjjxq.size,        
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'grjjxq/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'grjjxq/getData',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*grjjxq.size-grjjxq.size;
        dispatch({type: 'grjjxq/updatePayload',payload:{start:offset,current:pageNo}});

        dispatch({
            type:'grjjxq/getData',
            payload:{}
        })
    }


    function onChange(item,key){
        dispatch({
            type:'grjjxq/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }


    function onSearch(){
        dispatch({type: 'grjjxq/updatePayload',payload:{current:1,start:0}});
        dispatch({
            type:'grjjxq/getData',
            payload:{}
        })
    }


    function getOutForm() {
        document.getElementById("formOrderExport2").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
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
            type:'grjjxq/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    return(
      <span>
        <Spin spinning={grjjxq.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search_1}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(grjjxq.startTime), moment(grjjxq.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(grjjxq.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
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
                dataSource={grjjxq.Detail}
                pagination={pagination}
                size="small"
                scroll={{x:true}}
             />
            
        </div>
        <form action={grjjxq.linkOrigin+'report-api/report/export/piece/employee'} method="post"  id='formOrderExport2'>
        
            <input type="hidden" name="restaurantName" value = {jjtjb.restaurantName}/>
            <input type="hidden" name="restaurantId" value = {JSON.stringify(+grjjxq.restaurantId)}/>
            <input type="hidden" name="employeeId" value = {JSON.stringify(+grjjxq.employeeId)}/>
            <input type="hidden" name="startTime" value = {new Date(grjjxq.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(grjjxq.endTime).getTime()}/>
            <input type="hidden" name="token" value = {JSON.stringify(getUserToken())}/>

        </form>

      </span>
    );

}


function mapStateToProps({grjjxq,jjtjb}) {
    return { grjjxq,jjtjb };
}

export default connect(mapStateToProps)(GrjjxqPage);

