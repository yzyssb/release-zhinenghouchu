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
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;
import Breadcrumb from 'antd/lib/breadcrumb';

function ZhlsPage({ menu, dispatch,zhls }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: zhls.total,
        current:zhls.current,
        pageSize: zhls.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'zhls/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({type:'zhls/fundBillDetail',payload:{}})
    }

    function onPageChange(pageNo){
        var offset = pageNo*zhls.size-zhls.size;
        dispatch({type: 'zhls/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({type:'zhls/fundBillDetail',payload:{}})
    }

    function callback(e){
        dispatch({
            type:'zhls/updatePayload',
            payload:{activeKey:e,current:1}
        })
    }

    //日期操作
    const disabledStartDate = (startTime) => {
        const endTime = zhls.endTime;
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
        const startTime = zhls.startTime;
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
            end=new Date(moment(zhls.endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime()
        dispatch({
            type:'zhls/updatePayload',
            payload:{ startTime: start, endTime: start>end?temp:end}
        })
    }

    const onEndChange = (value) => {
        console.log(value)
        let start=new Date(moment(zhls.startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 00:00:00')).getTime()
        dispatch({
            type:'zhls/updatePayload',
            payload:{ endTime: value, startTime: start>end?temp:start }
        })
    }

    const handleStartOpenChange = (open) => {
        if (!open) {
            dispatch({
                type:'zhls/updatePayload',
                payload:{ endOpen: true }
            })
        }
    }

    const handleEndOpenChange = (open) => {
        dispatch({
            type:'zhls/updatePayload',
            payload:{ endOpen: open }
        })
    }

    const columns=[
        {title:'记账时间',dataIndex:'tradeTime',key:'tradeTime'},
        {title:'业务订单号',dataIndex:'businessOrderId',key:'businessOrderId'},
        {title:'资金流水号',dataIndex:'channelOrderNo',key:'channelOrderNo'},
        {title:'业务名称',dataIndex:'tradeScenName',key:'tradeScenName'},
        {title:'业务类型',dataIndex:'tradeMode',key:'tradeMode'},
        {title:'记账类型',dataIndex:'incomExpen',key:'incomExpen'},
        {title:'收支金额（元）',dataIndex:'tradeAmount',key:'tradeAmount',className:common.right},
    ]

    function searchAction(){
        dispatch({
            type:'zhls/updatePayload',
            payload:{current:1}
        })
        dispatch({
            type:'zhls/fundBillDetail',
            payload:{}
        })
    }

    const option1=[
        { label: '交易', value: '1' },
        { label: '账户转账', value: '2' },
        { label: '分账', value: '3' },
        { label: '退款', value: '4' },
        { label: '分账退款', value: '5' },
        { label: '提现', value: '6' },
    ]

    const option2=[
        { label: '收入', value: '1' },
        { label: '支出', value: '2' },
    ]

    function businessOrderIdChange(e){
        dispatch({
            type:'zhls/updatePayload',
            payload:{businessOrderId:e.target.value}
        })
    }

    function tradeModeChange(e){
        dispatch({
            type:'zhls/updatePayload',
            payload:{tradeMode:e}
        })
    }

    function incomExpenChange(e){
        dispatch({
            type:'zhls/updatePayload',
            payload:{incomExpen:e}
        })
    }

    function back(num){
        window.history.go(+num)
    }

    return (
        <Header {...HeaderProps}>
            <Spin spinning={zhls.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={()=>back(-2)} style={{cursor:'pointer'}}>账单管理</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>back(-1)} style={{cursor:'pointer'}}>资金账单</Breadcrumb.Item>
                    <Breadcrumb.Item>账户流水</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {/* <Tabs activeKey={String(zhls.activeKey)} onChange={callback}>
                <TabPane tab="收银账户" key="1"></TabPane>
            </Tabs> */}

            <div className={common.yzy_search_1} style={{marginTop:20}}>
                    <div className={common.searchBlock_1}>
                        <span className={common.yzy_txt}>单号查询：</span>
                        <Input value={zhls.businessOrderId} className={common.input} onChange={businessOrderIdChange} />
                    </div>
                    <div className={common.searchBlock_1} style={{position:'relative',marginBottom:40}}>
                        <span className={common.yzy_txt}>记账时间：</span>
                        <DatePicker
                            disabledDate={disabledStartDate}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            value={moment(zhls.startTime)}
                            placeholder="开始时间"
                            onChange={onStartChange}
                            onOpenChange={handleStartOpenChange}
                            showToday={false}
                        />
                        <DatePicker
                            disabledDate={disabledEndDate}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            value={moment(zhls.endTime)}
                            placeholder="结束时间"
                            onChange={onEndChange}
                            open={zhls.endOpen}
                            onOpenChange={handleEndOpenChange}
                            style={{marginLeft:20}}
                            showToday={false}
                        />
                        <span style={{position:'absolute',bottom:'-25px',left:100,color:'#999'}}>单次时间跨度最多支持31天</span>
                    </div>
                    <div className={common.searchBlock_1}>
                        <span className={common.yzy_txt}>业务类型：</span>
                        <CheckboxGroup options={option1} value={zhls.tradeMode} onChange={tradeModeChange}/>
                    </div>
                    <div className={common.searchBlock_1}>
                        <span className={common.yzy_txt}>记账类型：</span>
                        <CheckboxGroup options={option2} value={zhls.incomExpen} onChange={incomExpenChange}/>
                    </div>
                    <div className={common.searchBlock_1}>
                        <Button type="primary" onClick={searchAction}>查询</Button>
                        <Button style={{marginLeft:20}} onClick={()=>dispatch({
                            type:'zhls/_export',
                            payload:{}
                        })}>导出</Button>
                    </div>
                
            </div>

            <div style={{lineHeight:'40px',background:'#fafafa',padding:'0 10px'}}>
                <span>收入：{zhls.extraData.incomeAmount||'0'}元，{zhls.extraData.incomeCount||'0'}笔</span>
                <span style={{marginLeft:50}}>支出：{zhls.extraData.expenditureAmount||'0'}元，{zhls.extraData.expenditureCount||'0'}笔</span>
            </div>
            <Table
                className={common.yzy}
                columns={columns}
                dataSource={zhls.list}
                bordered
                pagination={pagination}
                size="small"
            />

        </Header>
    );

}

ZhlsPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu,zhls }) {
    return { menu,zhls };
}

export default connect(mapStateToProps)(ZhlsPage);

