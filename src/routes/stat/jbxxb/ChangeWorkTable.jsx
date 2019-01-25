import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Header from '../../../components/Header';
import styles from './ChangeWorkTable.less';
import Form from "antd/lib/form/index";
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import ChangeWorkViews from '../../../components/smdc/jhxxb/ChangeWorkViews';

function ChangeWorkTable ({menu,changeWorkTable,dispatch}) {

    const {
        list, total, page
    } = changeWorkTable;

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

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'changeWorkTable/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                static_days:'0'
            }
        });
    };

    const search = () => {
        dispatch({
            type: 'changeWorkTable/updatePayload',
            payload: {
                page: 1
            }
        });
        dispatch({type: 'changeWorkTable/stat', payload: {}});
    };


    const columns = [
        {   title: '序号',
            dataIndex: 'key',
            key: 'key',
            render:(text,record,index)=>(
                changeWorkTable.size*(changeWorkTable.page-1)+index+1
            )
        },
        {
            title: '门店名称',
            dataIndex: 'orgName',
            key: 'orgName',
        },
        {
            title: '交班人',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '接班人',
            dataIndex: 'toName',
            key: 'toName',
        },
        {
            title: '班次',
            dataIndex: 'dutyId',
            key: 'dutyId',
        },
        {
            title: '接班时间',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: '交班时间',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: '应收金额',
            dataIndex: 'needMoney',
            key: 'needMoney',

        },
        {
            title: '实收结算金额',
            dataIndex: 'receiveMoney',
            key: 'receiveMoney',
        },
        {
            title: '备用金额',
            dataIndex: 'spareMoney',
            key: 'spareMoney',
        },
        {
            title: '现金支付金额',
            dataIndex: 'cashMoney',
            key: 'cashMoney',
        },
        {
            title: '银行卡支付金额',
            dataIndex: 'bankMoney',
            key: 'bankMoney',
        },
        {
            title: '优惠券金额',
            dataIndex: 'couponMoney',
            key: 'couponMoney',
        },
        {
            title: '团购卷金额',
            dataIndex: 'groupBuyMoney',
            key: 'groupBuyMoney',
        },
        {
            title: '会员卡金额',
            dataIndex: 'vipMoney',
            key: 'vipMoney',
        },
        {
            title: '微信支付金额',
            dataIndex: 'weixinMoney',
            key: 'weixinMoney',
        },
        {
            title: '支付宝支付金额',
            dataIndex: 'aliPayMoney',
            key: 'aliPayMoney',
        },
        {
            title: '消费单数',
            dataIndex: 'avgOrderMoney',
            key: 'avgOrderMoney'
        },
        {
            title: '单均',
            dataIndex: 'avgOrderMoney ',
            key: 'avgOrderMoney ',
        },
        {
            title: '消费人数',
            dataIndex: 'people',
            key: 'people',
        },
        {
            title: '人均消费',
            dataIndex: 'avgPeopleMoney',
            key: 'avgPeopleMoney',
        },
        {
            title: '赠菜金额',
            dataIndex: 'giftFoodMoney',
            key: 'giftFoodMoney',
        },

        {
            title: '折扣金额',
            dataIndex: 'discountMoney',
            key: 'discountMoney',
        },
        {
            title: '抹零金额',
            dataIndex: 'wipeMoney',
            key: 'wipeMoney',
        },
        {
            title: '服务费',
            dataIndex: 'serviceMoney',
            key: 'serviceMoney',
        },
        {
            title: '翻台率',
            dataIndex: 'turningrate',
            key: 'turningrate',
        },
        {
            title: '菜品合计金额',
            dataIndex: 'foodTotalMoney',
            key: 'foodTotalMoney',
        },

    ];

    function getUserToken() {

        const userStatus = myApp._store.getState().account.token;

        return userStatus;
        // test7
        // return "MV8xXzlfMTUyNDA0NTUwNTEyNg==";

    }
    const pagination = { //分页
        total: total,
        current: page,
        pageSize: changeWorkTable.size,
        
        onChange: (pageNo) => {
            dispatch({type: 'changeWorkTable/updatePayload', payload: {page: pageNo,start:pageNo-1}});
            dispatch({type: 'changeWorkTable/stat'});
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'changeWorkTable/updatePayload',payload:{size:pageSize,page:1,start:0}});
        dispatch({type: 'changeWorkTable/list',payload:{}});
    }

    function getOutForm() {
        
        document.getElementById("formOrderExport").submit();
    }

    function chooseStore() {
        dispatch({
            type: 'changeWorkTable/updatePayload',
            payload: {
                modalVisible: true
            }
        });
    }

    const ChangeWorkViewsProps = {
        changeWorkTable:changeWorkTable,
        dispatch:dispatch,
        modalVisible:changeWorkTable.modalVisible,
    };

    function multipleChange(key){
        let resIdOrgNameMap={},restaurantIds=[],restaurantNames=[]
        changeWorkTable.listValue.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(value.id)
                    restaurantNames.push(value.name)
                }
            })
        })
        dispatch({
            type:'changeWorkTable/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap,restaurantNames:restaurantNames}
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
            type:'changeWorkTable/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    return(
        <Header {...HeaderProps}>
            <div>
                <Form style={{margin:'20px 0'}}>
                    <Form.Item {...formItemLayout} label="选择时间:">
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(changeWorkTable.startTime), moment(changeWorkTable.endTime)]}
                          allowClear={false}
                          onChange={onSearchDateChange}
                        />
                        <span>
                            {changeWorkTable.static_days=='1'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(1)}>今天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(1)}>今天</a>
                            )}
                            {changeWorkTable.static_days=='2'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(2)}>昨天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(2)}>昨天</a>
                            )}
                            {changeWorkTable.static_days=='7'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(7)}>近7天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(7)}>近7天</a>
                            )}
                            {changeWorkTable.static_days=='15'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(15)}>近15天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(15)}>近15天</a>
                            )}
                            {changeWorkTable.static_days=='30'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(30)}>近30天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(30)}>近30天</a>
                            )}
                        </span>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="选择门店:">
                        <Select
                            mode="multiple"
                            placeholder="请选择门店"
                            onChange={multipleChange}
                            style={{width:350}}
                            value={changeWorkTable.restaurantNames}
                        >
                            {changeWorkTable.listValue.map((val,idx)=>(
                                <Option key={String(val.id)}>{val.name}</Option>
                            ))}
                        </Select>
                        <Button size="default" style={{margin:'0 20px'}} type="primary" onClick={search}>搜索</Button>
                        <Button size="default" onClick={getOutForm}>导出</Button>
                    </Form.Item>
                </Form>

                {/*<div style={{marginBottom:20,marginLeft:'16.67%'}}>
                    <Button size="default" type="warn" onClick={chooseStore}>选择门店</Button>
                    
                </div>*/}


                <form action={changeWorkTable.linkOrigin+'report-api/report/export/duty'} method="post"  id='formOrderExport'>

                    <input type="hidden" name="restaurantIds" value = {JSON.stringify(changeWorkTable.restaurantIds)} id='pay_way'/>
                    <input type="hidden" name="startTime" value = {new Date(changeWorkTable.startTime).getTime()}/>
                    <input type="hidden" name="endTime" value = {new Date(changeWorkTable.endTime).getTime()}/>
                    <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(changeWorkTable.resIdOrgNameMap)}/>

                </form>





                <div className={styles.tabScroll}>
                    <Table
                    columns={columns}
                    dataSource={changeWorkTable.list}
                    pagination={pagination}
                    className={styles.jbxxbtab}
                    bordered/>
                </div>

                <ChangeWorkViews {...ChangeWorkViewsProps}></ChangeWorkViews>

            </div>

        </Header>
    );

}

ChangeWorkTable.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,changeWorkTable}) {
    return { menu,changeWorkTable };
}


export default connect(mapStateToProps)(ChangeWorkTable);