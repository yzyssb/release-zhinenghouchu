import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import Tabs from 'antd/lib/tabs';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import DatePicker from 'antd/lib/date-picker';
import Button from 'antd/lib/button';
import styles from './privateLess.less';
import Modal from 'antd/lib/modal';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import RouterRedux from 'dva/router';
const FormItem = Form.Item;

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

function CouponUsageDetail ({menu,yhqlb,dispatch,}) {

    const HeaderProps = {
        menu,
        dispatch,
    };
    function managerState(record,index) {
        if(record.state==2)
            return "未使用";
        else if(record.state==3)
            return "已使用";
        else if(record.state==4)
            return "已过期";
        else
            return "";
    }
    function managerTime(record,index) {
        return record.day_begin_time+"-"+record.day_end_time;
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '优惠券编号',
            dataIndex: 'number',
            key: 'number',
        },{
            title: '优惠券名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '优惠券编码',
            dataIndex: 'coupon_code',
            key: 'coupon_code',

        },{
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (text, record,index) => (
                managerState(record,index)
            ),
        },{
            title: '领券时间',
            dataIndex: 'coupon_time',
            key: 'coupon_time',
            // render: (text, record,index) => (
            //     managerWaiter(record,index)
            // ),
        },{
            title: '领取方式',
            dataIndex: 'coupon_type',
            key: 'coupon_type',
        },{
            title: '可用时段',
            dataIndex: 'day_begin_time -day_end_time',
            key: 'day_begin_time -day_end_time',
            render: (text, record,index) => (
                managerTime(record,index)
            ),
        },{
            title: '订单编号',
            key: 'order_id',
            dataIndex: 'order_id',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        },{
            title: '用户手机号',
            key: 'member_phone',
            dataIndex: 'member_phone',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        },{
            title: '面值',
            key: 'faceValue',
            dataIndex: 'faceValue',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        },{
            title: '满多少可用',
            key: 'arriveamount',
            dataIndex: 'arriveamount',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        }

    ];

    const pagination = {
        total: yhqlb.totalCount,
        current:yhqlb.getCouponRecordListCurrent,
        pageSize: yhqlb.size,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function onPageChange(pageNo){
        console.log(pageNo);
        var offset = pageNo*yhqlb.size-yhqlb.size;
        dispatch({type: 'yhqlb/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'yhqlb/query',payload:{}});


    }
    function SizeChange(current, pageSize){

        console.log(current, pageSize);
        dispatch({type: 'yhqlb/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'yhqlb/query',payload:{}});


    }
    function onKeywordChange(e) {
        dispatch({type: 'yhqlb/updatePayload',payload:{searchCouponId: e.target.value}});
    }
    function onKeywordChange1(e) {
        dispatch({type: 'yhqlb/updatePayload',payload:{searchCouponName: e.target.value}});
    }
    function onKeywordChange2(e) {
        dispatch({type: 'yhqlb/updatePayload',payload:{searchCouponName: e.target.value}});
    }
    function goSearch() {
        //TODO 完成优惠券查询接口
        dispatch({type: 'yhqlb/updatePayload'});
    }
    const formItemLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 16},
    };
    return(
        <Header {...HeaderProps}>
            <div>
                <div>
                    <Form className={styles.formwidthcoupon}   >
                        <FormItem
                            {...formItemLayout}
                            label="优惠券编号"
                            >

                            <Input  onChange = {onKeywordChange}/>

                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="惠券名称"
                            >
                            <Input   onChange = {onKeywordChange1}/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="用户手机号"
                            >
                            <Input   onChange = {onKeywordChange1}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="状态"
                            
                            className={styles.formwidth2} >
                            <Checkbox>未发送</Checkbox>
                            <Checkbox>未使用</Checkbox>
                            <Checkbox>已使用</Checkbox>
                            <Checkbox>已过期</Checkbox>
                        </FormItem>

                        <Button type="primary" htmlType="submit" style={{marginTop:20,float: 'right'}} onChange={goSearch}>查询</Button>
                    </Form>
                    <Table className={styles.table}
                           columns={columns}
                           dataSource={yhqlb.couponRecordList}
                           rowKey={record => record.date}
                           pagination={pagination}
                           bordered/>
                </div>

            </div>
        </Header>
    );

}

CouponUsageDetail.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,yhqlb }) {
    return { menu,yhqlb };
}

export default connect(mapStateToProps)(CouponUsageDetail);

