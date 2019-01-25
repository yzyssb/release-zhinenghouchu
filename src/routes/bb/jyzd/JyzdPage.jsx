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
import TreeSelect from 'antd/lib/tree-select';
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
import Icon from 'antd/lib/icon';
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Cascader from 'antd/lib/cascader';
import message from 'antd/lib/message';



function JyzdPage ({menu,dispatch,jyzd}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: jyzd.total,
        current:jyzd.current,
        pageSize: jyzd.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'jyzd/updatePayload',payload:{size:pageSize,current:1,start:0}});
    }

    function onPageChange(pageNo){
        var offset = pageNo*jyzd.size-jyzd.size;
        dispatch({type: 'jyzd/updatePayload',payload:{start:offset,current:pageNo}});
    }

    const columns1=[
        {title:'日期',dataIndex:'dates',key:'dates',render:(text,record,index)=>{
            if(index%2==0){
                return {
                    children: <span>{text}</span>,
                    props: {
                        rowSpan: 2
                    },
                }
            }else{
                return {
                    children: <span></span>,
                    props: {
                        rowSpan: 0
                    },
                }
            }
        }},
        {title:'交易类型',dataIndex:'typeName',key:'typeName'},
        {title:'交易笔数（笔）',dataIndex:'transactionSum',key:'transactionSum'},
        {title:'交易金额（元）',dataIndex:'orderSum',key:'orderSum'},
        {title:'资金交易（元）',dataIndex:'cashPay',key:'cashPay'},
        {title:'积分交易（元）',dataIndex:'scorePay',key:'scorePay'},
        
        {title:'管理费支出（元）',dataIndex:'managementFee',key:'managementFee'},
        {title:'赠送积分（元）',dataIndex:'scoreFee',key:'scoreFee'},
        {title:'手续费（元）',dataIndex:'channelSettlementFee',key:'channelSettlementFee'},
        {title:'入账金额（元）',dataIndex:'settleExpendMoney',key:'settleExpendMoney'},
        {title:'操作',dataIndex:'action',key:'action',render:(text,record,index)=>(
            <a onClick={()=>{
                console.log(jyzd.name)
                dispatch(routerRedux.push({
                    pathname: '/jyzdDetail',
                    query: {
                        startTime:new Date(moment(record.dates).format('YYYY-MM-DD 00:00:00')).getTime(),
                        endTime:new Date(moment(record.dates).format('YYYY-MM-DD 23:59:59')).getTime(),
                        restaurantId:jyzd.restaurantId,
                        // transactionScene:jyzd.receivablesTypeId,
                        costType:51,
                        type:record.type,
                        dates:record.dates,
                        name:jyzd.name
                    }
                }));
            }}>详情</a>
        )},
    ]

    const columns2=[
        {title:'日期',dataIndex:'dates',key:'dates',render:(text,record,index)=>{
            if(index%2==0){
                return {
                    children: <span>{text}</span>,
                    props: {
                        rowSpan: 2
                    },
                }
            }else{
                return {
                    children: <span></span>,
                    props: {
                        rowSpan: 0
                    },
                }
            }
        }},
        {title:'交易类型',dataIndex:'typeName',key:'typeName'},
        {title:'会籍费分佣量（笔）',dataIndex:'transactionSum',key:'transactionSum'},
        {title:'会籍费分佣金额（元）',dataIndex:'memshipRebateSum',key:'memshipRebateSum'},
        
        {title:'管理费支出（元）',dataIndex:'rebateManagerFee',key:'rebateManagerFee'},
        {title:'入账金额（元）',dataIndex:'settleExpendMoney',key:'settleExpendMoney'},
        {title:'操作',dataIndex:'action',key:'action',render:(text,record,index)=>(
            <a onClick={()=>{
                dispatch(routerRedux.push({
                    pathname: '/jyzdDetail',
                    query: {
                        startTime:new Date(moment(record.dates).format('YYYY-MM-DD 00:00:00')).getTime(),
                        endTime:new Date(moment(record.dates).format('YYYY-MM-DD 23:59:59')).getTime(),
                        restaurantId:jyzd.restaurantId,
                        // transactionScene:jyzd.receivablesTypeId,
                        costType:52,
                        type:record.type,
                        dates:record.dates,
                        name:jyzd.name
                    }
                }));
            }}>详情</a>
        )},
    ]

    function callback(e){
        dispatch({
            type:'jyzd/updatePayload',
            payload:{
                activeKey:e,
                current:1,
                list1:[],
                list2:[]
            }
        })
        if(e==1){
            dispatch({
                type:'jyzd/storeByTheDay',
                payload:{}
            })
        }else if(e==2){
            dispatch({
                type:'jyzd/storeMemshipByTheDay',
                payload:{}
            })
        }
    }


    function receivablesTypeIdChange(e){
        dispatch({
            type:'jyzd/updatePayload',
            payload:{
                receivablesTypeId:+e
            }
        })
    }

    function searchAction(){
        if(jyzd.choosedArr.length<2){
            message.error('请先选择门店')
            return
        }
        dispatch({
            type:'jyzd/updatePayload',
            payload:{current:1}
        })
        if(jyzd.activeKey==1){
            dispatch({
                type:'jyzd/storeByTheDay',
                payload:{}
            })
        }else if(jyzd.activeKey==2){
            dispatch({
                type:'jyzd/storeMemshipByTheDay',
                payload:{}
            })
        }
    }


    const disabledStartDate = (startTime) => {
        const endTime = jyzd.endTime;
        if (!startTime || !endTime) {
          return false;
        }
        let start=new Date(moment(startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            //yes=new Date(moment(new Date().getTime()).format('YYYY-MM-DD 00:00:00')).getTime()
            yes=new Date(moment(new Date().getTime()-24*3600*1000).format('YYYY-MM-DD 00:00:00')).getTime()
        return (end-start)>31*24*3600*1000||start>yes;
    }

    const disabledEndDate = (endTime) => {
        const startTime = jyzd.startTime;
        if (!endTime || !startTime) {
          return false;
        }
        let start=new Date(moment(startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            //yes=new Date(moment(new Date().getTime()).format('YYYY-MM-DD 23:59:59')).getTime()
            yes=new Date(moment(new Date().getTime()-24*3600*1000).format('YYYY-MM-DD 23:59:59')).getTime()
        return (end-start)>31*24*3600*1000||end>yes;
    }

    const onStartChange = (value) => {
        let start=new Date(moment(value).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(jyzd.endTime).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime()
        dispatch({
            type:'jyzd/updatePayload',
            payload:{ startTime: start, endTime: start>end?temp:end}
        })
    }

    const onEndChange = (value) => {
        let start=new Date(moment(jyzd.startTime).format('YYYY-MM-DD 00:00:00')).getTime(),
            end=new Date(moment(value).format('YYYY-MM-DD 23:59:59')).getTime(),
            temp=new Date(moment(value).format('YYYY-MM-DD 00:00:00')).getTime()
        dispatch({
            type:'jyzd/updatePayload',
            payload:{ endTime: value, startTime: start>end?temp:start }
        })
    }

    const handleStartOpenChange = (open) => {
        if (!open) {
            dispatch({
                type:'jyzd/updatePayload',
                payload:{ endOpen: true }
            })
        }
    }

    const handleEndOpenChange = (open) => {
        dispatch({
            type:'jyzd/updatePayload',
            payload:{ endOpen: open }
        })
    }

    function back(){
        window.history.go(-1)
    }

    //修改
    function storeChange(value,rows) {
        var name=rows.length==2?rows[1].label:''
        dispatch({
            type:'jyzd/updatePayload',
            payload:{
                restaurantId:value.length==2?value[1]:0,
                name:name,
                choosedArr:value
            }
        })
        sessionStorage.setItem('res_yzy',JSON.stringify(value))
        sessionStorage.setItem('resName_yzy',JSON.stringify(name))
    }

    return(
      <Header {...HeaderProps}>
        <Spin spinning={jyzd.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>账单管理</Breadcrumb.Item>
                    <Breadcrumb.Item>交易账单</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        <Tabs activeKey={String(jyzd.activeKey)} onChange={callback}>
            <TabPane tab="收银账单" key="1">
            </TabPane>
            <TabPane tab="会籍费分佣账单" key="2">
            </TabPane>
        </Tabs>

        <div style={{padding:10,background:'rgb(242,242,242)'}}>
            <Icon type="exclamation-circle" theme="outlined" style={{color:'rgb(22, 155, 213)',marginRight:5}} />
            每日10:00前完成数据更新，当前数据更新至{jyzd.timeParse(new Date().getTime()-24*3600*1000)}
        </div>

        <div className={common.yzy_search}>
            <div className={common.searchBlock}>
                <span className={common.yzy_txt}>账单归属：</span>
                <Cascader
                    options={jyzd.options}
                    style={{width:400}}
                    expandTrigger="hover"
                    value={jyzd.choosedArr}
                    onChange={storeChange}
                    placeholder="请选择门店"
                />
            </div>
            <div className={common.searchBlock} style={{position:'relative',marginBottom:40}}>
                <span className={common.yzy_txt}>日期：</span>
                <DatePicker
                  disabledDate={disabledStartDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  value={moment(jyzd.startTime)}
                  placeholder="开始时间"
                  onChange={onStartChange}
                  onOpenChange={handleStartOpenChange}
                  showToday={false}
                />
                <DatePicker
                  disabledDate={disabledEndDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  value={moment(jyzd.endTime)}
                  placeholder="结束时间"
                  onChange={onEndChange}
                  open={jyzd.endOpen}
                  onOpenChange={handleEndOpenChange}
                  style={{marginLeft:20}}
                  showToday={false}
                />
                <span style={{position:'absolute',bottom:'-25px',left:75,color:'#999'}}>单次时间跨度最多支持31天，每日10点更新数据</span>
            </div>
            {/* <div className={common.searchBlock}>
                <span className={common.yzy_txt}>交易场景：</span>
                <Select className={common.platform} style={{minWidth:150}} value={String(jyzd.receivablesTypeId)} onChange={receivablesTypeIdChange}>
                    <Select.Option key="-1">所有场景</Select.Option>
                    {jyzd.selectList.length>0&&jyzd.selectList.map((v,i)=>(
                        <Select.Option key={String(v.id)}>{v.typeName}</Select.Option>
                    ))}
                </Select>
            </div> */}
            <div className={common.searchBlock}>
                <Button type="primary" className={common.btn_3} onClick={searchAction}>查询</Button>
                <Button className={common.btn_3} onClick={()=>{
                    if(jyzd.choosedArr.length<2){
                        message.error('请先选择门店')
                        return
                    }
                    dispatch({
                        type:'jyzd/_export',
                        payload:{}
                    })
                }}>导出(消费)</Button>
                <Button className={common.btn_3} onClick={()=>{
                    if(jyzd.choosedArr.length<2){
                        message.error('请先选择门店')
                        return
                    }
                    dispatch({
                        type:'jyzd/_export1',
                        payload:{}
                    })
                }}>导出(退款)</Button>
            </div>
        </div>

        <Table
            className={common.yzy_zd}
            columns={jyzd.activeKey==1?columns1:columns2}
            dataSource={jyzd.activeKey==1?jyzd.list1:jyzd.list2}
            bordered
            pagination={pagination}
            scroll={{x:true}}
        />


      </Header>
    );

}

JyzdPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,jyzd}) {
    return { menu,jyzd };
}

export default connect(mapStateToProps)(JyzdPage);

