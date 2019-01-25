import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import {connect} from 'dva';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Table from 'antd/lib/table';
import Form from "antd/lib/form/index";
import Select from "antd/lib/select";
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';

import styles from './bill.less';

function PayPage({menu, dispatch, payStat, store}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const {list, total, page} = payStat;

    const columns = [
        {title: '餐厅名称', dataIndex: 'orgName', key: 'orgName',},
        {title: '现金支付', dataIndex: 'cashMoney', key: 'cashMoney',},
        {title: '微信支付金额', dataIndex: 'weixinMoney', key: 'weixinMoney',},
        {title: '支付宝支付金额', dataIndex: 'aliPayMoney', key: 'aliPayMoney',},
        {title: '银行卡支付金额', dataIndex: 'bankMoney', key: 'bankMoney',},
        {title: '第三方支付金额', dataIndex: 'thirdPayMoney', key: 'thirdPayMoney',},
        {title: '优惠券支付金额', dataIndex: 'couponMoney', key: 'couponMoney',},
        {title: '团购券支付金额', dataIndex: 'groupBuyMoney', key: 'groupBuyMoney',},
        {title: '会员主账户支付金额', dataIndex: 'vipMoney', key: 'vipMoney',},
    ];

    const pagination = { //分页
        total: total,
        current: page,
        pageSize: payStat.size,
        
        onChange: (pageNo) => {
            dispatch({type: 'payStat/updatePayload', payload: {page: pageNo}});
            dispatch({type: 'payStat/list',payload:{}});
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'payStat/updatePayload',payload:{size:pageSize,page:1,start:0,offset:0}});
        dispatch({type: 'payStat/list',payload:{}});
    }

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'payStat/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                static_days:'0'
            }
        });
    };

    const search = () => {
        dispatch({
            type: 'payStat/updatePayload',
            payload: {
                page: 1
            }
        });
        dispatch({type: 'payStat/list', payload: {}});
        dispatch({type: 'payStat/stat', payload: {}});
    };
    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
        if(t==1){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==2){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==7){
            startTime=moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(15, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'payStat/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    return (
        <Header {...HeaderProps}>
            <div>
                
                <Form style={{margin:'20px 0'}}>
                    <Form.Item {...formItemLayout} label="选择时间:">
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(payStat.startTime), moment(payStat.endTime)]}
                          allowClear={false}
                          onChange={onSearchDateChange}
                        />
                        <span>
                            {payStat.static_days=='1'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(1)}>今天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(1)}>今天</a>
                            )}
                            {payStat.static_days=='2'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(2)}>昨天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(2)}>昨天</a>
                            )}
                            {payStat.static_days=='7'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(7)}>近7天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(7)}>近7天</a>
                            )}
                            {payStat.static_days=='15'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(15)}>近15天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(15)}>近15天</a>
                            )}
                            {payStat.static_days=='30'?(
                                <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(30)}>近30天</a>
                            ):(
                                <a style={{marginLeft:20}} onClick={()=>chooseDuration(30)}>近30天</a>
                            )}
                        </span>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="选择门店:">
                        <Select placeholder="请选择门店" mode="multiple" value={payStat.restaurantNames} style={{width: 350}} onChange={(key, option) => {
                            let restaurantNames=[]
                            payStat.all.forEach((value,index)=>{
                                key.forEach((val,idx)=>{
                                    if(val==value.id){
                                        restaurantNames.push(value.name)
                                    }
                                })
                            })
                            dispatch({
                                type:'payStat/updatePayload',
                                payload:{restaurantNames:restaurantNames}
                            })
                            dispatch({
                                type: 'payStat/updatePayload',
                                payload: {
                                    restaurantIds: key
                                }
                            });
                        }}>
                            {payStat.all&&payStat.all.map((item) => <Select.Option key = {item.id} value={item.id}>{item.name}</Select.Option>)}
                        </Select>
                        <Button size="default" style={{margin:'0 20px'}} type="primary" onClick={search}>搜索</Button>
                        <Button size="default" onClick={
                            () => {
                                dispatch({
                                    type: 'payStat/_export',
                                    payload: {}
                                })
                            }
                        }>导出</Button>
                    </Form.Item> 
                </Form>

                <Row gutter={16} className={styles.statRow}>
                    <Col span={3} className={styles.statCol}>
                        <div>现金支付</div>
                        <div>{payStat.stat.cashMoney?payStat.stat.cashMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>微信支付</div>
                        <div>{payStat.stat.weixinMoney?payStat.stat.weixinMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>支付宝支付</div>
                        <div>{payStat.stat.aliPayMoney?payStat.stat.aliPayMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>银行卡支付</div>
                        <div>{payStat.stat.bankMoney?payStat.stat.bankMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>第三方支付</div>
                        <div>{payStat.stat.thirdPayMoney?payStat.stat.thirdPayMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>优惠券支付</div>
                        <div>{payStat.stat.couponMoney?payStat.stat.couponMoney:'0.00'}</div>
                    </Col>
                    <Col span={3} className={styles.statCol}>
                        <div>团购券支付</div>
                        <div>{payStat.stat.groupBuyMoney?payStat.stat.groupBuyMoney:'0.00'}</div>
                    </Col>
                    <Col span={3}>
                        <div>会员主账户支付</div>
                        <div>{payStat.stat.vipMoney?payStat.stat.vipMoney:'0.00'}</div>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={list}
                    rowKey={record => record.restaurantId}
                    pagination={pagination}
                    bordered/>
            </div>
        </Header>
    );

}

PayPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, payStat, store}) {
    return {menu, payStat, store};
}

export default connect(mapStateToProps)(PayPage);

