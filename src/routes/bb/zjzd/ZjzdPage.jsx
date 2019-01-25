import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import common from '../common.less';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Spin from 'antd/lib/spin';
import Breadcrumb from 'antd/lib/breadcrumb';
import Select from 'antd/lib/select';
const Option=Select.Option;
import Cascader from 'antd/lib/cascader';
import message from 'antd/lib/message';


function ZjzdPage({ menu, dispatch,zjzd }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: zjzd.total,
        current:zjzd.current,
        pageSize: zjzd.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'zjzd/updatePayload',payload:{size:pageSize,current:1,start:0}});
    }

    function onPageChange(pageNo){
        var offset = pageNo*zjzd.size-zjzd.size;
        dispatch({type: 'zjzd/updatePayload',payload:{start:offset,current:pageNo}});
    }

    function callback(e){
        dispatch({
            type:'zjzd/updatePayload',
            payload:{activeKey:e,current:1}
        })
        dispatch({
            type:'zjzd/getData',
            payload:{}
        })
    }

    //日期操作
    const disabledStartDate = (startTime) => {
        const endTime = zjzd.endTime;
        if (!startTime || !endTime) {
            return false;
        }
        let start=new Date(moment(startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            yes=new Date(moment(new Date().getTime()-24*3600*1000).format('YYYY-MM-DD 00:00:00')).getTime()
            //yes=new Date(moment(new Date().getTime()).format('YYYY-MM-DD 00:00:00')).getTime()
        return (end-start)>31*24*3600*1000||start>yes;
    }

    const disabledEndDate = (endTime) => {
        const startTime = zjzd.startTime;
        if (!endTime || !startTime) {
            return false;
        }
        let start=new Date(moment(startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            yes=new Date(moment(new Date().getTime()-24*3600*1000).format('YYYY-MM-DD 23:59:59')).getTime()
            //yes=new Date(moment(new Date().getTime()).format('YYYY-MM-DD 23:59:59')).getTime()
        return (end-start)>31*24*3600*1000||end>yes;
    }

    const onStartChange = (value) => {
        console.log(value)
        let start=new Date(moment(value).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(zjzd.endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime()
        dispatch({
            type:'zjzd/updatePayload',
            payload:{ startTime: start, endTime: start>end?temp:end}
        })
    }

    const onEndChange = (value) => {
        console.log(value)
        let start=new Date(moment(zjzd.startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 00:00:00')).getTime()
        dispatch({
            type:'zjzd/updatePayload',
            payload:{ endTime: value, startTime: start>end?temp:start }
        })
    }

    const handleStartOpenChange = (open) => {
        if (!open) {
            dispatch({
                type:'zjzd/updatePayload',
                payload:{ endOpen: true }
            })
        }
    }

    const handleEndOpenChange = (open) => {
        dispatch({
            type:'zjzd/updatePayload',
            payload:{ endOpen: open }
        })
    }

    const columns=[
        {title:'日期',dataIndex:'date',key:'date'},
        {title:'期初余额（元）',dataIndex:'initiateMoney',key:'initiateMoney',className:common.right},
        {title:'收入（元）',dataIndex:'incom',key:'incom',className:common.right},
        {title:'支出（元）',dataIndex:'payAmount',key:'payAmount',className:common.right},
        {title:'日终余额（元）',dataIndex:'endMoney',key:'endMoney',className:common.right},
        {title:'操作',dataIndex:'action',key:'action',render:(text,record,index)=>(<a onClick={()=>jump(record)}>详情</a>)},
    ]

    function jump(record){
        dispatch(routerRedux.push({
            pathname: '/zhls',
            query: {
                activeKey:zjzd.activeKey,
                date:record.date,
                restaurantId:+zjzd.restaurantId,
                name:zjzd.name
            }
        }));
    }


    function searchAction(){
        if(zjzd.choosedArr.length<2){
            message.error('请先选择门店')
            return
        }
        dispatch({
            type:'zjzd/updatePayload',
            payload:{current:1}
        })
        dispatch({
            type:'zjzd/fundBillStore',
            payload:{}
        })
    }

    function back(){
        window.history.go(-1)
    }

    //修改
    function storeChange(value) {
        var name=rows.length==2?rows[1].label:''
        dispatch({
            type:'zjzd/updatePayload',
            payload:{
                restaurantId:value.length==2?value[1]:0,
                name:name,
                choosedArr:value
            }
        })
        sessionStorage.setItem('res_yzy',JSON.stringify(value))
        sessionStorage.setItem('resName_yzy',JSON.stringify(name))
    }

    return (
        <Header {...HeaderProps}>
            <Spin spinning={zjzd.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>账单管理</Breadcrumb.Item>
                    <Breadcrumb.Item>资金账单</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {/* <Tabs activeKey={String(zjzd.activeKey)} onChange={callback}>
                <TabPane tab="收银账户" key="1"></TabPane>
            </Tabs> */}

            <div className={common.yzy_search_1} style={{marginTop:20}}>
                <div className={common.searchBlock}>
                    <span className={common.yzy_txt}>账单归属：</span>
                    <Cascader
                        options={zjzd.options}
                        style={{width:400}}
                        expandTrigger="hover"
                        value={zjzd.choosedArr}
                        onChange={storeChange}
                        placeholder="请选择门店"
                    />
                </div>
                <div className={common.searchBlock} style={{position:'relative',marginTop:20,marginBottom:40}}>
                    <span className={common.yzy_txt}>日期：</span>
                    <DatePicker
                        disabledDate={disabledStartDate}
                        format="YYYY-MM-DD"
                        allowClear={false}
                        value={moment(zjzd.startTime)}
                        placeholder="开始时间"
                        onChange={onStartChange}
                        onOpenChange={handleStartOpenChange}
                        showToday={false}
                    />
                    <DatePicker
                        disabledDate={disabledEndDate}
                        format="YYYY-MM-DD"
                        allowClear={false}
                        value={moment(zjzd.endTime)}
                        placeholder="结束时间"
                        onChange={onEndChange}
                        open={zjzd.endOpen}
                        onOpenChange={handleEndOpenChange}
                        style={{marginLeft:20}}
                        showToday={false}
                    />
                    <span style={{position:'absolute',bottom:'-25px',left:72,color:'#999'}}>单次时间跨度最多支持31天</span>
                </div>
                <div className={common.searchBlock}>
                    <Button type="primary" className={common.btn_1} onClick={searchAction}>查询</Button>
                </div>
            </div>

            <Table
                className={common.yzy}
                columns={columns}
                dataSource={zjzd.list}
                bordered
                pagination={pagination}
                size="small"
            />

        </Header>
    );

}

ZjzdPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu,zjzd }) {
    return { menu,zjzd };
}

export default connect(mapStateToProps)(ZjzdPage);

