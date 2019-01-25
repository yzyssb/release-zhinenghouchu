import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import common from '../common.less';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import { Popover } from 'antd';



function JyzdDetailPage ({menu,dispatch,jyzdDetail}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: jyzdDetail.total,
        current:jyzdDetail.current,
        pageSize: jyzdDetail.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'jyzdDetail/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        if(jyzdDetail.type==1){
            dispatch({
                type:'jyzdDetail/auditBillsPayDetail',
                payload:{}
            })
        }else if(jyzdDetail.type==2){
            dispatch({
                type:'jyzdDetail/auditBillsRefundDetail',
                payload:{}
            })
        }
    }

    function onPageChange(pageNo){
        var offset = pageNo*jyzdDetail.size-jyzdDetail.size;
        dispatch({type: 'jyzdDetail/updatePayload',payload:{offset:offset,current:pageNo}});
        if(jyzdDetail.type==1){
            dispatch({
                type:'jyzdDetail/auditBillsPayDetail',
                payload:{}
            })
        }else if(jyzdDetail.type==2){
            dispatch({
                type:'jyzdDetail/auditBillsRefundDetail',
                payload:{}
            })
        }
    }

    //收银
    const columns1=[
        {title:'交易请求时间',dataIndex:'tradeTime',key:'tradeTime'},
        {title:'交易完成时间',dataIndex:'payTime',key:'payTime'},
        {title:'交易主体',dataIndex:'subject',key:'subject'},
        {title:'所在商户',dataIndex:'merchantName',key:'merchantName'},
        {title:'所在门店',dataIndex:'storeName',key:'storeName'},

        {title:'终端号',dataIndex:'deviceNo',key:'deviceNo'},
        {title:'商户订单号',dataIndex:'businessOrderNo',key:'businessOrderNo'},//确定
        {title:'平台交易单号',dataIndex:'payTradeNo',key:'payTradeNo'},//确定

        {title:'交易类型',dataIndex:'tradeType',key:'tradeType'},
        {title:'交易场景',dataIndex:'receivablesType',key:'receivablesType'},

        {title:'订单金额（元）',dataIndex:'orderAmount',key:'orderAmount'},
        {title:'资金支付（元）',dataIndex:'payCoinAmount',key:'payCoinAmount'},
        {title:'积分支付（元）',dataIndex:'payCreditAmount',key:'payCreditAmount'},
        {title:'返赠用户积分（元）',dataIndex:'creditProfit',key:'creditProfit'},
        {title:'返赠积分费率（%）',dataIndex:'creditProfitInterestRate',key:'creditProfitInterestRate'},

        {title:'扣除管理费（元）',dataIndex:'managerFee',key:'managerFee'},
        {title:'管理费费率（%）',dataIndex:'managerInterestRate',key:'managerInterestRate'},
        {title:'手续费（元）',dataIndex:'settelFee',key:'settelFee'},
        {title:'手续费率（%）',dataIndex:'settelInterestRate',key:'settelInterestRate'},
        {title:'入账金额（元）',dataIndex:'shouldSettelFee',key:'shouldSettelFee'},

        {title:'对账备注',dataIndex:'remark',key:'remark'},
    ]

    //收银退款
    const columns2=[
        {title:'退款提交时间',dataIndex:'refundTime',key:'refundTime'},
        {title:'退款完成时间',dataIndex:'tradeTime',key:'tradeTime'},
        {title:'退款主体',dataIndex:'subject',key:'subject'},
        {title:'所在商户',dataIndex:'merchantName',key:'merchantName'},
        {title:'所在门店',dataIndex:'storeName',key:'storeName'},

        {title:'终端号',dataIndex:'deviceNo',key:'deviceNo'},
        {title:'退款请求号',dataIndex:'payTradeNo',key:'payTradeNo'},
        {title:'原商户订单号',dataIndex:'businessOrderNo',key:'businessOrderNo'},//确定
        {title:'交易类型',dataIndex:'tradeType',key:'tradeType'},

        {title:'交易场景',dataIndex:'receivablesType',key:'receivablesType'},
        {title:'原订单金额（元）',dataIndex:'orderAmount',key:'orderAmount'},
        
        {title:'原资金支付（元）',dataIndex:'payCoinAmount',key:'payCoinAmount'},//新确定

        {title:'原积分支付（元）',dataIndex:'payCreditAmount',key:'payCreditAmount'},//确定
        {title:'原管理费收取（元）',dataIndex:'managerFee',key:'managerFee'},//确定
        {title:'原积分赠送（元）',dataIndex:'creditProfit',key:'creditProfit'},//确定
        {title:'原手续费（元）',dataIndex:'settelFee',key:'settelFee'},//增加
        {title:'退款说明',dataIndex:'refundRemark',key:'refundRemark'},
        {title:'实际资金退款（元）',dataIndex:'refundCoinAmount',key:'refundCoinAmount'},//确定
        {title:'实际积分退款（元）',dataIndex:'refundCreditAmount',key:'refundCreditAmount'},//确定
        {title:'实际管理费收取退款（元）',dataIndex:'refundmanagerFee',key:'refundmanagerFee'},//确定
        {title:'实际积分赠送退款（元）',dataIndex:'refundCreditProfit',key:'refundCreditProfit'},//确定
        {title:'实际手续费退款（元）',dataIndex:'refundSettelFee',key:'refundSettelFee'},//增加
        // {title:'原返赠用户积分（元）',dataIndex:'creditProfit',key:'creditProfit'},
        // {title:'退回返赠用户积分（元）',dataIndex:'refundCreditProfit',key:'refundCreditProfit'},
        // {title:'原扣除管理费（元）',dataIndex:'managerFee',key:'managerFee'},
        // {title:'退回扣除管理费（元）',dataIndex:'refundmanagerFee',key:'refundmanagerFee'},
        // {title:'原通道结算费（元）',dataIndex:'settelFee',key:'settelFee'},
        // {title:'退回通道结算费（元）',dataIndex:'refundSettelFee',key:'refundSettelFee'},
        {title:'实际退款（元）',dataIndex:'shouldrefundFee',key:'shouldrefundFee'},

        {title:'对账备注',dataIndex:'remark',key:'remark'},
    ]

    //会籍费分佣
    const columns3=[
        {title:'分佣请求时间',dataIndex:'tradeTime',key:'tradeTime'},
        {title:'分佣完成时间',dataIndex:'payTime',key:'payTime'},
        {title:'分佣主体',dataIndex:'subject',key:'subject'},

        {title:'记录单号',dataIndex:'payTradeNo',key:'payTradeNo'},//确定
        {title:'原平台交易单号',dataIndex:'businessOrderNo',key:'businessOrderNo'},//确定

        {title:'原订单金额（元）',dataIndex:'orderAmount',key:'orderAmount'},
        {title:'分佣金额（元）',dataIndex:'rebateFee',key:'rebateFee'},
        {title:'分佣费率（%）',dataIndex:'rebateInterestRate',key:'rebateInterestRate'},
        {title:'管理费金额（元）',dataIndex:'managerFee',key:'managerFee'},
        {title:'管理费费率（%）',dataIndex:'managerInterestRate',key:'managerInterestRate'},

        {title:'入账金额（元）',dataIndex:'shouldSettelFee',key:'shouldSettelFee'},
        {title:'对账备注',dataIndex:'remark',key:'remark'},
    ]

    //会籍费分佣退款
    const columns4=[
        {title:'退款提交时间',dataIndex:'refundTime',key:'refundTime'},
        {title:'退款完成时间',dataIndex:'tradeTime',key:'tradeTime'},
        {title:'退款主体',dataIndex:'subject',key:'subject'},

        {title:'退款请求号',dataIndex:'payTradeNo',key:'payTradeNo'},
        {title:'原记录单号',dataIndex:'businessOrderNo',key:'businessOrderNo'},

        {title:'原分佣金额（元）',dataIndex:'rebateFee',key:'rebateFee'},
        {title:'请求退款金额（元）',dataIndex:'refundRebateFee',key:'refundRebateFee'},
        {title:'退款说明',dataIndex:'refundRemark',key:'refundRemark'},
        
        {title:'实际退款（元）',dataIndex:'shouldrefundFee',key:'shouldrefundFee'},
        {title:'对账备注',dataIndex:'remark',key:'remark'},
    ]




    function back(){
        window.history.go(-1)
    }

    return(
      <Header {...HeaderProps}>
        <Spin spinning={jyzdDetail.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />

        <div style={{padding:'10px 0',marginBottom:30}}>
            <span onClick={back} style={{cursor:'pointer'}}>
                <Icon type="left" theme="outlined" />
                返回
            </span>
            <span style={{marginLeft:20}}>
                {(jyzdDetail.dates&&jyzdDetail.timeParse(jyzdDetail.dates))+' '+jyzdDetail.name+' '+(jyzdDetail.costType==51?jyzdDetail.type==1?'商户收银账单':'商户收银退款对账单':jyzdDetail.type==1?'会籍费分佣账单':'会籍费分佣退款账单')}明细 
            </span>
        </div>

        <Table
            className={common.yzy_zd}
            columns={jyzdDetail.costType==51?jyzdDetail.type==1?columns1:columns2:jyzdDetail.type==1?columns3:columns4}
            dataSource={jyzdDetail.list}
            bordered
            pagination={pagination}
            scroll={{x:true}}
        />
        

      </Header>
    );

}

JyzdDetailPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,zdgl,jyzdDetail}) {
    return { menu,zdgl,jyzdDetail };
}

export default connect(mapStateToProps)(JyzdDetailPage);

