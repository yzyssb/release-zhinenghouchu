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
import Ctaigl_Child from '../../components/ctgl/ctaigl/Ctaigl_Child.jsx';
import Ctaigl_add from '../../components/ctgl/ctaigl/Ctaigl_add.jsx';
import Ctaigl_groupadd from '../../components/ctgl/ctaigl/Ctaigl_groupadd.jsx';
import Region_add from '../../components/ctgl/ctaigl/Region_add.jsx';
import Region_edit from '../../components/ctgl/ctaigl/Region_edit.jsx';
import CouponAdd from '../../components/marketing/CouponAddChoosePlace.jsx';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import RouterRedux from 'dva/router';
const FormItem = Form.Item;

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

function Coupon ({menu,yhqlb,dispatch,}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

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
            title: '优惠券',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '状态',
            dataIndex: 'state',
            key: 'state',
        },{
            title: '总量',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },{
            title: '已发送量',
            dataIndex: 'sendAmout',
            key: 'sendAmout',
        },{
            title: '面额',
            dataIndex: 'faceValue',
            key: 'faceValue',
        },{
            title: '有效期',
            dataIndex: 'effectiveate',
            key: 'effectiveate',
        },{
            title: '满多少可用',
            key: 'arriveamount',
            dataIndex: 'arriveamount',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        }
        ,{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record,index) => (
                managerHandle(record,index)
            ),
        }
    ];
    function stopUseItem(record) {
        dispatch({type: 'yhqlb/updatePayload',payload:{item:record}});
        dispatch({type: 'yhqlb/updateCoupon',payload:{}});
    }
    function couponDetail(record) {
        dispatch({type: 'yhqlb/updatePayload',payload:{item:record}});
        dispatch({type: 'yhqlb/getCoupon',payload:{}});
        dispatch(routerRedux.push({
            pathname: '/yhqlbCouponDetail',
            query: {},
        }));
    }
    function showHistory(record) {
        dispatch({type: 'yhqlb/updatePayload',payload:{item:record}});
        dispatch({type: 'yhqlb/getCouponRecordList',payload:{}});
        dispatch(routerRedux.push({
            pathname: '/yhqlbCouponUsageDetail',
            query: {},
        }));
    }
    function managerHandle(record,index){
        var handlebtn=[];

        handlebtn.push(<span key={index} ><a onClick={()=>{stopUseItem(record)}}>{ record.state==1?"停用":"启用"}</a>
        <span className="ant-divider" />
        <a onClick={() =>couponDetail(record)}>详情</a>
        <span className="ant-divider" />
        <a onClick={() =>showHistory(record)}>使用记录</a>
        </span>)


        return handlebtn;
    }
    const pagination = {
        total: yhqlb.cttotal,
        current:yhqlb.current,
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
    function goSearch() {
        //TODO 完成优惠券查询接口
        dispatch({type: 'yhqlb/query',payload:{}});
    }

    function gotoAddCoupon() {

        dispatch(routerRedux.push({
            pathname: '/yhqlbAddCoupon',
            query: {},
        }));
    }
    return(
        <Header {...HeaderProps}>
            <div>
                    <div>
                        <Form className={styles.formwidth}   >
                            <FormItem>

                            <span style={{marginLeft:20}}>优惠券编号</span><Input style = {{marginLeft:20, width:220}}  onChange = {onKeywordChange}/>
                            <span style={{marginLeft:20}}>优惠券名称</span><Input style = {{marginLeft:20, width:220}}  onChange = {onKeywordChange1}/>
                            <Button type="primary" style = {{marginLeft:40}} onClick={goSearch}>查询</Button>

                        </FormItem></Form>
                        <Button style={{marginLeft:20,marginTop:20}} onClick={gotoAddCoupon} >新增优惠券</Button>
                        <Table className={styles.table}
                               columns={columns}
                               dataSource={yhqlb.list}
                               rowKey={record => record.date}
                               pagination={pagination}
                               bordered/>
                    </div>

            </div>
        </Header>
    );

}

Coupon.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,yhqlb }) {
    return { menu,yhqlb };
}

export default connect(mapStateToProps)(Coupon);

