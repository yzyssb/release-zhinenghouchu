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
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
import styles from './XjrbPage.less';
import message from 'antd/lib/message';
import common from '../common.less';


function XjrbPage ({menu,dispatch,xjrb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function jump(href){
        dispatch(routerRedux.push({
            pathname: href,
            query: {}
        }));
    }

    const column=[
        {
            title:'序号',
            dataIndex:'key1',
            key:'key1',
            render:(text,record,index)=>(
                <span>
                    {
                        index==0?'一':
                        index==1?'二':
                        index==2?'三':
                        index==3?(<span className={styles.textRight}>1</span>):
                        index==4?(<span className={styles.textRight}>2</span>):
                        index==5?(<span className={styles.textRight}>3</span>):
                        index==6?(<span className={styles.textRight}>4</span>):
                        index==7?(<span className={styles.textRight}>5</span>):
                        index==8?(<span className={styles.textRight}>6</span>):
                        index==9?(<span className={styles.textRight}>7</span>):
                        index==10?(<span className={styles.textRight}>8</span>):
                        index==11?(<span className={styles.textRight}>9</span>):
                        index==12?(<span className={styles.textRight}>10</span>):
                        index==13?'四':
                        index==14?'五':
                        index==15?'六':
                        index==16?'七':
                        index==17?'八':
                        index==18?'九':
                        index==19?(<span className={styles.textRight}>1</span>):
                        index==20?(<span className={styles.textRight}>2</span>):
                        index==21?(<span className={styles.textRight}>3</span>):''
                    }
                </span>
            )
        },
        {
            title:'大类',
            dataIndex:'key2',
            key:'key2',
            render:(text,record,index)=>(
                <span>
                    {
                       index==0?(<span><span style={{color:"red"}}>*</span>营业收入</span>):
                        index==1?(<span><span style={{color:"red"}}>*</span>成本支出</span>):
                        index==2?'费用支出':
                        index==3?(<span className={styles.textRight}>工资薪酬</span>):
                        index==4?(<span className={styles.textRight}>经营房租</span>):
                        index==5?(<span className={styles.textRight}>能源费</span>):
                        index==6?(<span className={styles.textRight}>招聘猎头费</span>):
                        index==7?(<span className={styles.textRight}>差旅费</span>):
                        index==8?(<span className={styles.textRight}>招待费</span>):
                        index==9?(<span className={styles.textRight}>咨询培训顾问</span>):
                        index==10?(<span className={styles.textRight}>市场营销费</span>):
                        index==11?(<span className={styles.textRight}>IT服务费</span>):
                        index==12?(<span className={styles.textRight}>其他费用</span>):
                        index==13?'财务费用':
                        index==14?'考核利润':
                        index==15?'折旧摊销':
                        index==16?'分红':
                        index==17?'净利润':
                        index==18?'账户资金':
                        index==19?(<span className={styles.textRight}>总应收款</span>):
                        index==20?(<span className={styles.textRight}>总应付款</span>):
                        index==21?(<span className={styles.textRight}>资金余额</span>):'' 
                    }
                </span>
            )
        },
        {
            title:'金额（单位：万元）',
            dataIndex:'key3',
            key:'key3',
            render:(text,record,index)=>(
                <span>{
                    index==2?(
                        ''
                    ):index==14?(
                        ''
                    ):index==17?(
                        ''
                    ):index==21?(
                        ''
                    ):(
                        <span>{xjrb.get_restaurantId?(
                            index==0?(
                                <Input style={{textAlign:"right"}} value={!xjrb.businessIn?'':xjrb.businessIn} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==1?(
                                <Input style={{textAlign:"right"}} value={!xjrb.costOut?'':xjrb.costOut} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==3?(
                                <Input style={{textAlign:"right"}} value={!xjrb.salary?'':xjrb.salary} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==4?(
                                <Input style={{textAlign:"right"}} value={!xjrb.houseRent?'':xjrb.houseRent} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==5?(
                                <Input style={{textAlign:"right"}} value={!xjrb.energy?'':xjrb.energy} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==6?(
                                <Input style={{textAlign:"right"}} value={!xjrb.recruit?'':xjrb.recruit} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==7?(
                                <Input style={{textAlign:"right"}} value={!xjrb.travel?'':xjrb.travel} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==8?(
                                <Input style={{textAlign:"right"}} value={!xjrb.entertain?'':xjrb.entertain} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==9?(
                                <Input style={{textAlign:"right"}} value={!xjrb.train?'':xjrb.train} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==10?(
                                <Input style={{textAlign:"right"}} value={!xjrb.marketing?'':xjrb.marketing} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==11?(
                                <Input style={{textAlign:"right"}} value={!xjrb.itService?'':xjrb.itService} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==12?(
                                <Input style={{textAlign:"right"}} value={!xjrb.otherOut?'':xjrb.otherOut} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==13?(
                                <Input style={{textAlign:"right"}} value={!xjrb.finance?'':xjrb.finance} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==15?(
                                <Input style={{textAlign:"right"}} value={!xjrb.depreciation?'':xjrb.depreciation} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==16?(
                                <Input style={{textAlign:"right"}} value={!xjrb.dividend?'':xjrb.dividend} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==18?(
                                <Input style={{textAlign:"right"}} value={!xjrb.account?'':xjrb.account} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==19?(
                                <Input style={{textAlign:"right"}} value={!xjrb.totalRecv?'':xjrb.totalRecv} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==20?(
                                <Input style={{textAlign:"right"}} value={!xjrb.totalNeed?'':xjrb.totalNeed} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):index==21?(
                                <Input style={{textAlign:"right"}} value={!xjrb.balance?'':xjrb.balance} onChange={(e)=>editMoney(e,text,record,index)} />
                            ):('')
                        ):(
                            <Input style={{textAlign:"right"}} onChange={(e)=>editMoney(e,text,record,index)} />
                        )}</span>
                    )
                }</span>
            )
        },
        {
            title:'备注',
            dataIndex:'key4',
            key:'key4',
            render:(text,record,index)=>(
                <span>{
                    index==2?(
                        <span className={styles.textCenter}>费用合计</span>
                    ):index==14?(
                        <span className={styles.textCenter}>营业收入-成本支出-费用支出-财务费用</span>
                    ):index==17?(
                        <span className={styles.textCenter}>考核利润-折旧摊销-分红</span>
                    ):index==21?(
                        <span className={styles.textCenter}>账户资金+总应收款-总应付款</span>
                    ):(
                        <span>{xjrb.get_restaurantId?(
                            index==0?(
                                <Input style={{textAlign:"left"}} value={xjrb.businessInMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==1?(
                                <Input style={{textAlign:"left"}} value={xjrb.costOutMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==3?(
                                <Input style={{textAlign:"left"}} value={xjrb.salaryMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==4?(
                                <Input style={{textAlign:"left"}} value={xjrb.houseRentMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==5?(
                                <Input style={{textAlign:"left"}} value={xjrb.energyMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==6?(
                                <Input style={{textAlign:"left"}} value={xjrb.recruitMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==7?(
                                <Input style={{textAlign:"left"}} value={xjrb.travelMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==8?(
                                <Input style={{textAlign:"left"}} value={xjrb.entertainMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==9?(
                                <Input style={{textAlign:"left"}} value={xjrb.trainMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==10?(
                                <Input style={{textAlign:"left"}} value={xjrb.marketingMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==11?(
                                <Input style={{textAlign:"left"}} value={xjrb.itServiceMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==12?(
                                <Input style={{textAlign:"left"}} value={xjrb.otherOutMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==13?(
                                <Input style={{textAlign:"left"}} value={xjrb.financeMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==15?(
                                <Input style={{textAlign:"left"}} value={xjrb.depreciationMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==16?(
                                <Input style={{textAlign:"left"}} value={xjrb.dividendMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==18?(
                                <Input style={{textAlign:"left"}} value={xjrb.accountMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==19?(
                                <Input style={{textAlign:"left"}} value={xjrb.totalRecvMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==20?(
                                <Input style={{textAlign:"left"}} value={xjrb.totalNeedMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):index==21?(
                                <Input style={{textAlign:"left"}} value={xjrb.balanceMark} onChange={(e)=>editMsg(e,text,record,index)} />
                            ):('')
                        ):(
                            <Input style={{textAlign:'left'}} onChange={(e)=>editMsg(e,text,record,index)} />
                        )}</span>
                    )
                }</span>
            )
        }
    ]

    function editMoney(e,text,record,index){
        console.log(e.target.value,text,record,index)
        let a=e.target.value
        if(isNaN(a)){
            message.error('请输入数字，并且小数只可保留两位')
            e.target.value=''
            return
        }
        if(index==0){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    businessIn:e.target.value
                }
            })
        }else if(index==1){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    costOut:e.target.value
                }
            })
        }else if(index==2){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    chargeOut:e.target.value
                }
            })
        }else if(index==3){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    salary:e.target.value
                }
            })
        }else if(index==4){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    houseRent:e.target.value
                }
            })
        }else if(index==5){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    energy:e.target.value
                }
            })
        }else if(index==6){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    recruit:e.target.value
                }
            })
        }else if(index==7){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    travel:e.target.value
                }
            })
        }else if(index==8){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    entertain:e.target.value
                }
            })
        }else if(index==9){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    train:e.target.value
                }
            })
        }else if(index==10){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    marketing:e.target.value
                }
            })
        }else if(index==11){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    itService:e.target.value
                }
            })
        }else if(index==12){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    otherOut:e.target.value
                }
            })
        }else if(index==13){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    finance:e.target.value
                }
            })
        }else if(index==14){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    checkProfit:e.target.value
                }
            })
        }else if(index==15){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    depreciation:e.target.value
                }
            })
        }else if(index==16){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    dividend:e.target.value
                }
            })
        }else if(index==17){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    realProfit:e.target.value
                }
            })
        }else if(index==18){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    account:e.target.value
                }
            })
        }else if(index==19){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    totalRecv:e.target.value
                }
            })
        }else if(index==20){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    totalNeed:e.target.value
                }
            })
        }else if(index==21){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    balance:e.target.value
                }
            })
        }
        
    }

    function editMsg(e,text,record,index){
        console.log(e.target.value,text,record,index)
        if(index==0){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    businessInMark:e.target.value
                }
            })
        }else if(index==1){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    costOutMark:e.target.value
                }
            })
        }else if(index==2){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    chargeOutMark:e.target.value
                }
            })
        }else if(index==3){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    salaryMark:e.target.value
                }
            })
        }else if(index==4){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    houseRentMark:e.target.value
                }
            })
        }else if(index==5){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    energyMark:e.target.value
                }
            })
        }else if(index==6){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    recruitMark:e.target.value
                }
            })
        }else if(index==7){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    travelMark:e.target.value
                }
            })
        }else if(index==8){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    entertainMark:e.target.value
                }
            })
        }else if(index==9){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    trainMark:e.target.value
                }
            })
        }else if(index==10){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    marketingMark:e.target.value
                }
            })
        }else if(index==11){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    itServiceMark:e.target.value
                }
            })
        }else if(index==12){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    otherOutMark:e.target.value
                }
            })
        }else if(index==13){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    financeMark:e.target.value
                }
            })
        }else if(index==14){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    checkProfitMark:e.target.value
                }
            })
        }else if(index==15){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    depreciationMark:e.target.value
                }
            })
        }else if(index==16){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    dividendMark:e.target.value
                }
            })
        }else if(index==17){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    realProfitMark:e.target.value
                }
            })
        }else if(index==18){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    accountMark:e.target.value
                }
            })
        }else if(index==19){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    totalRecvMark:e.target.value
                }
            })
        }else if(index==20){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    totalNeedMark:e.target.value
                }
            })
        }else if(index==21){
            dispatch({
                type:'xjrb/updatePayload',
                payload:{
                    balanceMark:e.target.value
                }
            })
        }
    }

    let list=[]
    for(let i=0;i<22;i++){
        list.push({key:i})
    }

    function chooseDate(key1,key2){
        console.log(key1,key2)
        console.log( moment(new Date(key2)).format('YYYY-MM-DD 00:00:00') )
        dispatch({
            type:'xjrb/updatePayload',
            payload:{targetTime:moment(new Date(key2)).format('YYYY-MM-DD 00:00:00')}
        })
    }

    function chooseRes(e){
        console.log(e)
        for(let i=0;i<xjrb.restaurantList.length;i++){
            if(xjrb.restaurantList[i].id==e){
                dispatch({
                    type:'xjrb/updatePayload',
                    payload:{restaurantId:+e,restaurantName:xjrb.restaurantList[i].name}
                })
            }
        }
        
    }

    let reg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    function confirmAction(){
        if(!xjrb.restaurantId){
            message.error('请选择门店')
            return
        }
        if(!xjrb.businessIn){
            message.error('请输入"营业收入"金额')
            return
        }
        if(!xjrb.costOut){
            message.error('请输入"成本支出"金额')
            return
        }
        if(xjrb.businessIn>0&&!reg.test(xjrb.businessIn)){
            message.error('请输入保留两位小数的"营业收入"金额')
            return
        }
        if(xjrb.costOut>0&&!reg.test(xjrb.costOut)){
            message.error('请输入保留两位小数的"成本支出"金额')
            return
        }
        if(xjrb.salary>0&&!reg.test(xjrb.salary)){
            message.error('请输入保留两位小数的"工资薪酬"金额')
            return
        }
        if(xjrb.houseRent>0&&!reg.test(xjrb.houseRent)){
            message.error('请输入保留两位小数的"经营房租"金额')
            return
        }
        if(xjrb.energy>0&&!reg.test(xjrb.energy)){
            message.error('请输入保留两位小数的"能源费"金额')
            return
        }
        if(xjrb.recruit>0&&!reg.test(xjrb.recruit)){
            message.error('请输入保留两位小数的"招聘猎头费"金额')
            return
        }
        if(xjrb.travel>0&&!reg.test(xjrb.travel)){
            message.error('请输入保留两位小数的"差旅费"金额')
            return
        }
        if(xjrb.entertain>0&&!reg.test(xjrb.entertain)){
            message.error('请输入保留两位小数的"招待费"金额')
            return
        }
        if(xjrb.train>0&&!reg.test(xjrb.train)){
            message.error('请输入保留两位小数的"咨询培训顾问"金额')
            return
        }
        if(xjrb.marketing>0&&!reg.test(xjrb.marketing)){
            message.error('请输入保留两位小数的"市场营销费"金额')
            return
        }
        if(xjrb.itService>0&&!reg.test(xjrb.itService)){
            message.error('请输入保留两位小数的"IT服务费"金额')
            return
        }
        if(xjrb.otherOut>0&&!reg.test(xjrb.otherOut)){
            message.error('请输入保留两位小数的"其他费用"金额')
            return
        }
        if(xjrb.finance>0&&!reg.test(xjrb.finance)){
            message.error('请输入保留两位小数的"财务费用"金额')
            return
        }
        if(xjrb.depreciation>0&&!reg.test(xjrb.depreciation)){
            message.error('请输入保留两位小数的"折旧摊销"金额')
            return
        }
        if(xjrb.dividend>0&&!reg.test(xjrb.dividend)){
            message.error('请输入保留两位小数的"分红"金额')
            return
        }
        if(xjrb.account>0&&!reg.test(xjrb.account)){
            message.error('请输入保留两位小数的"账户资金"金额')
            return
        }
        if(xjrb.totalRecv>0&&!reg.test(xjrb.totalRecv)){
            message.error('请输入保留两位小数的"总应收款"金额')
            return
        }
        if(xjrb.totalNeed>0&&!reg.test(xjrb.totalNeed)){
            message.error('请输入保留两位小数的"总应付款"金额')
            return
        }

        dispatch({
            type:'xjrb/financeDayIn',
            payload:{}
        })
    }

    function cancelAction(){
        dispatch(routerRedux.push({
            pathname: '/xjbbInfo',
            query: {tab:1}
        }));
    }

    
    return(
      <Header {...HeaderProps}>
        <Spin spinning={xjrb.loading} style={{position:'absolute',width:'calc(1200px - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div style={{padding:10,backgroundColor:'#eee',marginBottom:10}}>录入日报</div>
        <div style={{margin:"20px 0 20px 190px"}}>
            <span>
                <span style={{marginRight:20}}>选择日期（必选）：</span>
                {xjrb.get_restaurantId?(
                    <DatePicker onChange={chooseDate} allowClear={false} disabled value={moment(xjrb.targetTime)} />
                ):(
                    <DatePicker onChange={chooseDate} allowClear={false} value={moment(xjrb.targetTime)} />
                )}
            </span>
            <span style={{marginLeft:50}}>
                <span style={{marginRight:20}}>选择餐厅（必选）：</span>
                {xjrb.get_restaurantId?(
                    <Select style={{width:200}} onChange={chooseRes} disabled value={String(xjrb.restaurantId)}>
                        {xjrb.restaurantList.length>0&&xjrb.restaurantList.map((v,i)=>(
                            <Option key={String(v.id)}>{v.name}</Option>
                        ))}
                    </Select>
                ):xjrb.restaurantList.length==1?(
                    <Select style={{width:200}} onChange={chooseRes} value={String(xjrb.restaurantId)}>
                        {xjrb.restaurantList.length>0&&xjrb.restaurantList.map((v,i)=>(
                            <Option key={String(v.id)}>{v.name}</Option>
                        ))}
                    </Select> 
                ):(
                    <Select style={{width:200}} placeholder="选择餐厅" onChange={chooseRes}>
                        {xjrb.restaurantList.length>0&&xjrb.restaurantList.map((v,i)=>(
                            <Option key={String(v.id)}>{v.name}</Option>
                        ))}
                    </Select>
                )}
                
            </span>
        </div>

        <div style={{width:'900px',marginLeft:100}}>
            <Table
                className={common.yzy}
                columns={column}
                dataSource={list}
                bordered
                pagination={false}
                size="small"
            />
            <div style={{textAlign:'center',padding:'50px 0'}}>
                <Button type="primary" onClick={confirmAction}>保存</Button>
                <Button style={{marginLeft:100}} onClick={cancelAction}>取消</Button>
            </div>
        </div>

      </Header>
    );

}

XjrbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,xjrb}) {
    return { menu,xjrb };
}

export default connect(mapStateToProps)(XjrbPage);

